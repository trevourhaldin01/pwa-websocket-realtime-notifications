import { useEffect, useRef } from "react";

const BASE_WS_URL = import.meta.env.VITE_SUGGESTIONS_WS_URL || "ws://localhost:8000/ws/suggestions";



export const useSuggestionsSocket = (onMessage, isAuthenticated) => {
    const socketRef = useRef(null);
    const reconnectRef = useRef(1000); //initial reconnect 1s
    useEffect(() => {
        if (!isAuthenticated) {
            if (socketRef.current) {
                socketRef.current.close();
                socketRef.current = null;
            }
            return;

        }

        let ws;
        let shouldReconnect = true;
        const connect = () => {
            const token = localStorage.getItem("authToken");
            const wsUrl = token
                ? `${BASE_WS_URL}?token=${token}`
                : BASE_WS_URL;
            ws = new WebSocket(wsUrl);

            ws.onopen = () => {
                console.log("WebSocket connected");
                reconnectRef.current = 1000; // reset backoff
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                onMessage(data);
            };
            ws.onclose = () => {
                console.log(`WebSocket disconnected, reconnecting in ${reconnectRef.current / 1000}s`);
                setTimeout(() => {
                    reconnectRef.current = Math.min(reconnectRef.current * 2, 30000); // exponential backoff max 30s
                    connect();
                }, reconnectRef.current);
            };
            ws.onerror = (err) => {
                console.error('WebSocket error:', err);
                ws.close();
            };

            socketRef.current = ws;

        }
        connect();
        return () => {
            shouldReconnect = false;
            if (ws) {
                ws.close();
            }

        }
    }, [onMessage, isAuthenticated]);

};  