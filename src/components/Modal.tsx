"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, AlertCircle, X, CircleHelp } from 'lucide-react';

// 模态框配置接口
interface ModalConfig {
    id: string;
    type: 'confirm' | 'info' | 'success' | 'error' | 'warning';
    title: string | React.ReactNode;
    content: string | React.ReactNode;
    okText?: string;
    cancelText?: string;
    okType?: 'default' | 'primary' | 'danger' | 'link';
    okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    onOk?: () => Promise<boolean | void> | boolean | void;
    onCancel?: () => Promise<boolean | void> | boolean | void;
    afterClose?: () => void;
    mask?: boolean;
    maskClosable?: boolean;
    closable?: boolean;
    width?: number;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

// 模态框选项接口
interface ModalOptions {
    title?: string | React.ReactNode;
    content?: string | React.ReactNode;
    okText?: string;
    cancelText?: string;
    okType?: 'default' | 'primary' | 'danger' | 'link';
    okButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    cancelButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
    onOk?: () => Promise<boolean | void> | boolean | void;
    onCancel?: () => Promise<boolean | void> | boolean | void;
    afterClose?: () => void;
    mask?: boolean;
    maskClosable?: boolean;
    closable?: boolean;
    width?: number;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

// 模态框全局配置接口
interface ModalGlobalConfig {
    width?: number;
    okText?: string;
    cancelText?: string;
    mask?: boolean;
    maskClosable?: boolean;
    closable?: boolean;
}

// 模态框实例接口
export interface ModalInstance {
    destroy: () => void;
    update: (options: Partial<ModalOptions>) => void;
}

// 模态框管理器类
class ModalManager {
    private static instance: ModalManager;
    private setModalsFn: ((modals: ModalConfig[]) => void) | null = null;
    private modals: ModalConfig[] = [];
    private _config: ModalGlobalConfig = {
        width: 520,
        okText: '确定',
        cancelText: '取消',
        mask: true,
        maskClosable: true,
        closable: true
    };

    private constructor() { }

    // 获取单例实例
    static getInstance(): ModalManager {
        if (!ModalManager.instance) {
            ModalManager.instance = new ModalManager();
        }
        return ModalManager.instance;
    }

    // 配置全局设置
    config(options: Partial<ModalGlobalConfig>) {
        this._config = { ...this._config, ...options };
        return this;
    }

    // 获取全局配置
    getConfig() {
        return this._config;
    }

    // 添加模态框
    private addModal(type: ModalConfig['type'], options: ModalOptions): ModalInstance {
        const id = `modal-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
        const modal: ModalConfig = {
            id,
            type,
            title: options.title || '',
            content: options.content || '',
            okText: options.okText || this._config.okText,
            cancelText: options.cancelText || this._config.cancelText,
            okType: options.okType || 'primary',
            okButtonProps: options.okButtonProps,
            cancelButtonProps: options.cancelButtonProps,
            onOk: options.onOk,
            onCancel: options.onCancel,
            afterClose: options.afterClose,
            mask: options.mask ?? this._config.mask,
            maskClosable: options.maskClosable ?? this._config.maskClosable,
            closable: options.closable ?? this._config.closable,
            width: options.width || this._config.width,
            icon: options.icon,
            className: options.className,
            style: options.style
        };

        this.modals = [...this.modals, modal];
        this.updateModals();

        return {
            destroy: () => this.removeModal(id),
            update: (newOptions) => this.updateModal(id, newOptions)
        };
    }

    // 确认模态框
    confirm(options: ModalOptions): ModalInstance {
        return this.addModal('confirm', options);
    }

    // 信息模态框
    info(options: ModalOptions): ModalInstance {
        return this.addModal('info', options);
    }

    // 成功模态框
    success(options: ModalOptions): ModalInstance {
        return this.addModal('success', options);
    }

    // 错误模态框
    error(options: ModalOptions): ModalInstance {
        return this.addModal('error', options);
    }

    // 警告模态框
    warning(options: ModalOptions): ModalInstance {
        return this.addModal('warning', options);
    }

    // 更新模态框
    private updateModal(id: string, options: Partial<ModalOptions>) {
        this.modals = this.modals.map(modal => {
            if (modal.id === id) {
                return { ...modal, ...options };
            }
            return modal;
        });
        this.updateModals();
    }

    // 移除模态框
    removeModal(id: string) {
        const modal = this.modals.find(m => m.id === id);
        if (modal?.afterClose) {
            modal.afterClose();
        }

        this.modals = this.modals.filter(m => m.id !== id);
        this.updateModals();
    }

    // 移除所有模态框
    removeAll() {
        this.modals.forEach(modal => {
            if (modal.afterClose) {
                modal.afterClose();
            }
        });
        this.modals = [];
        this.updateModals();
    }

    // 更新模态框列表
    private updateModals() {
        if (this.setModalsFn) {
            this.setModalsFn([...this.modals]);
        }
    }

    // 注册模态框列表更新函数
    register(setModalsFn: (modals: ModalConfig[]) => void) {
        this.setModalsFn = setModalsFn;
    }
}

// 导出模态框单例
export const modal = ModalManager.getInstance();

// 模态框React组件
const Modal: React.FC = () => {
    const [modals, setModals] = useState<ModalConfig[]>([]);
    const [mounted, setMounted] = useState(false);

    // 初始化模态框管理器
    useEffect(() => {
        modal.register(setModals);
        setMounted(true);

        return () => {
            modal.removeAll();
        };
    }, []);

    // 处理遮罩层点击
    const handleMaskClick = (id: string, maskClosable: boolean | undefined) => {
        if (maskClosable) {
            handleCancel(id);
        }
    };

    // 处理取消按钮点击
    const handleCancel = async (id: string) => {
        const modalConfig = modals.find(m => m.id === id);
        if (modalConfig?.onCancel) {
            const result = modalConfig.onCancel();
            if (result instanceof Promise) {
                const asyncResult = await result;
                if (asyncResult !== false) {
                    modal.removeModal(id);
                }
            } else if (result !== false) {
                modal.removeModal(id);
            }
        } else {
            modal.removeModal(id);
        }
    };

    // 处理确认按钮点击
    const handleOk = async (id: string) => {
        const modalConfig = modals.find(m => m.id === id);
        if (modalConfig?.onOk) {
            const result = modalConfig.onOk();
            if (result instanceof Promise) {
                const asyncResult = await result;
                if (asyncResult !== false) {
                    modal.removeModal(id);
                }
            } else if (result !== false) {
                modal.removeModal(id);
            }
        } else {
            modal.removeModal(id);
        }
    };

    // 获取模态框图标
    const getIcon = (type: ModalConfig['type'], customIcon?: React.ReactNode) => {
        if (customIcon) return customIcon;

        switch (type) {
            case 'success':
                return <CheckCircle2 className="w-6 h-6 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-6 h-6 text-red-500" />;
            case 'info':
                return <Info className="w-6 h-6 text-blue-500" />;
            case 'warning':
                return <AlertCircle className="w-6 h-6 text-yellow-500" />;
            case 'confirm':
                return <CircleHelp className="w-6 h-6 text-blue-500" />;
            default:
                return null;
        }
    };

    // 获取确认按钮样式
    const getOkButtonClass = (okType?: string) => {
        switch (okType) {
            case 'primary':
                return '';
            case 'danger':
                return 'bg-red-500 hover:bg-red-600';
            case 'link':
                return 'bg-transparent hover:bg-gray-50 text-blue-500';
            default:
                return '';
        }
    };

    if (!mounted || modals.length === 0) return null;

    return createPortal(
        <div className="fixed inset-0 z-500 flex items-center justify-center p-4 safe-area-inset-left safe-area-inset-right safe-area-inset-top safe-area-inset-bottom">
            {modals.map(modal => (
                <React.Fragment key={modal.id}>
                    {/* 遮罩层 */}
                    {modal.mask && (
                        <div
                            className="fixed inset-0 bg-black/50 transition-opacity duration-200 animate-in fade-in"
                            onClick={() => handleMaskClick(modal.id, modal.maskClosable)}
                        />
                    )}

                    {/* 模态框 */}
                    <div
                        className={`fixed max-w-full w-full max-w-sm sm:max-w-md md:max-w-lg lg:w-[520px] rounded-lg bg-white shadow-[0_2px_12px_0_rgba(0,0,0,0.1)] transition-all duration-[300ms] ease-out animate-in fade-in zoom-in-95 ${modal.className || ''}`}
                        style={{
                            ...modal.style
                        }}
                    >
                        {/* 头部 */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-200">
                            <div className="flex-1 flex items-center justify-center">
                                <h3 className="text-lg font-semibold text-gray-900 leading-[24px]">
                                    {modal.title}
                                </h3>
                            </div>
                        </div>

                        {/* 内容 */}
                        <div className="p-6">
                            <div className="text-gray-700 text-base leading-[20px] text-center">
                                {modal.content}
                            </div>
                        </div>

                        {/* 底部 */}
                        <div className="flex justify-end gap-3 p-1.5 ">
                            <button
                                onClick={() => handleCancel(modal.id)}
                                className="flex-1 px-6 py-2 text-base font-medium text-gray-700 bg-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 rounded-md"
                                {...modal.cancelButtonProps}
                            >
                                {modal.cancelText}
                            </button>
                            <button
                                onClick={() => handleOk(modal.id)}
                                className={`flex-1 px-6 py-2 text-base font-medium text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md ${getOkButtonClass(modal.okType)}`}
                                {...modal.okButtonProps}
                            >
                                {modal.okText}
                            </button>
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>,
        document.body
    );
};

export default Modal;