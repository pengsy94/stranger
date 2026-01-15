import { cache } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 使用 React cache 包装，避免重复生成
export const generateUUID = cache((): string => {
  return uuidv4().toUpperCase()
});
