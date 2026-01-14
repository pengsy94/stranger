import { Option } from "./option"

export interface MessageItem {
    // 发送方: 1-自己 2-对方
    sender: number
    // 发送类型: 1-文本 2-图片
    type: number

    text?: string
    image?: string

    createdAt: Date
}

export interface ChatConnectOtherMate {
    age: Option,
    sex: Option,
    location: string,
    tag: string[]
}