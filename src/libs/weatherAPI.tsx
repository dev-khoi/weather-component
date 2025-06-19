import {
  WiThermometer,
  WiHumidity,
  WiBarometer,
  WiStrongWind,
} from "react-icons/wi";
import {
  FaTemperatureHigh,
  FaTemperatureLow
} from "react-icons/fa";
import { TbTemperature } from "react-icons/tb";

import {type JSX} from "react"
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = import.meta.env.VITE_WEATHER_HOST;

// icons
const weatherIcon: Record<string, JSX.Element> = {
  temp: <TbTemperature />,
  feels_like: <WiThermometer />,
  temp_min: <FaTemperatureLow />,
  temp_max: <FaTemperatureHigh />,
  pressure: <WiBarometer />,
  humidity: <WiHumidity />,
  sea_level: <WiStrongWind />,
  grnd_level: <WiStrongWind />,
};

// Web api for getting the lat and long of the user
const getLocation = async () => {
    return new Promise<{ lat: Number; long: Number }>((resolve, reject) => {
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

const getWeather = async (location: { lat: Number; long: Number }) => {
    const url = `${baseUrl}?${new URLSearchParams({
        lat: String(location.lat),
        lon: String(location.long),
        units: "metric",
        appid: apiKey,
    })}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            // console.debug(responseData);

            console.debug(responseData);

            return responseData;
        }
        console.error(response);
    } catch (error) {
        console.error(error);
    }
};


export { getWeather, getLocation, weatherIcon };
