"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../ui/CommonButton";
import { MessageItem } from '@/types/message';

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

const OutMessage = () => (
    <div
        className='w-full text-center text-[.8rem] pt-1.5! pb-1.5!'
        style={{
            color: 'var(--font-color-tip)'
        }}
    >
        你离开了聊天
    </div>
)

const Chat = () => {

    const [messageList, setMessageList] = useState<MessageItem[]>([]);

    useEffect(() => {
        const data: MessageItem[] = Array.from({ length: 50 }, ((_, i: number) => {
            return {
                sender: i % 2 === 0 ? 1 : 2, type: 1, text: `message - - - ${i}`, createdAt: new Date()
            };
        }));
        setMessageList(data);
    }, [])

    return (
        <div className="h-full w-full p-0 md:p-25 ">
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
                    <div className="h-15 border border-red-500">header</div>
                    <div
                        className="w-full h-full overflow-y-auto border border-blue-500 p-2 flex flex-col"
                        style={{
                            scrollbarWidth: 'none',
                            msOverflowStyle: 'none'
                        }}
                    >
                        {
                            messageList.map((v: MessageItem, index: number) => {
                                if (v.sender === 2) {
                                    return <OtherMessageItem key={index} {...v} />
                                } else {
                                    return <MeMessageItem key={index} {...v} />
                                }
                            })
                        }

                    </div>
                    <div className="h-20 border border-red-500">footer</div>
                </div>
            </div>

        </div >
    )
}

export default Chat;