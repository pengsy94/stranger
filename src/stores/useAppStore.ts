import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware'

import { Option } from '@/types/option';
import { ChatConnectOtherMate, MessageItem } from '@/types/message';
import { ageOptions, sexOptions } from '@/lib/data';

interface AppState {
    mate: {
        age: Option,
        sex: Option,
    }
    connect: {
        status: boolean,
        depart: boolean,
        depart_message?: string,
        otherMate: ChatConnectOtherMate,
        messageList: MessageItem[]
    }
    onlineCount: number

    // Actions
    updateMateAge: (age: Option) => void
    updateMateSex: (sex: Option) => void
    setConnect: (otherMate: ChatConnectOtherMate, status: boolean) => void
    setOnlineCount: (count: number) => void
    setMessageList: (messages: MessageItem[]) => void
    setConnectDepart: (depart: boolean, message?: string) => void
    clearConnect: () => void
    reset: () => void
}

// 在服务端安全的初始化函数
const getDefaultInitialState = () => ({
    mate: {
        age: ageOptions[0],
        sex: sexOptions[0],
    },
    connect: {
        status: false,
        depart: false,
        depart_message: '你已与对方说再见，会话被终止...',
        otherMate: {
            to: '',
            age: { label: '', value: 0 },
            sex: { label: '', value: 0 },
            location: '',
            tag: []
        },
        messageList: []
    },
    onlineCount: 0
});

const useAppStore = create<AppState>()(
    devtools(
        persist(
            (set, get) => ({
                ...getDefaultInitialState(),
                updateMateAge: (age: Option) => set((state) => ({
                    mate: { ...state.mate, age }
                })),
                updateMateSex: (sex: Option) => set((state) => ({
                    mate: { ...state.mate, sex }
                })),
                setConnect: (otherMate: ChatConnectOtherMate, status: boolean) => set(() => ({
                    connect: {
                        status,
                        depart: true,
                        otherMate,
                        messageList: []
                    }
                })),
                setMessageList: (messages: MessageItem[]) => set((state) => ({
                    connect: {
                        ...state.connect,
                        messageList: messages
                    }
                })),
                setConnectDepart: (depart: boolean, message?: string) => set((state) => ({
                    connect: {
                        ...state.connect,
                        depart,
                        depart_message: message || state.connect.depart_message,
                    }
                })),
                setOnlineCount: (count: number) => set(() => ({
                    onlineCount: count
                })),
                clearConnect: () => set((state) => ({
                    connect: {
                        ...state.connect,
                        ...getDefaultInitialState().connect
                    }
                })),
                reset: () => set(getDefaultInitialState()),
            }),
            {
                name: 'StrangerStorage', // localStorage 的 key
                skipHydration: false, // 允许水合时同步数据
                storage: createJSONStorage(() => {
                    // 在服务端返回一个模拟的存储
                    if (typeof window === 'undefined') {
                        return {
                            getItem: () => null,
                            setItem: () => { },
                            removeItem: () => { },
                        }
                    }
                    return localStorage
                }),
                // 可选：只持久化部分状态 - 排除消息列表以避免localStorage容量问题
                partialize: (state) => ({
                    mate: state.mate,
                    connect: {
                        ...state.connect,
                        messageList: [], // 不持久化消息列表，避免localStorage容量限制
                    },
                }),
            }
        )
    )
)

// 在开发环境订阅状态变化
if (process.env.NODE_ENV === 'development') {
    useAppStore.subscribe((state, prevState) => {
        console.log('🔄 Zustand State Changed:')
        console.log('📜 Previous:', prevState)
        console.log('📖 Current:', state)
    })
}

export default useAppStore;