import { generateUUID } from "@/lib/utils";

const APP_KEY = "STRANGER_KEY";

export const getAppKey = () => {
    let key = localStorage.getItem(APP_KEY);
    if (key == null) {
        key = generateUUID();
        localStorage.setItem(APP_KEY, key);
    }

    return key;
} 