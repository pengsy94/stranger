"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, LaughIcon } from "lucide-react";

import Button from "@/components/ui/CommonButton";
import { MessageItem } from '@/types/message';
import useAppStore from "@/stores/useAppStore";
import { ageOptions, sexOptions } from "@/lib/data";

const OtherMessageItem = (props: MessageItem) => {
    return (
        <div className="flex flex-col">
            <div className="pl-4 text-[#B5B5C3] self-start text-sm">2026-01-14 23:56:06</div>
            <div className="max-w-4/5 select-none pt-2 pr-4 pb-2 pl-4 mb-2 bg-[#C9F7F5] text-[#7E8299] break-all text-sm rounded-tl-xl rounded-tr-xl rounded-br-xl self-start">
                {props.text}
            </div>
        </div>
    );
}

const MeMessageItem = (props: MessageItem) => {
    return (
        <div className="flex flex-col">
            <div className="pr-4 text-[#B5B5C3] self-end text-sm">2026-01-14 23:56:06</div>
            <div className="max-w-4/5 select-none pt-2 pr-4 pb-2 pl-4 mb-2 bg-[#E1F0FF] text-[#7E8299] break-all text-sm rounded-tl-xl rounded-tr-xl rounded-bl-xl self-end">
                {props.text}
            </div>
        </div>
    );
}

const Chat = () => {

    const { setConnect } = useAppStore();
    const [messageList, setMessageList] = useState<MessageItem[]>([]);

    useEffect(() => {
        const data: MessageItem[] = Array.from({ length: 8 }, ((_, i: number) => {
            return {
                sender: i % 2 === 0 ? 1 : 2, type: 1, text: `message message message message message message - - - ${i}`, createdAt: new Date()
            };
        }));
        setMessageList(data);
    }, [])

    const backIndex = () => {
        // 先清理聊天信息
        const otherMate = {
            age: ageOptions[0],
            sex: sexOptions[1],
            location: '成都市',
            tag: ['快乐小狗', '反差er', '人间清醒']
        }
        setConnect(otherMate, false);
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行行为
        }
    };

    return (
        <div className="h-full w-full md:max-w-5xl p-0 md:pl-0 md:pr-0 md:pt-20 md:pb-20">
            <div className="h-full w-full flex flex-row">
                <div className="hidden md:inline w-70 mr-5 p-8 rounded-sm bg-white border border-white">
                    <div className="flex justify-center items-center">
                        <Image src={'/next.svg'} style={{ width: '80px', height: '80px' }} width={80} height={80} alt="cover" />
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">性别</div>
                        <div className="text-[#B5B5C3] text-sm">男</div>
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">年龄</div>
                        <div className="text-[#B5B5C3] text-sm">18-22岁</div>
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">居住地</div>
                        <div className="text-[#B5B5C3] text-sm">中国,四川,成都</div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <Button label="重新遇见" />
                        <Button label="离开" />
                    </div>
                </div>

                <div className="h-full w-full rounded-sm bg-white/95 flex flex-col">
                    <div className="h-15 pl-4 pr-4 border-b border-b-gray-200 flex flex-row items-center justify-between">
                        <div className="text-[#3F4254] text-sm">当前在线: 314 人</div>
                        <div className="md:hidden">
                            <Button label="返回首页" onClick={() => backIndex()} />
                        </div>
                    </div>
                    <div className="w-full h-full overflow-y-auto thin-scrollbar p-2 flex flex-col">

                        <div className="inline md:hidden pl-3 pr-3 pt-3">
                            <div className="p-3 mb-5 rounded-sm bg-[#C9F7F5]">
                                <div className="flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">性别</div>
                                    <div className="text-[#B5B5C3] text-sm">男</div>
                                </div>

                                <div className="mt-3 flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">年龄</div>
                                    <div className="text-[#B5B5C3] text-sm">18-22岁</div>
                                </div>

                                <div className="mt-3 flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">居住地</div>
                                    <div className="text-[#B5B5C3] text-sm">中国,四川,成都</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center flex justify-center items-center mb-5">
                            <span className="bg-[#E4E6EF] p-[0.1rem_0.5rem] text-[12px] rounded-[0.42rem] text-[#3F4254]">
                                聊天提示： 绿色聊天，遵守秩序，本站24H进行内容审核
                            </span>
                        </div>

                        {
                            messageList.map((v: MessageItem, index: number) => {
                                if (v.sender === 2) {
                                    return <OtherMessageItem key={index} {...v} />
                                } else {
                                    return <MeMessageItem key={index} {...v} />
                                }
                            })
                        }

                        <div className="text-center flex justify-center items-center mt-5 mb-3">
                            <span className="bg-[#E4E6EF] p-[0.1rem_0.5rem] text-[12px] rounded-[0.42rem] text-[#3F4254]">
                                你已与对方说再见，会话被终止...
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-t-gray-200 flex flex-col">
                        <div className="h-12">
                            <input
                                className="h-full w-full rounded-sm pl-2 pr-2 border-none outline-none placeholder:text-muted-foreground text-sm"
                                placeholder="想说的话～"
                                onKeyDown={handleKeyDown}
                                enterKeyHint="send"
                            />
                        </div>
                        <div className="h-10 pl-4 pr-4 flex flex-row justify-between">
                            <div className="flex flex-row gap-3 items-center">
                                <div><LaughIcon className="text-[#B5B5C3] cursor-pointer hover:text-[#7E8299]" /></div>
                                <div><ImageIcon className="text-[#B5B5C3] cursor-pointer hover:text-[#7E8299]" /></div>
                            </div>
                            <div className="flex flex-row gap-3 pb-1 items-center">
                                <Button label="再见" className="pl-2 pr-2 bg-[#E4E6EF] text-[#3F4254]" />
                                <Button label="重新遇见" className="pl-2 pr-2 bg-[#3699FF] text-white" />

                                <div className="hidden md:inline">
                                    <Button label="发送" className="pl-2 pr-2 bg-[#3699FF] text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    )
}

export default Chat;