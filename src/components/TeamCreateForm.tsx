import { useState } from "react";
import { createTeam } from "../Services/api";
import type { Team } from "../types";

interface Props {
    onCreated: (team: Team) => void;
    onClose: () => void;
}

export default function TeamCreateForm({
    onCreated,
    onClose
}: Props) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Team name is required.");
            return;
        }

        setLoading(true);

        try {
            const team = await createTeam({
                name: name.trim(),
                description: description.trim()
            });

            onCreated(team);

        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create team."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">

                <div className="modal-header">
                    <h2>Create Team</h2>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="team-name">
                            Team name
                        </label>

                        <input
                            id="team-name"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Engineering"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="team-description">
                            Description
                        </label>

                        <textarea
                            id="team-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Engineering collaboration"
                            disabled={loading}
                            rows={4}
                        />
                    </div>

                    {error && (
                        <div className="error">
                            {error}
                        </div>
                    )}

                    <div className="modal-actions">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={
                                loading ||
                                !name.trim()
                            }
                        >
                            {loading
                                ? "Creating..."
                                : "Create Team"}
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
}