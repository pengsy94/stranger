// hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
    WebSocketMessage,
    WebSocketOptions,
    ConnectionStatus
} from '@/types/websocket';

export const useWebSocket = (options: WebSocketOptions) => {
    const {
        url,
        reconnectInterval = 3000,
        maxReconnectAttempts = 5,
        heartbeatInterval = 30000,
        onOpen,
        onClose,
        onError,
        onMessage,
    } = options;

    const [status, setStatus] = useState<ConnectionStatus>('disconnected');
    const [reconnectCount, setReconnectCount] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const heartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
    const reconnectAttemptsRef = useRef(0);

    // 清理函数
    const cleanup = useCallback(() => {
        if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
            heartbeatTimerRef.current = null;
        }

        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.onopen = null;
            wsRef.current.onclose = null;
            wsRef.current.onerror = null;
            wsRef.current.onmessage = null;

            if (wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
            wsRef.current = null;
        }
    }, []);

    // 发送心跳
    const sendHeartbeat = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const heartbeatMessage: WebSocketMessage = {
                type: 'ping',
                timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(heartbeatMessage));
        }
    }, []);

    // 开始心跳
    const startHeartbeat = useCallback(() => {
        if (heartbeatTimerRef.current) {
            clearInterval(heartbeatTimerRef.current);
        }

        heartbeatTimerRef.current = setInterval(() => {
            sendHeartbeat();
        }, heartbeatInterval);
    }, [heartbeatInterval, sendHeartbeat]);

    // 连接 WebSocket
    const connect = useCallback(() => {
        cleanup();

        setStatus('connecting');

        try {
            if (url == null || url == '' || url == undefined) {
                return;
            }

            const ws = new WebSocket(url);
            wsRef.current = ws;

            ws.onopen = (event) => {
                setStatus('connected');
                setReconnectCount(0);
                reconnectAttemptsRef.current = 0;

                startHeartbeat();
                onOpen?.(event);
            };

            ws.onclose = (event) => {
                setStatus('disconnected');
                onClose?.(event);

                // 自动重连逻辑
                if (reconnectAttemptsRef.current < maxReconnectAttempts) {
                    reconnectAttemptsRef.current += 1;
                    setReconnectCount(prev => prev + 1);
                    setStatus('reconnecting');

                    reconnectTimerRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            ws.onerror = (event) => {
                setStatus('error');
                onError?.(event);
            };

            ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data) as WebSocketMessage;

                    // 处理心跳响应
                    if (message.type === 'heartbeat') {
                        console.log('Heartbeat received');
                        return;
                    }

                    onMessage?.(message);
                } catch (error) {
                    console.error('Failed to parse message:', error);
                }
            };
        } catch (error) {
            console.error('Failed to create WebSocket:', error);
            setStatus('error');
        }
    }, [
        url,
        cleanup,
        startHeartbeat,
        reconnectInterval,
        maxReconnectAttempts,
        onOpen,
        onClose,
        onError,
        onMessage
    ]);

    // 发送消息
    const sendMessage = useCallback(<T = any>(
        type: string,
        data?: T
    ) => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            const message: WebSocketMessage<T> = {
                type,
                data,
                // timestamp: Date.now(),
            };
            wsRef.current.send(JSON.stringify(message));
            return true;
        }

        console.warn('WebSocket is not connected');
        return false;
    }, []);

    // 断开连接
    const disconnect = useCallback(() => {
        cleanup();
        setStatus('disconnected');
        setReconnectCount(0);
        reconnectAttemptsRef.current = 0;
    }, [cleanup]);

    // 手动重连
    const reconnect = useCallback(() => {
        reconnectAttemptsRef.current = 0;
        connect();
    }, [connect]);

    // 组件挂载时连接
    useEffect(() => {
        connect();

        return () => {
            cleanup();
        };
    }, [connect, cleanup]);

    return {
        status,
        reconnectCount,
        sendMessage,
        disconnect,
        reconnect,
        isConnected: status === 'connected',
        isConnecting: status === 'connecting',
        isReconnecting: status === 'reconnecting',
    };
};