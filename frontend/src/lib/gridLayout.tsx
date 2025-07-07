import { useState, createContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent.tsx";
import { getWeather, getLocation } from "./weatherAPI.tsx";
import { IconContext } from "react-icons";
import { FunctionBar } from "../components/functionBar.tsx";
<<<<<<< Updated upstream:src/libs/gridLayout.tsx
=======
import type {prop, ComponentState, weatherDataType, UserComponentContextType, latLongType} from "./types.tsx"
>>>>>>> Stashed changes:frontend/src/lib/gridLayout.tsx
const APP_VERSION = import.meta.env.VITE_APP_VERSION;



// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(
    null,
);

// converting epoch time to time
const timeConvert = (dt: number, format: Intl.DateTimeFormatOptions): string => {
    const time = new Date(0);
    time.setUTCSeconds(dt);
    return time.toLocaleString("en-US", format);
};
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

    const formatNewWeatherData = (
        weatherData: any,
    ): weatherDataType[] => {
        // prettier-ignore
        const { main, wind, clouds, sys, visibility, rain, snow, weather, name, dt } = weatherData;

        const info: Record<string, number | string | undefined> = {
            // Main Weather Info
            weather_main: weather?.[0]?.main,
            weather_description: weather?.[0]?.description,
            weather_icon: weather?.[0]?.icon,

            // Temperature Info
            temp: main?.temp,
            feels_like: main?.feels_like,
            temp_min: main?.temp_min,
            temp_max: main?.temp_max,

            // Atmospheric Info
            pressure: main?.pressure,
            humidity: main?.humidity,
            sea_level: main?.sea_level,
            grnd_level: main?.grnd_level,

            // Wind & Clouds
            wind_speed: wind?.speed,
            wind_deg: wind?.deg,
            wind_gust: wind?.gust,
            cloudiness: clouds?.all,
            visibility: visibility,

            // Rain/Snow (optional)
            rain_1h: rain?.["1h"] || 0,
            snow_1h: snow?.["1h"] || 0,

            // Sunrise/Sunset
            sunrise: timeConvert(sys?.sunrise, { hour: "2-digit", minute: "2-digit" }),
            sunset: timeConvert(sys?.sunset, { hour: "2-digit", minute: "2-digit" }),
        };

        const arrayWeather = Object.entries(info);
        const formattedWeather: weatherDataType[] = [];

        const colWidth = 2; // each tile spans 2 columns
        const gridCols = 12; // total columns in layout
        const itemsPerRow = gridCols / colWidth;
        const tileHeight = 3; // consistent height per tile

        arrayWeather.forEach(([key, value], index) => {
            const unit = weatherUnits[key] ?? "";
            formattedWeather.push({
                id: index,
                componentName: key,
                componentData: value !== undefined && value !== null
                    ? `${value} ${unit}`.trim()
                    : value ?? "",
                dataGrid: {
                    x: (index % itemsPerRow) * colWidth,
                    y: Math.floor(index / itemsPerRow) * tileHeight,
                    w: 2,
                    h: 3,
                    minW: 2,
                    minH: 3,
                    maxW: 5,
                    maxH: 6,
                },
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

    const formatWeatherData = (weatherData: any) => {
        const arrayWeather = Object.entries({ ...weatherData.main });
        let formattedWeather: {
            id: number;
            componentName: string;
            componentData: number | string | Record<string, any>;
        }[] = [];

        arrayWeather.forEach((key: any, index: any) => {
            const unit = weatherUnits[key[0]] ?? "";
            formattedWeather.push({
                id: index,
                componentName: key[0],
                componentData: key[1] !== undefined && key[1] !== null && unit
                    ? `${key[1]} ${unit}`.trim()
                    : key[1],
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

<<<<<<< Updated upstream:src/libs/gridLayout.tsx
    // setting weather component list
    useEffect(() => {
        if (weatherComponent && weatherComponent.length > 0) {
            localStorage.setItem(
                "weatherComponentData",
                JSON.stringify(weatherComponent),
            );
        }
    }, [weatherComponent]);

    useEffect(() => {
        const weatherComp = localStorage.getItem("weatherComponentData");
        if (weatherComp && JSON.parse(weatherComp).length > 0) {
            setWeatherComponent(JSON.parse(weatherComp));
        } else {
            getLocation().then((location: latLongType) =>
                getWeather(location).then((data) => {
                    const formattedData = formatNewWeatherData(data);
                    setUserComponent(formattedData);
                    setWeatherComponent(formattedData);
                }),
            );
        }
    }, []);
=======
>>>>>>> Stashed changes:frontend/src/lib/gridLayout.tsx
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
                // if it has been 50 minutes
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
export type {
    weatherDataType,
    UserComponentContextType,
    ComponentState,
};
