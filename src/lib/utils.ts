import { cache } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { v4 as uuidv4 } from 'uuid';
import { Option } from "@/types/option";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 使用 React cache 包装，避免重复生成
export const generateUUID = cache((): string => {
  return uuidv4().toUpperCase()
});

export const getOptionObject = (options: Option[], value: number) => {
  const option = options.find((item) => item.value === value);
  return option ? option : options[0];
}