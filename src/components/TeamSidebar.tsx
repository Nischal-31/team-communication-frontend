import type { Team } from "../types";

interface Props {
    teams: Team[];
    selectedTeam: Team | null;
    onSelectTeam: (team: Team) => void;
    onCreateTeam: () => void;
    onLogout: () => void;
}

export default function TeamSidebar({
    teams,
    selectedTeam,
    onSelectTeam,
    onCreateTeam,
    onLogout
}: Props) {

    return (
        <aside className="team-sidebar">

            <div className="team-sidebar-content">

                <div className="sidebar-heading">

                    <span>
                        Teams
                    </span>

                    <button
                        type="button"
                        className="add-button"
                        onClick={onCreateTeam}
                        title="Create team"
                    >
                        +
                    </button>

                </div>

                <div className="team-list">

                    {teams.map((team) => (

                        <button
                            type="button"
                            key={team.id}
                            className={
                                selectedTeam?.id === team.id
                                    ? "sidebar-item active"
                                    : "sidebar-item"
                            }
                            onClick={() =>
                                onSelectTeam(team)
                            }
                        >

                            <span className="team-icon">
                                {team.name
                                    .charAt(0)
                                    .toUpperCase()}
                            </span>

                            <span>
                                {team.name}
                            </span>

                        </button>

                    ))}

                    {teams.length === 0 && (
                        <div className="sidebar-empty">
                            No teams yet
                        </div>
                    )}

                </div>

            </div>

            <button
                type="button"
                className="logout-sidebar-button"
                onClick={onLogout}
            >
                Logout
            </button>

        </aside>
    );
}