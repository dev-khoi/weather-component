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

// Map of parameter keys to their units
    const weatherUnits: Record<string, string> = {
        // Main Weather Info
        weather_main: "",
        weather_description: "",
        weather_icon: "",
        // Temperature Info
        temp: "°c", // Kelvin by default
        feels_like: "°c",
        temp_min: "°c",
        temp_max: "°c",
        // Atmospheric Info
        pressure: "hPa",
        humidity: "%",
        sea_level: "hPa",
        grnd_level: "hPa",
        // Wind & Clouds
        wind_speed: "m/s",
        wind_deg: "°",
        wind_gust: "m/s",
        cloudiness: "%",
        visibility: "m",
        // Rain/Snow (optional)
        rain_1h: "mm/h",
        snow_1h: "mm/h",
        // Sunrise/Sunset
        sunrise: "",
        sunset: "",
    };
    
export {timeConvert, weatherUnits}