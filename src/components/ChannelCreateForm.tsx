import { useState } from "react";
import { createChannel } from "../Services/api";
import type { Channel } from "../types";

interface Props {
    teamId: number;
    onCreated: (channel: Channel) => void;
    onClose: () => void;
}

export default function ChannelCreateForm({
    teamId,
    onCreated,
    onClose
}: Props) {

    const [name, setName] = useState("");
    const [description, setDescription] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");

        if (!name.trim()) {
            setError("Channel name is required.");
            return;
        }

        setLoading(true);

        try {

            const channel =
                await createChannel(
                    teamId,
                    {
                        name: name.trim(),
                        description:
                            description.trim()
                    }
                );

            onCreated(channel);

        } catch (error) {

            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to create channel."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">

                <div className="modal-header">
                    <h2>Create Channel</h2>

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
                        <label htmlFor="channel-name">
                            Channel name
                        </label>

                        <input
                            id="channel-name"
                            value={name}
                            onChange={(event) =>
                                setName(
                                    event.target.value
                                )
                            }
                            placeholder="backend"
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="channel-description">
                            Description
                        </label>

                        <textarea
                            id="channel-description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            placeholder="Backend discussions"
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
                                : "Create Channel"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}