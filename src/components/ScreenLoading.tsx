"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface LoadingConfig {
    text: string;
    duration?: number;
}

class LoadingManager {
    private static instance: LoadingManager;
    private setLoadingFn: ((config: LoadingConfig | null) => void) | null = null;

    private constructor() { }

    static getInstance(): LoadingManager {
        if (!LoadingManager.instance) {
            LoadingManager.instance = new LoadingManager();
        }
        return LoadingManager.instance;
    }

    register(setLoadingFn: (config: LoadingConfig | null) => void) {
        this.setLoadingFn = setLoadingFn;
    }

    show(text: string = '加载中...', options?: { closable?: boolean; duration?: number }) {
        if (this.setLoadingFn) {
            this.setLoadingFn({
                text,
                duration: options?.duration,
            });
        }
    }

    hide() {
        if (this.setLoadingFn) {
            this.setLoadingFn(null);
        }
    }
}

export const loading = LoadingManager.getInstance();

const ScreenLoading: React.FC = () => {
    const [config, setConfig] = useState<LoadingConfig | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        loading.register(setConfig);
        setMounted(true);
    }, []);

    useEffect(() => {
        if (config?.duration) {
            const timer = setTimeout(() => {
                loading.hide();
            }, config.duration);
            return () => clearTimeout(timer);
        }
    }, [config]);

    if (!mounted || !config) return null;

    return createPortal(
        <div className="fixed inset-0 z-500 flex items-center justify-center bg-black/1 backdrop-blur-sm">
            <div className="backdrop-blur-md rounded-2xl p-8">
                <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 border-4 border-white border-t-(--button-background) rounded-full animate-spin"></div>
                    <p className="text-gray-800 text-lg">{config.text}</p>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ScreenLoading;