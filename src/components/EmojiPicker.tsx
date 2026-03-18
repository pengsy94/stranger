"use client";

import { FC } from "react";

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void;
    className?: string;
}

const EmojiPicker: FC<EmojiPickerProps> = ({ onEmojiSelect, className }) => {
    // 表情列表
    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣',
        '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜'
    ];
    
    return (
        <div className={`bg-white rounded-md shadow-[0_2px_10px_rgba(0,0,0,0.1)] border border-gray-200 p-2 w-64 max-h-40 z-50 ${className}`}>
            <div className="grid grid-cols-8 gap-1">
                {emojis.map((emoji, index) => (
                    <div 
                        key={index} 
                        onClick={() => onEmojiSelect(emoji)} 
                        className="w-8 h-8 flex items-center justify-center text-xl cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                        {emoji}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmojiPicker;