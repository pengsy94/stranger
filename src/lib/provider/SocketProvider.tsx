'use client'

import { useCallback, useEffect, useState } from 'react';
import { getAppKey } from "@/utils/key";
import { useWebSocket } from '@/hooks/useWebSocket';
import useAppStore from '@/stores/useAppStore';
import { eventEmitter } from "@/lib/event";
import { loading } from '@/components/ScreenLoading';
import { message, message as messageComponent } from '@/components/Message';
import { ChatConnectOtherMate, MessageItem } from '@/types/message';
import { getOptionObject } from '../utils';
import { ageOptions, sexOptions } from '../data';

const SocketProvider = () => {
    const {
        connect, onlineCount,
        setOnlineCount, setConnect, setMessageList, setConnectDepart
    } = useAppStore();

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
                const count = message.data.online_count ?? 0;
                setCount(count);
            }

            switch (message.type) {
                case 'meet_loading':
                    // 遇见操作 处理中...
                    break;
                case 'meet_failed':
                    // 隐藏加载
                    loading.hide();
                    // 显示失败消息
                    messageComponent.info(message.data?.message || '遇见操作失败，请稍后重试');
                    break;
                // 遇见操作 失败
                case 'meet_success':
                    // 遇见操作 成功
                    // 隐藏加载
                    loading.hide();
                    const otherMate: ChatConnectOtherMate = {
                        to: message.data.to || '',
                        age: getOptionObject(ageOptions, message.data.age),
                        sex: getOptionObject(sexOptions, message.data.sex),
                        location: message.data.location || '',
                        tag: ['快乐小狗', '反差er', '人间清醒']
                    }

                    setConnect(otherMate, true);
                    break;
                case 'private':
                    // 私聊操作 成功
                    let content: MessageItem;
                    
                    // 处理接收的消息
                    const receivedMessage = message.data.message;
                    
                    // 检查是否为图片消息
                    if (typeof receivedMessage === 'object' && receivedMessage !== null && 'type' in receivedMessage) {
                        // 图片消息（即阅即焚）
                        content = {
                            sender: 2,
                            type: receivedMessage.type || 2,
                            image: receivedMessage.text || '',
                            burnAfterRead: receivedMessage.burnAfterRead || false,
                            isViewed: false,
                            createdAt: new Date()
                        };
                    } else {
                        // 文本消息
                        content = {
                            sender: 2,
                            type: 1,
                            text: receivedMessage || '',
                            createdAt: new Date()
                        };
                    }
                    
                    // 添加对方的信息数据
                    setMessageList([...connect.messageList, content]);
                    break;

                case 'depart':
                    // 退出操作 成功
                    setConnectDepart(false, '对方已与你说再见，会话被终止...');
                    break;
                default:
                    // 处理默认事件
                    break;
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

    const handleSendEvent = useCallback((eventData: { type?: string; data?: any } | any) => {
        console.log('预备发送数据 eventData = ', eventData);
        if (!isConnected) {
            return;
        }

        // 检查 eventData 是否包含 type 字段
        if (eventData && typeof eventData === 'object' && 'type' in eventData) {
            // 如果包含 type 字段，提取 type 和 data
            switch (eventData.type) {
                // 处理遇见事件
                case 'meet':
                    // 显示加载
                    loading.show('正在遇见...');
                    break;
                default:
                    // 处理默认事件
                    break;
            }

            sendMessage(eventData.type, eventData);

        }
    }, [sendMessage, isConnected])

    // 初始化绑定消息总线的对应处理
    useEffect(() => {
        eventEmitter.on('meet', handleSendEvent);

        return () => {
            eventEmitter.off('meet', handleSendEvent);
        };
    }, [handleSendEvent]);

    return null;
}

export default SocketProvider;