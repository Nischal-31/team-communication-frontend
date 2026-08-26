export interface LoginResponse {
    token: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
}

export interface Team {
    id: number;
    name: string;
    description: string;
    ownerId?: number;
    ownerUsername?: string;
    createdAt: string;
}

export interface Channel {
    id: number;
    name: string;
    description: string;
    teamId: number;
    createdAt: string;
}

export interface Message {
    id: number;
    content: string;
    channelId: number;
    senderId: number;
    senderUsername: string;
    createdAt: string;
    updatedAt: string;
}

export interface TeamMember {
    userId: number;
    username: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    joinedAt: string;
}