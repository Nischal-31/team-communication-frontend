import {
    Client,
    type IMessage,
    type StompSubscription
} from "@stomp/stompjs";

import type { Message } from "../types";

const WS_URL = "ws://localhost:8081/ws";

let client: Client | null = null;
let activeSubscription: StompSubscription | null = null;

export function connectWebSocket(
    onConnected: () => void,
    onDisconnected: () => void,
    onError: (message: string) => void
) {
    const token = localStorage.getItem("token");

    if (!token) {
        onError("No authentication token.");
        return;
    }

    if (client?.active) {
        return;
    }

    client = new Client({
        brokerURL: WS_URL,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        debug: (message) => {
            console.log("[STOMP]", message);
        },

        onConnect: () => {
            console.log("[WS] Connected");
            onConnected();
        },

        onDisconnect: () => {
            console.log("[WS] Disconnected");
            onDisconnected();
        },

        onStompError: (frame) => {
            console.error("[STOMP ERROR]", frame);

            onError(
                frame.headers["message"] ||
                "STOMP error"
            );
        },

        onWebSocketError: (error) => {
            console.error("[WebSocket ERROR]", error);
            onError("WebSocket connection failed.");
        }
    });

    client.activate();
}

export function subscribeToChannel(
    channelId: number,
    onMessage: (message: Message) => void
) {
    if (!client || !client.connected) {
        console.error(
            "[WS] Cannot subscribe. Not connected."
        );

        return;
    }

    if (activeSubscription) {
        activeSubscription.unsubscribe();
        activeSubscription = null;
    }

    const destination =
        `/topic/channels/${channelId}`;

    console.log(
        "[WS] Subscribing:",
        destination
    );

    activeSubscription = client.subscribe(
        destination,
        (frame: IMessage) => {

            console.log(
                "[WS] RECEIVED:",
                frame.body
            );

            try {
                const message: Message =
                    JSON.parse(frame.body);

                onMessage(message);

            } catch (error) {
                console.error(
                    "[WS] Invalid message:",
                    error
                );
            }
        }
    );
}

export function sendMessage(
    channelId: number,
    content: string
) {
    if (!client || !client.connected) {
        console.error(
            "[WS] Cannot send. Not connected."
        );

        return;
    }

    console.log(
        "[WS] SEND:",
        channelId,
        content
    );

    client.publish({
        destination:
            `/app/channels/${channelId}/send`,

        body: JSON.stringify({
            content
        })
    });
}

export async function disconnectWebSocket() {
    if (activeSubscription) {
        activeSubscription.unsubscribe();
        activeSubscription = null;
    }

    if (client) {
        await client.deactivate();
        client = null;
    }
}