"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

interface MessageImageProps {
    imageUrl: string;
    alt: string;
    onImageClick: (imageUrl: string) => void;
    burnAfterRead?: boolean;
    isViewed?: boolean;
    onBurn?: () => void;
}

const MessageImage: FC<MessageImageProps> = ({
    imageUrl,
    alt,
    onImageClick,
    burnAfterRead = false,
    isViewed = false,
    onBurn
}) => {
    const [showImage, setShowImage] = useState(true);

    // 处理图片点击事件
    const handleClick = () => {
        onImageClick(imageUrl);
        
        // 如果是即阅即焚消息且未查看过，立即销毁
        if (burnAfterRead && !isViewed) {
            setShowImage(false);
            // 调用销毁回调
            if (onBurn) {
                onBurn();
            }
        }
    };

    // 如果图片已经被查看过且是即阅即焚消息，直接隐藏
    useEffect(() => {
        if (burnAfterRead && isViewed) {
            setShowImage(false);
            // 不再调用onBurn，因为onBurn已经在startBurnCountdown中被调用了
            // 避免无限循环更新
        }
    }, [burnAfterRead, isViewed]);

    if (!showImage) {
        return (
            <div 
                className="max-w-full rounded p-4 bg-gray-100 text-gray-500 text-center cursor-not-allowed"
            >
                [图片已销毁]
            </div>
        );
    }

    return (
        <div className="relative">
            {/* 即阅即焚标识 */}
            {burnAfterRead && (
                <div className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1 rounded opacity-80 z-10">
                    即焚
                </div>
            )}
            
            <Image
                src={imageUrl}
                alt={alt}
                width={200}
                height={200}
                className="max-w-full rounded cursor-pointer"
                style={{ height: "auto" }}
                onClick={handleClick}
            />
            
            {/* 即阅即焚图片蒙层 */}
            {burnAfterRead && !isViewed && (
                <div 
                    className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center rounded z-5"
                    onClick={handleClick}
                >
                    <div className="text-white text-sm font-medium">点击查看原图</div>
                </div>
            )}
        </div>
    );
};

export default MessageImage;