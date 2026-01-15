export interface WebSocketMessage<T = any> {
    type: string;
    data?: T;
    timestamp?: number;
    online_count?: number;
}

export interface WebSocketOptions {
    url: string | null;
    reconnectInterval?: number;
    maxReconnectAttempts?: number;
    heartbeatInterval?: number;
    onOpen?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    onError?: (event: Event) => void;
    onMessage?: (message: WebSocketMessage) => void;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'reconnecting' | 'error';