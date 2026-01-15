"use client"

import { useEffect } from 'react';

export default function ViewportHeightProvider({ children }: { children: React.ReactNode }) {

    useEffect(() => {
        if (!window) return; // 服务端渲染时跳过

        // 核心：计算并设置 CSS 变量（--vh）
        const setViewportHeight = () => {
            // 取可视区高度（兼容所有机型）
            const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            // 同步到根元素的 CSS 变量（全局可用）
            document.documentElement.style.setProperty('--vh', `${viewportHeight}px`);
        };

        // 1. 初始化执行（页面加载时设置一次）
        setViewportHeight();

        // 2. 监听视口变化（旋转屏幕/地址栏隐藏/显示）
        window.addEventListener('resize', setViewportHeight);
        window.addEventListener('orientationchange', setViewportHeight);

        // 3. 组件卸载时清理监听（避免内存泄漏）
        return () => {
            window.removeEventListener('resize', setViewportHeight);
            window.removeEventListener('orientationchange', setViewportHeight);
        };
    }, []); // 空依赖：仅在组件挂载/卸载时执行

    return (
        <main className={`w-full h-full`}>
            {children}
        </main>
    );
}