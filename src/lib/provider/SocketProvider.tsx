'use client'

import { useCallback, useEffect, useState } from 'react';
import { getAppKey } from "@/utils/key";
import { useWebSocket } from '@/hooks/useWebSocket';
import useAppStore from '@/stores/useAppStore';
import { eventEmitter } from "@/lib/event";

const SocketProvider = () => {
    const { onlineCount, setOnlineCount } = useAppStore();

    const [wsUrl, setWsUrl] = useState<string>('');
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        const key = getAppKey();
        if (key) {
            const url = `ws://192.168.0.105:5000/socket.io?key=${encodeURIComponent(key)}`;
            console.log('Setting WebSocket URL:', url);
            setWsUrl(url);
        }
    }, []);

    useEffect(() => {
        if (count != onlineCount) {
            setOnlineCount(count);
        }
    }, [count])

    const { sendMessage, isConnected } = useWebSocket({
        url: wsUrl,
        onMessage: (message) => {
            console.log('Received message:', message);
            if (message.type === 'connected' || message.type === 'pong') {
                const count = message.online_count ?? 0;
                setCount(count);
            }
        },
        onOpen: () => {
            console.log('Connected to chat server');
        },
        onClose: () => {
            console.log('Disconnected from chat server');
        },
        onError: (error) => {
            console.error('WebSocket error:', error);
        },
    });

    const handleSendEvent = useCallback((data: { type: string }) => {
        console.log('接收到了 data = ', data);
        if (!isConnected) {
            return;
        }
        sendMessage('list')
    }, [sendMessage, isConnected])


    // 初始化绑定消息总线的对应处理
    useEffect(() => {
        eventEmitter.on('meet', handleSendEvent);

        return () => {
            eventEmitter.off('meet', handleSendEvent);
        };
    }, []);

    return null;
}

export default SocketProvider;