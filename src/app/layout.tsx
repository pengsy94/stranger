import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";

import ViewportHeightProvider from "@/lib/provider/ViewportHeightProvider";
import SocketProvider from "@/lib/provider/SocketProvider";

import ScreenLoading from '@/components/ScreenLoading';
import Message from '@/components/Message';
import Modal from '@/components/Modal';

import "./globals.css";

// Roboto 字体无需依赖 Google Fonts 直连（Next.js 会自动优化）
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  // icons: '/vercel.svg',
  icons: 'favicon.ico',
  title: "陌路人聊天|匿名聊天 - 匿名聊天交友社区",
  keywords: '匿名聊天,匿名交友,匿名好友,匿名社区,遇见陌生人,陌路人聊天,陌生人社交,陌生人聊天',
  description: "一个在线认识新朋友的全新服务。随机选取另一个用户和你搭配一对一的聊天。整个对话实在匿名状态下进行的，当然，这并不会限制你向你的陌生人朋友透露你的联系方式以获取进一步的联络。",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  minimumScale: 1.0,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body className={roboto.variable}>
        <ScreenLoading />
        <Message />
        <Modal />

        {/* 🔴 引入客户端组件处理视口高度 */}
        <ViewportHeightProvider>
          <div className={'app-wrapper bg-transparen'}>
            <div className="h-full bg-background">
              <main className="flex flex-col items-center h-full bg-[url('/images/login-visual.svg')] bg-no-repeat bg-bottom bg-size-[auto_calc(100%-60px)] lg:bg-contain">
                {children}
              </main>
            </div>
          </div>
        </ViewportHeightProvider>

        {/* Socket Provider */}
        <SocketProvider />
      </body>
    </html>
  );
}
