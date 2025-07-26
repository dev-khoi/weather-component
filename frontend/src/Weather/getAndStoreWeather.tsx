import { useState, createContext, useEffect, useRef } from "react";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./getAndSaveLayout.tsx";
import { getWeather, getLocation } from "../helpers/weatherAPI.tsx";
import type {
    ComponentState,
    WeatherDataType,
    UserComponentContextType,
    LatLongType,
    HeadInfo,
} from "../types/types.tsx";
import { timeConvert, weatherFUnits, weatherUnits } from "../helpers/helper.ts";
import { NavBar } from "@/components/ui/navbar.tsx";
import type { ReactNode } from "@tanstack/react-router";
import { UnitProvider, useUnit } from "./unitContext.tsx";
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

// create context of what components
const weatherDataContext = createContext<UserComponentContextType | null>(null);

const WeatherData = ({ children }: { children: ReactNode }) => {
    // *checking app version
    const storedVersion = localStorage.getItem("app_version");
    // Reseting localStorage if it's not new version
    // prettier-ignore
    useEffect(() => {
        if (storedVersion !== APP_VERSION.toString()) {
            localStorage.clear();
            localStorage.setItem("app_version", APP_VERSION);
        }}, []);

    // state of component in layout
    const [weatherComponent, setWeatherComponent] = useState<WeatherDataType[]>(
        [],
    );

    // location and time of the weather
    const [weatherHeadInfo, setWeatherHeadInfo] = useState<{
        location: string;
        time: string;
    }>(() => {
        const stored = localStorage.getItem("weather_head_info");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return {
                    location: parsed.location,
                    time: parsed.time
                        ? new Date(parsed.time).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                          })
                        : "loading",
                };
            } catch {
                // fallback if JSON is invalid
                return { location: "loading", time: "loading" };
            }
        }
        return { location: "loading", time: "loading" };
    });
    const { unit } = useUnit();
    const weatherLoading = useRef<Boolean>(true);
    // save weather data and head info to local storage
    useEffect(() => {
        if (!weatherLoading.current && weatherComponent.length > 0) {
            localStorage.setItem(
                "userComponentData",
                JSON.stringify(weatherComponent),
            );

            localStorage.setItem("weather_data_time", Date.now().toString());

            weatherLoading.current = true;
        }
    }, [weatherComponent]);

    useEffect(() => {
        if (
            (!weatherLoading.current &&
                weatherHeadInfo.location !== "loading") ||
            weatherHeadInfo.time !== "loading"
        ) {
            localStorage.setItem(
                "weather_head_info",
                JSON.stringify(weatherHeadInfo),
            );
            weatherLoading.current = true;
        }
    }, [weatherHeadInfo]);

    const assignWeatherData = async () => {
        try {
            getLocation().then((location: LatLongType) =>
                getWeather({ location, unit }).then((data) => {
                    // pass weather data into formatting function
                    const formattedData = formatNewWeatherData(data);

                    // setting and saving data into local storage
                    weatherLoading.current = false;
                    setWeatherComponent(formattedData.weatherData);
                    setWeatherHeadInfo(formattedData.weatherInfo);
                }),
            );
        } catch (e) {
            console.error(e);
        }
    };
    // load data into localStorage
    useEffect(() => {
        const stored = localStorage.getItem("userComponentData");
        const cacheTime = localStorage.getItem("weather_data_time");
        const cachedUnit = localStorage.getItem("weather_data_unit");

        const now = Date.now();
        // time for page to pull new from api
        const THRESHOLD = 60 * 60 * 1000; // 1 hour

        if (
            stored &&
            JSON.parse(stored).length > 0 &&
            cacheTime &&
            now - Number(cacheTime) < THRESHOLD &&
            cachedUnit === unit
        ) {
            setWeatherComponent(JSON.parse(stored));
        } else {
            assignWeatherData();
        }
    }, [unit]);

    // format function for new api data
    const formatNewWeatherData = (
        weatherData: any,
    ): { weatherData: WeatherDataType[]; weatherInfo: HeadInfo } => {
        // prettier-ignore
        // Flatten weatherData into a plain object called "data", excluding "sys" and unrelated fields
        const {  weather, main, visibility, wind, rain, snow, clouds, dt, name, sys } = weatherData;
        const { sunrise, sunset } = sys;

        // Only include relevant weather-related fields
        const formatWeatherData: Record<string, any> = {
            // Weather (flatten first entry)
            weather_main: weather?.[0]?.main,
            weather_description: weather?.[0]?.description,
            // weather_icon: weather?.[0]?.icon,

            // Main weather info
            temp: main?.temp,
            feels_like: main?.feels_like,
            temp_min: main?.temp_min,
            temp_max: main?.temp_max,
            pressure: main?.pressure,
            humidity: main?.humidity,
            sea_level: main?.sea_level,
            grnd_level: main?.grnd_level,

            // Wind
            wind_speed: wind?.speed,
            wind_deg: wind?.deg,
            wind_gust: wind?.gust ?? "0",

            // Clouds
            cloudiness: clouds?.all,

            // Rain/Snow
            rain_1h: rain?.["1h"] ?? "0",
            snow_1h: snow?.["1h"] ?? "0",

            // Visibility
            visibility: visibility,

            sunrise: timeConvert(sunrise, {
                hour: "2-digit",
                minute: "2-digit",
            }),
            sunset: timeConvert(sunset, { hour: "2-digit", minute: "2-digit" }),
        };

        const arrayWeather = Object.entries(formatWeatherData);
        const formattedWeather: WeatherDataType[] = [];

        arrayWeather.forEach(([key, value], index) => {
            const unitKey =
                unit === "f"
                    ? (weatherFUnits[key] ?? "")
                    : unit === "c"
                      ? (weatherUnits[key] ?? "")
                      : "";

            formattedWeather.push({
                id: index.toString(),
                componentName: key,
                componentData:
                    value !== undefined && value !== null
                        ? `${value} ${unitKey}`.trim()
                        : (value ?? ""),
            });
        });

        const weatherInfo = {
            location: name,
            time: timeConvert(dt, {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        };
        return { weatherData: formattedWeather, weatherInfo };
    };

    return (
        <weatherDataContext.Provider
            value={{
                weatherData: weatherComponent,
                setWeatherData: setWeatherComponent,
                headInfo: weatherHeadInfo,
                assignWeatherData,
            }}
        >
            {children}
        </weatherDataContext.Provider>
    );
};

export const App = () => {
    return (
        <>
            <NavBar />
            <UnitProvider>
                <WeatherData>
                    {/* <AddGridComponentButton /> */}

                    <GridComponent />
                </WeatherData>
            </UnitProvider>
        </>
    );
};
export { weatherDataContext };
export type {
    WeatherDataType as weatherDataType,
    UserComponentContextType,
    ComponentState,
};
