"use client";

import Image from "next/image";
import { useState } from "react";

import Button from "@/components/ui/CommonButton";
import SelectFormModal from "@/components/home/SelectFormModal";

const Index = () => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    return (
        <>
            <div className="pt-6">
                <Image src={'/next.svg'} alt="logo" style={{ width: '120px', height: '120px' }} width={120} height={120} />
            </div>
            <div className="pt-2 pb-4 text-sm select-none">
                <span className="text-black">在线: 348 人</span>
            </div>
            <div className="pt-2">
                <Button label="开始遇见" onClick={() => setIsModalOpen(true)} />
            </div>

            <SelectFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    )
}


export default Index;