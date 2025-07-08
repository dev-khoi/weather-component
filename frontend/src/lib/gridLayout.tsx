import { useState, createContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent.tsx";
import { getWeather, getLocation } from "./weatherAPI.tsx";
import { IconContext } from "react-icons";
import { FunctionBar } from "../components/functionBar.tsx";
import type {
    prop,
    ComponentState,
    weatherDataType,
    UserComponentContextType,
    latLongType,
} from "./types.tsx";
import { timeConvert } from "./utils.ts";
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(
    null,
);

const Layout = (prop: prop) => {
    // *checking app version
    const storedVersion = localStorage.getItem("app_version");

    // Reseting localStorage if it's not new version
    useEffect(() => {
        if (storedVersion !== APP_VERSION.toString()) {
            localStorage.clear();
            localStorage.setItem("app_version", APP_VERSION);
        }
    }, []);

    // state of component in layout
    const [userComponent, setUserComponent] = useState<weatherDataType[]>([]);

    // location and time of the weather
    const [headInfo, setHeadInfo] = useState<{
        location: string;
        time: string;
    }>(() => {
        const stored = localStorage.getItem("weather_info");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return {
                    location: parsed.location ?? "loading",
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

    useEffect(() => {
        localStorage.setItem("weather_info", JSON.stringify(headInfo));
    }, [headInfo]);

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

    // format function for new api data
    const formatNewWeatherData = (weatherData: any): weatherDataType[] => {
        // prettier-ignore
        // Flatten weatherData into a plain object called "data", excluding "sys" and unrelated fields
        const {  weather, main, visibility, wind, rain, snow, clouds, dt, name } = weatherData;

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
        };

        const arrayWeather = Object.entries(formatWeatherData);
        const formattedWeather: weatherDataType[] = [];

        arrayWeather.forEach(([key, value], index) => {
            const unit = weatherUnits[key] ?? "";
            formattedWeather.push({
                id: index,
                componentName: key,
                componentData:
                    value !== undefined && value !== null
                        ? `${value} ${unit}`.trim()
                        : (value ?? ""),
            });
        });

        setHeadInfo({
            location: name,
            time: timeConvert(dt, {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        });

        return formattedWeather;
    };

    // update function for existed data
    const formatWeatherData = (weatherData: any) => {
        const arrayWeather = Object.entries({ ...weatherData.main });
        let formattedWeather: {
            id: number;
            componentName: string;
            componentData: number | string | Record<string, any>;
        }[] = [];

        arrayWeather.forEach(([key, value], index) => {
            const unit = weatherUnits[key] ?? "";
            formattedWeather.push({
                id: index,
                componentName: key,
                componentData:
                    value !== undefined && value !== null
                        ? `${value} ${unit}`.trim()
                        : (value ?? ""),
            });
        });

        // setting head info
        setHeadInfo({
            location: weatherData.name,
            time: timeConvert(weatherData.dt, {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        });

        return formattedWeather;
    };

    // Updating component in the initial load
    // if there is data in localStorage, it will renew the data
    // if there isn't, it will create default data
    useEffect(() => {
        const stored = localStorage.getItem("userComponentData");

        const cacheTime = localStorage.getItem("weather_data_time");

        const now = Date.now();
        // time for page to pull new from api
        const THRESHOLD = 60 * 60 * 1000; // 1 hour

        if (stored && JSON.parse(stored).length > 0) {
            try {
                // if it is still in the time frame
                // the data stays the same
                if (cacheTime && now - Number(cacheTime) < THRESHOLD) {
                    setUserComponent(JSON.parse(stored));
                }

                // if it has been 60 minutes
                else {
                    const parsedComponentData = JSON.parse(stored);
                    getLocation().then((location: latLongType) =>
                        getWeather(location).then((data) => {
                            const weatherData = formatWeatherData(data);
                            // updating user weather data
                            // returning weather list
                            const newData = parsedComponentData.map(
                                (e: weatherDataType) => {
                                    const weatherEntry = weatherData[e.id];
                                    const componentData = weatherEntry
                                        ? weatherEntry.componentData
                                        : undefined;

                                    return {
                                        ...e,
                                        componentData,
                                    };
                                },
                            );
                            setUserComponent(newData);
                        }),
                    );
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            getLocation().then((location: latLongType) =>
                getWeather(location).then((data) => {
                    const formattedData = formatNewWeatherData(data);
                    setUserComponent(formattedData);
                }),
            );
        }
    }, []);

    // Updating the localStorage every time component
    useEffect(() => {
        if (userComponent && userComponent.length > 0) {
            localStorage.setItem(
                "userComponentData",
                JSON.stringify(userComponent),
            );
        }
    }, [userComponent]);

    return (
        <userComponentContext.Provider
            value={{
                userComponent: userComponent,
                setUserComponent: setUserComponent,
            }}
        >
            <IconContext.Provider value={{ size: "2rem" }}>
                <FunctionBar
                    location={headInfo.location}
                    time={headInfo.time}
                />

                {prop.children}
            </IconContext.Provider>
        </userComponentContext.Provider>
    );
};

export const App = () => {
    return (
        <>
            <Layout>
                {/* <AddGridComponentButton /> */}
                <GridComponent />
            </Layout>
        </>
    );
};
export { userComponentContext };
export type { weatherDataType, UserComponentContextType, ComponentState };
