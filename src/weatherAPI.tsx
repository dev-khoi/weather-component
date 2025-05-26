import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = import.meta.env.VITE_WEATHER_HOST;

const getWeather = async () => {
    const url = `${baseUrl}?${new URLSearchParams({
        key: apiKey,
        q: "auto:ip",
    })}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            // console.debug(responseData);
            return responseData;
        }
        console.error(response.status);
    } catch (error) {
        console.error(error);
    }
};

// custom hook for useWeather
// returning array of weather element with index
const useWeather = async () => {
    const [weatherData, setWeatherData] = useState(null)
    useEffect(() => {
        getWeather().then((data) => {
            setWeatherData(data.current);
        });
    }, []);
    console.log(weatherData)
    return [weatherData];
};

export { getWeather, useWeather };
