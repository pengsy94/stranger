"use client";

import { FC } from "react";
import moment from "moment";
import { MessageItem } from '@/types/message';
import MessageImage from "@/components/MessageImage";

interface OtherMessageItemProps extends MessageItem {
    onImageClick?: (imageUrl: string | undefined) => void;
    onBurn?: () => void;
}

const OtherMessageItem: FC<OtherMessageItemProps> = (props) => {
    // 检查是否为图片消息
    const isImageMessage = props.type === 2 || props.text?.startsWith('data:image/') || props.image?.startsWith('data:image/');
    
    // 获取图片URL
    const getImageUrl = () => {
        if (props.type === 2 && props.image) {
            return props.image;
        }
        return props.text || '';
    };

    const handleImageClick = () => {
        const imageUrl = getImageUrl();
        if (props.onImageClick && imageUrl) {
            props.onImageClick(imageUrl);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="pl-4 text-[#B5B5C3] self-start text-sm">{moment(props.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
            <div className="max-w-4/5 select-none pt-2 pr-4 pb-2 pl-4 mb-2 bg-[#C9F7F5] text-[#7E8299] break-all text-sm rounded-tl-xl rounded-tr-xl rounded-br-xl self-start">
                {isImageMessage ? (
                    <MessageImage
                        imageUrl={getImageUrl()}
                        alt="对方发送的图片"
                        onImageClick={() => handleImageClick()}
                        burnAfterRead={props.burnAfterRead}
                        isViewed={props.isViewed}
                        onBurn={props.onBurn}
                    />
                ) : (
                    props.text || ''
                )}
            </div>
        </div>
    );
};

export default OtherMessageItem;