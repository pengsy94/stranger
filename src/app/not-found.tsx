// app/404.tsx（全局生效，无需 'use client'，支持服务端渲染）
import { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
    title: "404 - 悄悄",
    keywords: '悄悄,匿名聊天,悄悄聊,随机聊天,漂流瓶,陌路人',
    description: "悄悄是一个面向Z世代的在线匿名随机聊天移动社交平台。漂流瓶、随机聊天，快速开始一对一私密聊天。",
};

export default function NotFound() {
    return (
        <main className="h-full flex flex-col items-center justify-center p-8 bg-background font-sans">
            <div className='flex flex-row h-12.5'>
                <div className='h-full flex justify-center items-center mr-5! pr-5! text-2xl font-medium align-top border-r border-r-[rgba(0,0,0,.3)]'>
                    404
                </div>
                <div className='h-full flex justify-center items-center'>
                    This page could not be found.
                </div>
            </div>

            <div className={'mt-5! text-sm'}>
                你访问的页面路径无效，请检查网址或返回 <button className='hover:bg-transparent'><Link href="/">首页</Link></button>
            </div>
        </main>
    );
}