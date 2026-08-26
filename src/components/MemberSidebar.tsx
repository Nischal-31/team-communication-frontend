import { useState } from "react";
import type { TeamMember } from "../types";

interface Props {
    members: TeamMember[];
    currentUserId: number | null;

    onAddMember: (
        username: string
    ) => Promise<void>;

    onPromote: (
        userId: number,
        role: "ADMIN" | "MEMBER"
    ) => void;

    onRemove: (
        userId: number
    ) => void;
}

export default function MemberSidebar({
    members,
    currentUserId,
    onAddMember,
    onPromote,
    onRemove
}: Props) {

    const [showAddMember, setShowAddMember] =
        useState(false);

    const [username, setUsername] =
        useState("");

    const [adding, setAdding] =
        useState(false);

    const [error, setError] =
        useState("");

    /*
     * Determine the current user's membership
     * directly from the loaded team members.
     */
    const currentMember =
        members.find(
            (member) =>
                member.userId === currentUserId
        );

    /*
     * ONLY OWNER can add/manage members.
     */
    const canManageMembers =
        currentMember?.role === "OWNER";

    async function handleAddMember() {

        const value =
            username.trim();

        if (!value) {
            setError(
                "Username is required."
            );

            return;
        }

        setError("");
        setAdding(true);

        try {

            await onAddMember(value);

            setUsername("");
            setShowAddMember(false);

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to add member."
            );

        } finally {

            setAdding(false);
        }
    }

    return (
        <aside className="member-sidebar">

            {/* =================================
                MEMBERS HEADER
            ================================= */}

            <div className="members-header">

                <h3>
                    MEMBERS ({members.length})
                </h3>

                {canManageMembers && (
                    <button
                        type="button"
                        className="member-add-button"
                        onClick={() => {

                            setError("");

                            setShowAddMember(
                                (current) =>
                                    !current
                            );
                        }}
                        title="Add member"
                        aria-label="Add member"
                    >
                        +
                    </button>
                )}

            </div>

            {/* =================================
                ADD MEMBER FORM
            ================================= */}

            {canManageMembers &&
                showAddMember && (

                    <div className="add-member-form">

                        <input
                            type="text"
                            value={username}
                            placeholder="Enter username"
                            onChange={(event) =>
                                setUsername(
                                    event.target.value
                                )
                            }
                            onKeyDown={(event) => {

                                if (
                                    event.key ===
                                    "Enter"
                                ) {
                                    void handleAddMember();
                                }

                                if (
                                    event.key ===
                                    "Escape"
                                ) {
                                    setShowAddMember(
                                        false
                                    );

                                    setUsername("");
                                    setError("");
                                }
                            }}
                            disabled={adding}
                            autoFocus
                        />

                        <div className="add-member-actions">

                            <button
                                type="button"
                                onClick={() =>
                                    void handleAddMember()
                                }
                                disabled={
                                    adding ||
                                    !username.trim()
                                }
                            >
                                {adding
                                    ? "Adding..."
                                    : "Add"}
                            </button>

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={() => {

                                    setShowAddMember(
                                        false
                                    );

                                    setUsername("");
                                    setError("");
                                }}
                                disabled={adding}
                            >
                                Cancel
                            </button>

                        </div>

                        {error && (
                            <div className="member-error">
                                {error}
                            </div>
                        )}

                    </div>
                )}

            {/* =================================
                MEMBER LIST
            ================================= */}

            {members.map((member) => {

                const isCurrentUser =
                    member.userId ===
                    currentUserId;

                const canEditMember =
                    canManageMembers &&
                    !isCurrentUser &&
                    member.role !== "OWNER";

                return (
                    <div
                        key={member.userId}
                        className="member-item"
                    >

                        <div className="avatar">
                            {member.username
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="member-info">

                            <strong>

                                {member.username}

                                {isCurrentUser && (
                                    <span className="you-label">
                                        {" "}you
                                    </span>
                                )}

                            </strong>

                            <span>
                                {member.role}
                            </span>

                        </div>

                        {canEditMember && (

                            <div className="member-actions">

                                {member.role ===
                                "MEMBER" ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onPromote(
                                                member.userId,
                                                "ADMIN"
                                            )
                                        }
                                    >
                                        Admin
                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onPromote(
                                                member.userId,
                                                "MEMBER"
                                            )
                                        }
                                    >
                                        Member
                                    </button>

                                )}

                                <button
                                    type="button"
                                    onClick={() =>
                                        onRemove(
                                            member.userId
                                        )
                                    }
                                >
                                    Remove
                                </button>

                            </div>
                        )}

                    </div>
                );
            })}

        </aside>
    );
}