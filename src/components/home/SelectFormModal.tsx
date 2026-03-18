
'use client';

import { MarsIcon, VenusIcon } from "lucide-react";
import ResponsiveModal from "@/components/modal/ResponsiveModal";

import { ageOptions, sexOptions } from "@/lib/data";
import { Option } from "@/types/option";
import useAppStore from "@/stores/useAppStore";

import { eventEmitter } from "@/lib/event";
import { getAppKey } from "@/utils/key";

interface SelectFormProps {
    mate: {
        age: Option,
        sex: Option,
    },
    saveOptions: (sex: Option) => void
}

const SexSelectForm = (props: SelectFormProps) => {
    return (
        <div className="flex flex-row justify-center gap-10">
            {
                sexOptions.map((item: Option, index: number) => {
                    let selected = props.mate.sex.value === item.value ? 'border-(--sex-selected-card) text-(--sex-selected-card)' : 'border-(--sex-card) text-gray-500';
                    return (
                        <div
                            key={index}
                            className={`w-24 h-28 cursor-pointer rounded-2xl flex flex-col justify-center items-center border ${selected}`}
                            onClick={() => props.saveOptions(item)}
                        >
                            {
                                item.value === 1 ? <MarsIcon size={40} /> : <VenusIcon size={40} />
                            }
                            <div className="pt-1.5 select-none">我是{item.label}生</div>
                        </div>
                    );
                })
            }
        </div>
    );
}

interface IProps {
    isOpen: boolean
    onClose: () => void
}

const AgeSelectForm = (props: SelectFormProps) => {
    return (
        <div className="mt-4 flex flex-col gap-2">
            {
                ageOptions.map((item: Option, index: number) => {
                    let selected = props.mate.age.value === item.value ? 'border-(--sex-selected-card) text-(--sex-selected-card)' : 'border-(--sex-card) text-gray-500';
                    return (
                        <div
                            key={index}
                            className={`select-none p-2 border cursor-pointer ${selected}`}
                            onClick={() => props.saveOptions(item)}
                        >
                            {item.label}
                        </div>
                    );
                })
            }
        </div>
    );
}

const SelectFormModal = ({ isOpen = false, onClose = () => { } }: IProps) => {

    const { mate, updateMateAge, updateMateSex } = useAppStore();

    const handleMeet = async () => {
        // 收集并打印年龄、性别等信息
        const userInfo = {
            type: 'meet',
            user_key: getAppKey(),
            age_index: mate.age.value,
            sex_index: mate.sex.value,
            location: '银河系,太阳系,地球',
        };

        // 执行发送
        eventEmitter.emit('meet', userInfo)
    }

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onClose={() => onClose()}
            title="选择你的基本信息"
            footer={
                <div className="pb-4 pl-5 pr-5 shrink-0">
                    <div
                        className="w-full p-2 text-center select-none bg-(--button-background) active:bg-(--online-color) md:hover:bg-(--online-color) focus:bg-(--button-primary-color) focus-visible:bg-(--button-primary-color) text-white border-none rounded-md cursor-pointer transition-colors duration-200"
                        onClick={() => handleMeet()}
                    >
                        遇见
                    </div>
                </div>
            }
        >
            <div className="pt-2 flex flex-col">
                <SexSelectForm mate={mate} saveOptions={(item: Option) => updateMateSex(item)} />
                <AgeSelectForm mate={mate} saveOptions={(item: Option) => updateMateAge(item)} />
            </div>
        </ResponsiveModal>
    );

}


export default SelectFormModal;