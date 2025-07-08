import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// converting epoch time to time
const timeConvert = (
    dt: number,
    format: Intl.DateTimeFormatOptions,
): string => {
    const time = new Date(0);
    time.setUTCSeconds(dt);
    return time.toLocaleString("en-US", format);
};


export {timeConvert}