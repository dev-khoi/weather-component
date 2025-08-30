import {
    WiThermometer,
    WiHumidity,
    WiBarometer,
    WiStrongWind,
    WiWindDeg,
    WiCloudy,
    WiRain,
    WiSnow,
    WiCloud,
    WiWindy,
    WiSunrise,
} from "react-icons/wi";
import { FaTemperatureHigh, FaTemperatureLow, FaEye } from "react-icons/fa";
import { TbTemperature } from "react-icons/tb";

import { type JSX } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = import.meta.env.VITE_WEATHER_HOST;

// Complete icons mapping for all weather data fields
const weatherIcon: Record<string, JSX.Element> = {
    sunrise: <WiSunrise />,

    // Weather description
    weather_main: <WiCloud />,
    weather_description: <WiCloud />,

    // Temperature
    temp: <TbTemperature />,
    feels_like: <WiThermometer />,
    temp_min: <FaTemperatureLow />,
    temp_max: <FaTemperatureHigh />,

    // Pressure
    pressure: <WiBarometer />,
    sea_level: <WiBarometer />,
    grnd_level: <WiBarometer />,

    // Humidity
    humidity: <WiHumidity />,

    // Wind
    wind_speed: <WiStrongWind />,
    wind_deg: <WiWindDeg />,
    wind_gust: <WiWindy />,

    // Clouds
    cloudiness: <WiCloudy />,

    // Precipitation
    rain_1h: <WiRain />,
    snow_1h: <WiSnow />,

    // Visibility
    visibility: <FaEye />,
};
// Web api for getting the lat and long of the user
const getLocation = async () => {
    return new Promise<{ lat: number; long: number }>((resolve, reject) => {
        // success getting data
        const success = (pos: GeolocationPosition) => {
            console.debug("success");
            resolve({ lat: pos.coords.latitude, long: pos.coords.longitude });
        };

        // failure getting data
        const error = (e: GeolocationPositionError) => {
            reject(e);
        };

        // getCurrentPosition api
        const location = navigator.geolocation;
        if (location) {
            location.getCurrentPosition(success, error);
        }
    });
};

const getWeather = async ({
    location,
    unit = "c",
}: {
    location: { lat: number; long: number };
    unit: "f" | "c";
}) => {
    // convert f and c to the corresponding names
    const apiUnit =
        unit === "f" ? "imperial" : unit === "c" ? "metric" : "metric"; // fallback to metric for anything else

    const url = `${baseUrl}?${new URLSearchParams({
        lat: String(location.lat),
        lon: String(location.long),
        units: apiUnit,
        appid: apiKey,
    })}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            // console.debug(responseData);

            return responseData;
        }
        console.error(response);
    } catch (error) {
        console.error(error);
    }
};

export { getWeather, getLocation, weatherIcon };
