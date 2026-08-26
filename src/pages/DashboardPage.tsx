import { useEffect, useState } from "react";

import {
    getMyTeams,
    getChannels,
    getMessages,
    getTeamMembers,
    addTeamMember,
    updateMemberRole,
    removeMember,
    updateMessage,
    deleteMessage
} from "../Services/api";

import type {
    Team,
    Channel,
    Message,
    TeamMember
} from "../types";

import { getCurrentUsername } from "../Services/auth";

import {
    connectWebSocket,
    disconnectWebSocket,
    subscribeToChannel,
    sendMessage
} from "../Services/websocket";

import TeamSidebar from "../components/TeamSidebar";
import ChannelSidebar from "../components/ChannelSidebar";
import MemberSidebar from "../components/MemberSidebar";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import TeamCreateForm from "../components/TeamCreateForm";
import ChannelCreateForm from "../components/ChannelCreateForm";

interface Props {
    onLogout: () => void;
}

export default function DashboardPage({
    onLogout
}: Props) {

    const [teams, setTeams] =
        useState<Team[]>([]);

    const [channels, setChannels] =
        useState<Channel[]>([]);

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [members, setMembers] =
        useState<TeamMember[]>([]);

    const [selectedTeam, setSelectedTeam] =
        useState<Team | null>(null);

    const [selectedChannel, setSelectedChannel] =
        useState<Channel | null>(null);

    const [connected, setConnected] =
        useState(false);

    const [webSocketError, setWebSocketError] =
        useState("");

    const [showTeamCreate, setShowTeamCreate] =
        useState(false);

    const [showChannelCreate, setShowChannelCreate] =
        useState(false);

    const currentUsername =
        getCurrentUsername();

    // =========================================
    // LOAD TEAMS + WEBSOCKET
    // =========================================

    useEffect(() => {

        async function loadTeams() {

            try {

                const data =
                    await getMyTeams();

                setTeams(data);

                if (data.length > 0) {
                    setSelectedTeam(data[0]);
                } else {
                    setSelectedTeam(null);
                }

            } catch (error) {

                console.error(
                    "Failed to load teams:",
                    error
                );
            }
        }

        loadTeams();

        connectWebSocket(
            () => {

                console.log(
                    "[Dashboard] WebSocket connected"
                );

                setConnected(true);
                setWebSocketError("");
            },

            () => {

                console.log(
                    "[Dashboard] WebSocket disconnected"
                );

                setConnected(false);
            },

            (error) => {

                console.error(
                    "[Dashboard] WebSocket error:",
                    error
                );

                setConnected(false);
                setWebSocketError(error);
            }
        );

        return () => {
            disconnectWebSocket();
        };

    }, []);

    // =========================================
    // LOAD CHANNELS + MEMBERS
    // =========================================

    useEffect(() => {

        if (selectedTeam === null) {

            setChannels([]);
            setSelectedChannel(null);
            setMembers([]);

            return;
        }

        const teamId =
            selectedTeam.id;

        async function loadTeamData() {

            try {

                const [
                    channelData,
                    memberData
                ] = await Promise.all([
                    getChannels(teamId),
                    getTeamMembers(teamId)
                ]);

                setChannels(channelData);
                setMembers(memberData);

                if (channelData.length > 0) {

                    setSelectedChannel(
                        channelData[0]
                    );

                } else {

                    setSelectedChannel(null);
                }

            } catch (error) {

                console.error(
                    "Failed to load team data:",
                    error
                );

                setChannels([]);
                setSelectedChannel(null);
                setMembers([]);
            }
        }

        loadTeamData();

    }, [selectedTeam]);

    // =========================================
    // LOAD MESSAGES
    // =========================================

    useEffect(() => {

        if (selectedChannel === null) {

            setMessages([]);

            return;
        }

        const channelId =
            selectedChannel.id;

        async function loadMessages() {

            try {

                const data =
                    await getMessages(
                        channelId
                    );

                setMessages(data);

            } catch (error) {

                console.error(
                    "Failed to load messages:",
                    error
                );

                setMessages([]);
            }
        }

        loadMessages();

    }, [selectedChannel]);

    // =========================================
    // WEBSOCKET SUBSCRIPTION
    // =========================================

    useEffect(() => {

        if (
            !connected ||
            selectedChannel === null
        ) {
            return;
        }

        const channelId =
            selectedChannel.id;

        console.log(
            "[Dashboard] Subscribing to channel:",
            channelId
        );

        subscribeToChannel(
            channelId,
            (message) => {

                console.log(
                    "[Dashboard] Message received:",
                    message
                );

                setMessages((current) => {

                    const exists =
                        current.some(
                            (item) =>
                                item.id ===
                                message.id
                        );

                    if (exists) {
                        return current;
                    }

                    return [
                        ...current,
                        message
                    ];
                });
            }
        );

    }, [connected, selectedChannel]);

    // =========================================
    // SEND MESSAGE
    // =========================================

    function handleSendMessage(
        content: string
    ) {

        if (selectedChannel === null) {

            console.error(
                "No channel selected."
            );

            return;
        }

        if (!connected) {

            console.error(
                "WebSocket is not connected."
            );

            return;
        }

        sendMessage(
            selectedChannel.id,
            content
        );
    }

    // =========================================
    // EDIT MESSAGE
    // =========================================

    async function handleEditMessage(
        messageId: number,
        content: string
    ) {

        try {

            const updatedMessage =
                await updateMessage(
                    messageId,
                    content
                );

            setMessages((current) =>
                current.map((message) =>
                    message.id === messageId
                        ? updatedMessage
                        : message
                )
            );

        } catch (error) {

            console.error(
                "Failed to edit message:",
                error
            );
        }
    }

    // =========================================
    // DELETE MESSAGE
    // =========================================

    async function handleDeleteMessage(
        messageId: number
    ) {

        const confirmed =
            window.confirm(
                "Delete this message?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteMessage(
                messageId
            );

            setMessages((current) =>
                current.filter(
                    (message) =>
                        message.id !== messageId
                )
            );

        } catch (error) {

            console.error(
                "Failed to delete message:",
                error
            );
        }
    }

    // =========================================
    // CREATE TEAM
    // =========================================

    function handleTeamCreated(
        team: Team
    ) {

        setTeams((current) => [
            ...current,
            team
        ]);

        setSelectedTeam(team);
        setChannels([]);
        setSelectedChannel(null);
        setMembers([]);

        setShowTeamCreate(false);
    }

    // =========================================
    // CREATE CHANNEL
    // =========================================

    function handleChannelCreated(
        channel: Channel
    ) {

        setChannels((current) => [
            ...current,
            channel
        ]);

        setSelectedChannel(channel);

        setShowChannelCreate(false);
    }

    // =========================================
    // ADD MEMBER
    // =========================================

    async function handleAddMember(
        username: string
    ): Promise<void> {

        if (selectedTeam === null) {

            throw new Error(
                "No team is selected."
            );
        }

        const addedMember =
            await addTeamMember(
                selectedTeam.id,
                username
            );

        setMembers((current) => {

            const exists =
                current.some(
                    (member) =>
                        member.userId ===
                        addedMember.userId
                );

            if (exists) {
                return current;
            }

            return [
                ...current,
                addedMember
            ];
        });
    }

    // =========================================
    // UPDATE MEMBER ROLE
    // =========================================

    async function handleUpdateMemberRole(
        userId: number,
        role: "ADMIN" | "MEMBER"
    ) {

        if (selectedTeam === null) {
            return;
        }

        try {

            const updatedMember =
                await updateMemberRole(
                    selectedTeam.id,
                    userId,
                    role
                );

            setMembers((current) =>
                current.map((member) =>
                    member.userId === userId
                        ? updatedMember
                        : member
                )
            );

        } catch (error) {

            console.error(
                "Failed to update member role:",
                error
            );
        }
    }

    // =========================================
    // REMOVE MEMBER
    // =========================================

    async function handleRemoveMember(
        userId: number
    ) {

        if (selectedTeam === null) {
            return;
        }

        const confirmed =
            window.confirm(
                "Remove this member from the team?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await removeMember(
                selectedTeam.id,
                userId
            );

            setMembers((current) =>
                current.filter(
                    (member) =>
                        member.userId !==
                        userId
                )
            );

        } catch (error) {

            console.error(
                "Failed to remove member:",
                error
            );
        }
    }

    // =========================================
    // CURRENT USER + PERMISSIONS
    // =========================================

    const currentMember =
        members.find(
            (member) =>
                member.username ===
                currentUsername
        );

    const currentUserId =
        currentMember?.userId ?? null;

    const canModerate =
        currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN";

    const canManageChannels =
        currentMember?.role === "OWNER" ||
        currentMember?.role === "ADMIN";

    // =========================================
    // UI
    // =========================================

    return (
        <div className="app-shell">

            <TeamSidebar
                teams={teams}
                selectedTeam={selectedTeam}
                onSelectTeam={setSelectedTeam}
                onCreateTeam={() =>
                    setShowTeamCreate(true)
                }
                onLogout={onLogout}
            />

            <ChannelSidebar
                team={selectedTeam}
                channels={channels}
                selectedChannel={selectedChannel}
                connected={connected}
                onSelectChannel={
                    setSelectedChannel
                }
                onCreateChannel={() =>
                    setShowChannelCreate(true)
                }
                canManageChannels={
                    canManageChannels
                }
            />

            <main className="chat-area">

                <header className="chat-header">

                    <div>

                        <h2>
                            {selectedChannel !==
                            null
                                ? `# ${selectedChannel.name}`
                                : "Select a channel"}
                        </h2>

                        {selectedChannel !==
                            null &&
                            selectedChannel.description && (
                                <p>
                                    {
                                        selectedChannel.description
                                    }
                                </p>
                            )}

                    </div>

                </header>

                {webSocketError && (
                    <div className="error">
                        {webSocketError}
                    </div>
                )}

                <MessageList
                    messages={messages}
                    currentUsername={
                        currentUsername
                    }
                    canModerate={
                        canModerate
                    }
                    onEdit={
                        handleEditMessage
                    }
                    onDelete={
                        handleDeleteMessage
                    }
                />

                {selectedChannel !== null && (
                    <MessageInput
                        channelName={
                            selectedChannel.name
                        }
                        disabled={!connected}
                        onSend={
                            handleSendMessage
                        }
                    />
                )}

            </main>

            <MemberSidebar
                members={members}
                currentUserId={
                    currentUserId
                }
                onAddMember={
                    handleAddMember
                }
                onPromote={
                    handleUpdateMemberRole
                }
                onRemove={
                    handleRemoveMember
                }
            />

            {showTeamCreate && (
                <TeamCreateForm
                    onClose={() =>
                        setShowTeamCreate(false)
                    }
                    onCreated={
                        handleTeamCreated
                    }
                />
            )}

            {showChannelCreate &&
                selectedTeam !== null && (
                    <ChannelCreateForm
                        teamId={
                            selectedTeam.id
                        }
                        onClose={() =>
                            setShowChannelCreate(
                                false
                            )
                        }
                        onCreated={
                            handleChannelCreated
                        }
                    />
                )}

        </div>
    );
}