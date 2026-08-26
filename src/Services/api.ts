import type {
    LoginResponse,
    Team,
    Channel,
    Message,
    TeamMember
} from "../types";

const API_URL = "http://localhost:8081";

async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {

    const token = localStorage.getItem("token");

    const headers = new Headers(options.headers);

    if (options.body) {
        headers.set(
            "Content-Type",
            "application/json"
        );
    }

    if (token) {
        headers.set(
            "Authorization",
            `Bearer ${token}`
        );
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers
        }
    );

    if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
            errorText ||
            `Request failed: ${response.status}`
        );
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

/* =========================================
   AUTHENTICATION
========================================= */

export async function login(
    username: string,
    password: string
): Promise<LoginResponse> {

    return request<LoginResponse>(
        "/api/auth/login",
        {
            method: "POST",
            body: JSON.stringify({
                username,
                password
            })
        }
    );
}

export interface CreateUserRequest {
    username: string;
    email: string;
    password: string;
}

export async function createUser(
    data: CreateUserRequest
): Promise<void> {

    return request<void>(
        "/api/users",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
}

/* =========================================
   TEAMS
========================================= */

export async function getMyTeams(): Promise<Team[]> {

    return request<Team[]>(
        "/api/teams/my"
    );
}

export interface CreateTeamRequest {
    name: string;
    description: string;
}

export async function createTeam(
    data: CreateTeamRequest
): Promise<Team> {

    return request<Team>(
        "/api/teams",
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
}

/* =========================================
   CHANNELS
========================================= */

export async function getChannels(
    teamId: number
): Promise<Channel[]> {

    return request<Channel[]>(
        `/api/teams/${teamId}/channels`
    );
}

export interface CreateChannelRequest {
    name: string;
    description: string;
}

export async function createChannel(
    teamId: number,
    data: CreateChannelRequest
): Promise<Channel> {

    return request<Channel>(
        `/api/teams/${teamId}/channels`,
        {
            method: "POST",
            body: JSON.stringify(data)
        }
    );
}

/* =========================================
   MESSAGES
========================================= */

export async function getMessages(
    channelId: number
): Promise<Message[]> {

    return request<Message[]>(
        `/api/channels/${channelId}/messages`
    );
}

export interface UpdateMessageRequest {
    content: string;
}

export async function updateMessage(
    messageId: number,
    content: string
): Promise<Message> {

    return request<Message>(
        `/api/messages/${messageId}`,
        {
            method: "PATCH",
            body: JSON.stringify({
                content
            })
        }
    );
}

export async function deleteMessage(
    messageId: number
): Promise<void> {

    return request<void>(
        `/api/messages/${messageId}`,
        {
            method: "DELETE"
        }
    );
}

/* =========================================
   TEAM MEMBERS
========================================= */

export interface AddTeamMemberRequest {
    username: string;
}

export async function getTeamMembers(
    teamId: number
): Promise<TeamMember[]> {

    return request<TeamMember[]>(
        `/api/teams/${teamId}/members`
    );
}

export async function addTeamMember(
    teamId: number,
    username: string
): Promise<TeamMember> {

    return request<TeamMember>(
        `/api/teams/${teamId}/members`,
        {
            method: "POST",
            body: JSON.stringify({
                username
            })
        }
    );
}

export async function updateMemberRole(
    teamId: number,
    userId: number,
    role: "ADMIN" | "MEMBER"
): Promise<TeamMember> {

    return request<TeamMember>(
        `/api/teams/${teamId}/members/${userId}/role`,
        {
            method: "PATCH",
            body: JSON.stringify({
                role
            })
        }
    );
}

export async function removeMember(
    teamId: number,
    userId: number
): Promise<void> {

    return request<void>(
        `/api/teams/${teamId}/members/${userId}`,
        {
            method: "DELETE"
        }
    );
}