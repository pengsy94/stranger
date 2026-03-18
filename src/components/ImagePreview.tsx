"use client";

import { FC } from "react";
import Image from "next/image";

interface ImagePreviewProps {
    imageUrl: string;
    onClose: () => void;
}

const ImagePreview: FC<ImagePreviewProps> = ({ imageUrl, onClose }) => {
    return (
        <div
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 cursor-pointer"
            onClick={onClose}
        >
            <Image
                src={imageUrl}
                alt="放大图片"
                width={800}
                height={800}
                className="max-w-[90vw] max-h-[90vh] object-contain"
                style={{ width: "auto", height: "auto" }}
            />
        </div>
    );
};

export default ImagePreview;