import type {
    Channel,
    Team
} from "../types";

interface Props {
    team: Team | null;
    channels: Channel[];
    selectedChannel: Channel | null;
    connected: boolean;
    onSelectChannel: (channel: Channel) => void;
    onCreateChannel: () => void;
    canManageChannels: boolean;
}

export default function ChannelSidebar({
    team,
    channels,
    selectedChannel,
    connected,
    onSelectChannel,
    onCreateChannel,
    canManageChannels
}: Props) {

    return (
        <aside className="channel-sidebar">

            <div className="workspace-title">
                {team?.name ?? "Team"}
            </div>

            <div className="sidebar-heading">
                <span>Channels</span>

                {team !== null &&
                    canManageChannels && (
                        <button
                            type="button"
                            className="add-button"
                            onClick={onCreateChannel}
                            title="Create channel"
                        >
                            +
                        </button>
                    )}
            </div>

            {channels.map((channel) => (

                <button
                    type="button"
                    key={channel.id}
                    className={
                        selectedChannel?.id === channel.id
                            ? "channel-item active"
                            : "channel-item"
                    }
                    onClick={() =>
                        onSelectChannel(channel)
                    }
                >
                    # {channel.name}
                </button>

            ))}

            {team !== null &&
                channels.length === 0 && (
                    <div className="sidebar-empty">
                        No channels yet
                    </div>
                )}

            <div className="connection-status">

                <span
                    className={
                        connected
                            ? "status-dot online"
                            : "status-dot"
                    }
                />

                {connected
                    ? "Connected"
                    : "Connecting..."}

            </div>

        </aside>
    );
}