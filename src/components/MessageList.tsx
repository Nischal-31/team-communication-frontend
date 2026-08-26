import { useState } from "react";
import type { Message } from "../types";

interface Props {
    messages: Message[];
    currentUsername: string | null;
    canModerate: boolean;
    onEdit: (
        messageId: number,
        content: string
    ) => void;
    onDelete: (
        messageId: number
    ) => void;
}

export default function MessageList({
    messages,
    currentUsername,
    canModerate,
    onEdit,
    onDelete
}: Props) {

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [editText, setEditText] =
        useState("");

    function startEdit(message: Message) {
        setEditingId(message.id);
        setEditText(message.content);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditText("");
    }

    function saveEdit(messageId: number) {

        const content = editText.trim();

        if (!content) {
            return;
        }

        onEdit(messageId, content);

        setEditingId(null);
        setEditText("");
    }

    if (messages.length === 0) {
        return (
            <section className="message-list">
                <div className="empty-state">
                    No messages yet.
                </div>
            </section>
        );
    }

    return (
        <section className="message-list">

            {messages.map((message) => {

                const isOwnMessage =
                    message.senderUsername ===
                    currentUsername;

                const canEdit =
                    isOwnMessage;

                const canDelete =
                    isOwnMessage ||
                    canModerate;

                return (
                    <article
                        key={message.id}
                        className="message"
                    >

                        <div className="avatar">
                            {message.senderUsername
                                .charAt(0)
                                .toUpperCase()}
                        </div>

                        <div className="message-body">

                            <div className="message-meta">

                                <strong>
                                    {message.senderUsername}
                                </strong>

                                <span>
                                    {new Date(
                                        message.createdAt
                                    ).toLocaleTimeString(
                                        [],
                                        {
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        }
                                    )}
                                </span>

                                {message.updatedAt !==
                                    message.createdAt && (
                                    <span className="edited-label">
                                        edited
                                    </span>
                                )}

                            </div>

                            {editingId === message.id ? (
                                <div className="message-edit">

                                    <textarea
                                        value={editText}
                                        onChange={(event) =>
                                            setEditText(
                                                event.target.value
                                            )
                                        }
                                        autoFocus
                                    />

                                    <div className="message-edit-actions">

                                        <button
                                            onClick={() =>
                                                saveEdit(
                                                    message.id
                                                )
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            className="secondary-button"
                                            onClick={
                                                cancelEdit
                                            }
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                </div>
                            ) : (
                                <p>
                                    {message.content}
                                </p>
                            )}

                            {editingId !== message.id && (
                                <div className="message-actions">

                                    {canEdit && (
                                        <button
                                            onClick={() =>
                                                startEdit(
                                                    message
                                                )
                                            }
                                        >
                                            Edit
                                        </button>
                                    )}

                                    {canDelete && (
                                        <button
                                            onClick={() =>
                                                onDelete(
                                                    message.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    )}

                                </div>
                            )}

                        </div>

                    </article>
                );
            })}

        </section>
    );
}