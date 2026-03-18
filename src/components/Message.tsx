"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, AlertCircle, X, Loader } from 'lucide-react';

interface MessageConfig {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning' | 'loading';
    content: string;
    duration?: number;
    onClose?: () => void;
    icon?: React.ReactNode;
    className?: string;
}

interface MessageOptions {
    duration?: number;
    onClose?: () => void;
    icon?: React.ReactNode;
    className?: string;
}

interface MessageGlobalConfig {
    duration?: number;
    position?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right';
    maxCount?: number;
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
}

class MessageManager {
    private static instance: MessageManager;
    private setMessagesFn: ((messages: MessageConfig[]) => void) | null = null;
    private messages: MessageConfig[] = [];
    private _config: MessageGlobalConfig = {
        duration: 3000,
        position: 'top',
        maxCount: 5,
        top: 24,
        bottom: 24,
        left: 24,
        right: 24
    };

    private constructor() { }

    config(options: Partial<MessageGlobalConfig>) {
        this._config = { ...this._config, ...options };
        return this;
    }

    getConfig() {
        return this._config;
    }

    destroy() {
        this.removeAll();
        this.setMessagesFn = null;
    }

    static getInstance(): MessageManager {
        if (!MessageManager.instance) {
            MessageManager.instance = new MessageManager();
        }
        return MessageManager.instance;
    }

    register(setMessagesFn: (messages: MessageConfig[]) => void) {
        this.setMessagesFn = setMessagesFn;
    }

    private addMessage(type: MessageConfig['type'], content: string, options?: MessageOptions): string {
        const id = `message-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        const message: MessageConfig = {
            id,
            type,
            content,
            duration: options?.duration ?? this._config.duration,
            onClose: options?.onClose,
            icon: options?.icon,
            className: options?.className
        };

        // 限制最大消息数量
        if (this.messages.length >= (this._config.maxCount || 5)) {
            // 移除最早的消息
            const removedMessage = this.messages.shift();
            if (removedMessage?.onClose) {
                removedMessage.onClose();
            }
        }

        this.messages = [...this.messages, message];
        this.updateMessages();

        // loading 类型不自动关闭
        if ((message.duration || 0) > 0 && type !== 'loading') {
            setTimeout(() => {
                this.removeMessage(id);
            }, message.duration || this._config.duration);
        }

        return id;
    }

    success(content: string, options?: MessageOptions): string {
        return this.addMessage('success', content, options);
    }

    error(content: string, options?: MessageOptions): string {
        return this.addMessage('error', content, options);
    }

    info(content: string, options?: MessageOptions): string {
        return this.addMessage('info', content, options);
    }

    warning(content: string, options?: MessageOptions): string {
        return this.addMessage('warning', content, options);
    }

    loading(content: string, options?: Omit<MessageOptions, 'duration'>): string {
        // loading 类型不自动关闭，直接传递选项（不包含 duration）
        return this.addMessage('loading', content, { ...options, duration: 0 });
    }

    removeMessage(id: string) {
        const message = this.messages.find(m => m.id === id);
        if (message?.onClose) {
            message.onClose();
        }

        this.messages = this.messages.filter(m => m.id !== id);
        this.updateMessages();
    }

    removeAll() {
        this.messages = [];
        this.updateMessages();
    }

    private updateMessages() {
        if (this.setMessagesFn) {
            this.setMessagesFn([...this.messages]);
        }
    }
}

export const message = MessageManager.getInstance();



const Message: React.FC = () => {
    const [messages, setMessages] = useState<MessageConfig[]>([]);
    const [mounted, setMounted] = useState(false);
    const [localConfig, setLocalConfig] = useState<MessageGlobalConfig>({
        duration: 3000,
        position: 'top',
        maxCount: 5,
        top: 24,
        bottom: 24,
        left: 24,
        right: 24
    });
    const messagesRefs = useRef<{ [key: string]: { timer: NodeJS.Timeout | null } }>({});

    // 创建一个定时器，定期同步配置
    const configSyncTimerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // 初始化本地配置为 MessageManager 的当前配置
        setLocalConfig(message.getConfig());
        
        message.register(setMessages);
        setMounted(true);
        
        // 定期同步配置（每100ms检查一次）
        configSyncTimerRef.current = setInterval(() => {
            const currentConfig = message.getConfig();
            setLocalConfig(currentConfig);
        }, 100);
        
        return () => {
            message.removeAll();
            if (configSyncTimerRef.current) {
                clearInterval(configSyncTimerRef.current);
                configSyncTimerRef.current = null;
            }
        };
    }, []);

    // 监听 ESC 键关闭所有消息
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                message.removeAll();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    // 鼠标悬停时暂停自动关闭
    const handleMouseEnter = (id: string) => {
        if (messagesRefs.current[id]?.timer) {
            clearTimeout(messagesRefs.current[id].timer);
            messagesRefs.current[id].timer = null;
        }
    };

    // 鼠标离开时恢复自动关闭
    const handleMouseLeave = (id: string, duration: number) => {
        if (duration > 0) {
            messagesRefs.current[id].timer = setTimeout(() => {
                message.removeMessage(id);
            }, duration);
        }
    };

    const getIcon = (type: MessageConfig['type'], customIcon?: React.ReactNode) => {
        if (customIcon) return customIcon;
        
        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-4 h-4" />;
            case 'error':
                return <AlertCircle className="w-4 h-4" />;
            case 'info':
                return <Info className="w-4 h-4" />;
            case 'warning':
                return <AlertCircle className="w-4 h-4" />;
            case 'loading':
                return <Loader className="w-4 h-4 animate-spin" />;
        }
    };

    const getMessageStyles = (type: MessageConfig['type']) => {
        switch (type) {
            case 'success':
                return {
                    bgColor: 'bg-green-50',
                    borderColor: 'border-green-200',
                    textColor: 'text-green-800',
                    iconColor: 'text-green-600'
                };
            case 'error':
                return {
                    bgColor: 'bg-red-50',
                    borderColor: 'border-red-200',
                    textColor: 'text-red-800',
                    iconColor: 'text-red-600'
                };
            case 'info':
                return {
                    bgColor: 'bg-blue-50',
                    borderColor: 'border-blue-200',
                    textColor: 'text-blue-800',
                    iconColor: 'text-blue-600'
                };
            case 'warning':
                return {
                    bgColor: 'bg-yellow-50',
                    borderColor: 'border-yellow-200',
                    textColor: 'text-yellow-800',
                    iconColor: 'text-yellow-600'
                };
            case 'loading':
                return {
                    bgColor: 'bg-gray-50',
                    borderColor: 'border-gray-200',
                    textColor: 'text-gray-800',
                    iconColor: 'text-blue-500'
                };
        }
    };

    const getPositionClassName = () => {
        switch (localConfig.position) {
            case 'top':
                return 'top-0 left-1/2 transform -translate-x-1/2';
            case 'top-left':
                return 'top-0 left-0';
            case 'top-right':
                return 'top-0 right-0';
            case 'bottom':
                return 'bottom-0 left-1/2 transform -translate-x-1/2';
            case 'bottom-left':
                return 'bottom-0 left-0';
            case 'bottom-right':
                return 'bottom-0 right-0';
            default:
                return 'top-0 right-0';
        }
    };

    const getCustomStyles = () => {
        const styles: React.CSSProperties = {};
        
        // 根据位置决定应用哪些样式
        if (localConfig.position?.includes('top')) {
            if (localConfig.top !== undefined) styles.top = `${localConfig.top}px`;
        } else if (localConfig.position?.includes('bottom')) {
            if (localConfig.bottom !== undefined) styles.bottom = `${localConfig.bottom}px`;
        }
        
        // 只有在非居中位置才应用左右偏移
        if (localConfig.position?.includes('left') && localConfig.left !== undefined) {
            styles.left = `${localConfig.left}px`;
        } else if (localConfig.position?.includes('right') && localConfig.right !== undefined) {
            styles.right = `${localConfig.right}px`;
        }
        
        return styles;
    };

    if (!mounted || messages.length === 0) return null;

    return createPortal(
        <div 
            className={`fixed ${getPositionClassName()} z-500 flex flex-col gap-2 max-w-[90%] sm:max-w-[80%] w-full sm:w-auto`}
            style={getCustomStyles()}
        >
            {messages.map((msg) => {
                const styles = getMessageStyles(msg.type);
                return (
                    <div
                        key={msg.id}
                        className={`${styles.bgColor} ${styles.borderColor} border rounded-lg shadow-sm p-3 flex items-center justify-between transition-all duration-300 animate-in fade-in slide-in-from-top-5 hover:shadow-md`}
                        onMouseEnter={() => handleMouseEnter(msg.id)}
                        onMouseLeave={() => handleMouseLeave(msg.id, msg.duration || 3000)}
                        style={{ minWidth: '288px', maxWidth: '100%' }}
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className={styles.iconColor}>
                                {getIcon(msg.type, msg.icon)}
                            </div>
                            <span className={`text-sm ${styles.textColor} flex-1`}>{msg.content}</span>
                        </div>
                        <button
                            onClick={() => message.removeMessage(msg.id)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                            aria-label="关闭"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                );
            })}
        </div>,
        document.body
    );
};

export default Message;
