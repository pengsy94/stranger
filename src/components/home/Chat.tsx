"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { ImageIcon, LaughIcon } from "lucide-react";

import Button from "@/components/ui/CommonButton";
import { MessageItem } from '@/types/message';
import useAppStore from "@/stores/useAppStore";
import { ageOptions, sexOptions } from "@/lib/data";
import { eventEmitter } from "@/lib/event";
import { modal } from "@/components/Modal";
import { getAppKey } from "@/utils/key";
import EmojiPicker from "@/components/EmojiPicker";
import ImagePreview from "@/components/ImagePreview";
import OtherMessageItem from "@/components/home/message/OtherMessageItem";
import MeMessageItem from "@/components/home/message/MeMessageItem";

const Chat = () => {

    const { mate, connect, onlineCount, setConnect, setMessageList, setConnectDepart } = useAppStore();
    const [content, setContent] = useState<string>('');
    const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
    const [showEnlargedImage, setShowEnlargedImage] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const laughIconRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 放大图片
    const handleImageEnlarge = (imageUrl: string | undefined) => {
        if (imageUrl) {
            setShowEnlargedImage(imageUrl);
        }
    };

    // 处理图片销毁
    const handleImageBurn = (index: number) => {
        // 创建新的消息列表，移除已销毁的消息
        const updatedMessages = [...connect.messageList];
        // 将图片消息标记为已销毁
        if (updatedMessages[index]) {
            updatedMessages[index] = {
                ...updatedMessages[index],
                isViewed: true
            };
        }
        // 更新消息列表
        setMessageList(updatedMessages);
    };

    // 关闭放大图片
    const handleCloseEnlargedImage = () => {
        setShowEnlargedImage(null);
    };

    // 滚动到底部的函数
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'end',
            inline: 'nearest'
        });
    };

    // 当消息列表变化时滚动到底部
    useEffect(() => {
        scrollToBottom();
    }, [connect.messageList]);

    // 点击外部关闭表情选择器
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showEmojiPicker &&
                emojiPickerRef.current &&
                !emojiPickerRef.current.contains(event.target as Node) &&
                laughIconRef.current &&
                !laughIconRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showEmojiPicker]);

    const backIndex = () => {
        // 先清理聊天信息
        const otherMate = {
            to: '',
            age: ageOptions[0],
            sex: sexOptions[1],
            location: '',
            tag: []
        };
        setConnect(otherMate, false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 阻止默认换行行为

            handleSendMessage();
        }
    };

    const handleSendMessage = () => {
        if (connect.depart) {
            return;
        }

        if (content.trim() === '') {
            return;
        }

        // 添加己方的发送数据
        const message: MessageItem = {
            sender: 1,
            type: 1,
            text: content,
            createdAt: new Date()
        };
        setMessageList([...connect.messageList, message]);

        setContent('');

        eventEmitter.emit('meet', {
            type: 'private',
            to: connect?.otherMate.to || '',
            message: content
        });
    };

    const handleDepart = () => {
        modal.confirm({
            title: '确认离开吗？',
            content: '确认离开当前聊天吗？',
            okText: '离开',
            onOk: () => {
                setConnectDepart(false, '你已与对方说再见，会话被终止...');
                eventEmitter.emit('meet', {
                    type: 'depart',
                    to: connect?.otherMate.to || '',
                });
            }
        });
    }

    const handleRestart = () => {
        modal.confirm({
            title: '确认重新遇见吗？',
            content: '确认重新遇见当前聊天吗？',
            okText: '重新遇见',
            onOk: () => {
                eventEmitter.emit('meet', {
                    type: 'meet',
                    user_key: getAppKey(),
                    age_index: mate.age.value,
                    sex_index: mate.sex.value,
                    location: '银河系,太阳系,地球',
                });
            }
        });
    }

    // 处理表情点击事件
    const handleEmojiClick = (emoji: string) => {
        if (!connect.depart) {
            return;
        }

        // 添加己方的发送数据
        const message: MessageItem = {
            sender: 1,
            type: 1,
            text: emoji,
            createdAt: new Date()
        };
        setMessageList([...connect.messageList, message]);

        // 发送表情给对方
        eventEmitter.emit('meet', {
            type: 'private',
            to: connect?.otherMate.to || '',
            message: emoji
        });

        // 关闭表情选择器
        setShowEmojiPicker(false);
    }

    // 处理图片选择事件
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;

            if (!connect.depart) {
                return;
            }

            // 添加己方的发送数据
            const message: MessageItem = {
                sender: 1,
                type: 2, // 类型2表示图片
                image: base64String,
                burnAfterRead: true,
                isViewed: false,
                createdAt: new Date()
            };
            setMessageList([...connect.messageList, message]);

            // 发送图片base64给对方，包含即阅即焚信息
            eventEmitter.emit('meet', {
                type: 'private',
                to: connect?.otherMate.to || '',
                message: {
                    text: base64String,
                    type: 2,
                    burnAfterRead: true
                }
            });
        };

        reader.readAsDataURL(file);

        // 重置文件输入
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div className="h-full w-full md:max-w-5xl p-0 md:pl-0 md:pr-0 md:pt-20 md:pb-20">
            <div className="h-full w-full flex flex-row overflow-visible">
                <div className="hidden md:inline w-70 mr-5 p-8 rounded-sm bg-white border border-white">
                    <div className="flex justify-center items-center">
                        <Image src={'/next.svg'} style={{ width: '80px', height: '80px' }} width={80} height={80} alt="cover" />
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">性别</div>
                        <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.sex?.label || ''}</div>
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">年龄</div>
                        <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.age?.label || ''}</div>
                    </div>

                    <div className="mt-3 flex flex-row justify-between">
                        <div className="text-[#3F4254] text-sm">居住地</div>
                        <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.location || ''}</div>
                    </div>

                    <div className="mt-4 flex flex-col gap-2">
                        <Button label="重新遇见" onClick={() => handleRestart()} />
                        <Button label="离开" onClick={() => backIndex()} />
                    </div>
                </div>

                <div className="h-full w-full rounded-sm bg-white/95 flex flex-col overflow-visible">
                    <div className="h-15 pl-4 pr-4 border-b border-b-gray-200 flex flex-row items-center justify-between">
                        <div className="text-[#3F4254] text-sm">当前在线: {onlineCount} 人</div>
                        <div className="md:hidden">
                            <Button label="返回首页" onClick={() => backIndex()} />
                        </div>
                    </div>
                    <div className="h-full w-full overflow-y-auto thin-scrollbar p-2 flex flex-col">

                        <div className="inline md:hidden pl-3 pr-3 pt-3">
                            <div className="p-3 mb-5 rounded-sm bg-[#C9F7F5]">
                                <div className="flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">性别</div>
                                    <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.sex?.label || ''}</div>
                                </div>

                                <div className="mt-3 flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">年龄</div>
                                    <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.age?.label || ''}</div>
                                </div>

                                <div className="mt-3 flex flex-row justify-between">
                                    <div className="text-[#7E8299] text-sm">居住地</div>
                                    <div className="text-[#B5B5C3] text-sm">{connect?.otherMate.location || ''}</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center flex justify-center items-center mb-5">
                            <span className="bg-[#E4E6EF] p-[0.1rem_0.5rem] text-[12px] rounded-[0.42rem] text-[#3F4254]">
                                聊天提示： 绿色聊天，遵守秩序，本站24H进行内容审核
                            </span>
                        </div>

                        {connect.messageList.map((v: MessageItem, index: number) => {
                            if (v.sender === 2) {
                                return (
                                    <OtherMessageItem
                                        key={index}
                                        {...v}
                                        onImageClick={handleImageEnlarge}
                                        onBurn={() => handleImageBurn(index)}
                                    />
                                );
                            } else {
                                return (
                                    <MeMessageItem
                                        key={index}
                                        {...v}
                                        onImageClick={handleImageEnlarge}
                                        onBurn={() => handleImageBurn(index)}
                                    />
                                );
                            }
                        })}

                        {
                            !connect.depart && (
                                <div className="text-center flex justify-center items-center mt-5 mb-3">
                                    <span className="bg-[#E4E6EF] p-[0.1rem_0.5rem] text-[12px] rounded-[0.42rem] text-[#3F4254]">
                                        {connect?.depart_message || ''}
                                    </span>
                                </div>
                            )
                        }

                        {/* 用于滚动定位的元素 */}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="border-t border-t-gray-200 flex flex-col overflow-visible">
                        <div className="h-12">
                            <input
                                className="h-full w-full rounded-sm pl-2 pr-2 border-none outline-none placeholder:text-muted-foreground text-[16px]"
                                placeholder="想说的话～"
                                onKeyDown={handleKeyDown}
                                disabled={!connect.depart}
                                enterKeyHint="send"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </div>
                        <div className="pl-4 pr-4 flex flex-row justify-between items-center py-2 overflow-visible">
                            <div className="flex flex-row gap-3 items-center relative overflow-visible">
                                <div ref={laughIconRef} onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="z-20">
                                    <LaughIcon className="text-[#B5B5C3] cursor-pointer hover:text-[#7E8299]" />
                                </div>
                                <div className="z-20">
                                    <ImageIcon
                                        className="text-[#B5B5C3] cursor-pointer hover:text-[#7E8299]"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />

                                {/* 表情选择器 */}
                                {showEmojiPicker && (
                                    <div ref={emojiPickerRef} className="absolute bottom-10 left-0">
                                        <EmojiPicker onEmojiSelect={handleEmojiClick} />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-row gap-3 pb-1 items-center">

                                {
                                    connect.depart && (
                                        <Button
                                            label="再见"
                                            className="pl-2 pr-2 bg-[#E4E6EF] text-[#3F4254]"
                                            onClick={() => handleDepart()}
                                        />
                                    )
                                }

                                {
                                    !connect.depart && (
                                        <Button
                                            label="重新遇见"
                                            onClick={() => handleRestart()}
                                            className="pl-2 pr-2 bg-[#3699FF] text-white"
                                        />
                                    )
                                }

                                {
                                    connect.depart && (
                                        <div className="md:inline">
                                            <Button
                                                onClick={() => handleSendMessage()}
                                                label="发送"
                                                className="pl-2 pr-2 bg-[#3699FF] text-white"
                                            />
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 图片放大预览层 */}
            {showEnlargedImage && (
                <ImagePreview
                    imageUrl={showEnlargedImage}
                    onClose={handleCloseEnlargedImage}
                />
            )}

        </div >
    );
}

export default Chat;