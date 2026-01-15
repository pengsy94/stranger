'use client'

import { useCallback, useEffect, useRef, useState, createContext, useContext, ReactNode } from 'react';
import { getAppKey } from "@/utils/key";
import { ConnectionStatus, WebSocketMessage, WebSocketOptions } from '@/types/websocket';
import { useWebSocket } from '@/hooks/useWebSocket';
import useAppStore from '@/stores/useAppStore';

interface WebSocketContextType {
    sendMessage: <T = any>(type: string, data?: T) => boolean;
    status: string;
    reconnectCount: number;
    isConnected: boolean;
    disconnect: () => void;
    reconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketProviderProps extends WebSocketOptions {
    children: ReactNode;
}

export const WebSocketProvider = ({
    children,
    url,
    ...options
}: WebSocketProviderProps) => {
    const websocket = useWebSocket({
        url,
        ...options,
    });

    return (
        <WebSocketContext.Provider value={websocket}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocketContext = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketContext must be used within WebSocketProvider');
    }
    return context;
};

interface ChatMessage {
    id: string;
    user: string;
    content: string;
    timestamp: number;
}

const SocketProvider = () => {

    const { setOnlineCount } = useAppStore();

    const [userKey, setUserKey] = useState<string>('');

    // 初始化或重新生成 key
    const initializeUserKey = useCallback(() => {
        const key = getAppKey();
        setUserKey(key);
        return key;
    }, []);

    // 组件挂载时初始化 key
    useEffect(() => {
        initializeUserKey();
    }, [initializeUserKey]);

    // 构建 WebSocket URL
    const getWebSocketUrl = useCallback((key: string) => {
        // 如果 key 为空，返回 null 避免连接
        if (!key) return null;

        // 这里根据你的服务器要求构建 URL
        return `ws://192.168.0.105:5000/socket.io?key=${encodeURIComponent(key)}`;
    }, []);

    const { sendMessage, status, reconnect } = useWebSocket({
        url: userKey ? getWebSocketUrl(userKey) : '',
        onMessage: (message: WebSocketMessage) => {

            console.log(message)
            switch (message.type) {
                case 'connected':
                    setOnlineCount(message.online_count ?? 0);
                    break;
                case 'chat':
                    if (message.data) {
                        console.log(message);
                        // setMessages(prev => [...prev, message.data as ChatMessage]);
                    }
                    break;
                case 'history':
                    if (message.data) {
                        console.log(message);
                        // setMessages(message.data as ChatMessage[]);
                    }
                    break;
                case 'user-joined':
                    console.log('User joined:', message.data);
                    break;
                case 'user-left':
                    console.log('User left:', message.data);
                    break;
            }
        },
        onOpen: () => {
            console.log('Connected to chat server');
            // 请求历史消息
            // sendMessage('list');
            // sendMessage('get-history');
        },
        onClose: () => {
            console.log('Disconnected from chat server');
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
        },
    });

    return null;
}

export default SocketProvider;