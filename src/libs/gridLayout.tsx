import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useState, createContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent.tsx";
import { getWeather, getLocation } from "./weatherAPI.tsx";
import { IconContext } from "react-icons";
import { FunctionBar } from "./functionBar.tsx";
const APP_VERSION = import.meta.env.VITE_APP_VERSION;

// TYPE:
// prop type
interface prop {
    children: ReactNode;
}
// component type
type ComponentState = {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
};
// Mock data type
type weatherDataType = {
    id: number;
    componentName: string;
    componentData: number | string | Record<string, any>;
    dataGrid: ComponentState;
};

type UserComponentContextType = {
    userComponent: weatherDataType[];
    setUserComponent: Dispatch<SetStateAction<weatherDataType[]>>;
};

type WeatherComponentContextType = {
    weatherComponent: weatherDataType[];
    setWeatherComponent: Dispatch<SetStateAction<weatherDataType[]>>;
};
export type latLongType = {
    lat: Number;
    long: Number;
};
// formatting the api

// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(
    null,
);
const weatherComponentContext =
    createContext<WeatherComponentContextType | null>(null);

// converting epoch time to time
const timeConvert = (dt: number) => {
    const time = new Date(0);

    time.setUTCSeconds(dt);

    return time;
};
const Layout = (prop: prop) => {
    const storedVersion = localStorage.getItem("app_version");

    // Reseting localStorage if it's not new version
    useEffect(() => {
        if (storedVersion != APP_VERSION.toString()) {
            localStorage.clear();
            localStorage.setItem("app_version", APP_VERSION);
        }
    }, []);

    // state of component in layout
    const [userComponent, setUserComponent] = useState<weatherDataType[]>([]);
    const [weatherComponent, setWeatherComponent] = useState<weatherDataType[]>(
        [],
    );

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

    const formatNewWeatherData = (weatherData: any) => {
        const arrayWeather = Object.entries({ ...weatherData.main });
        let formattedWeather: weatherDataType[] = [];

        const colWidth = 2; // each tile spans 2 columns
        const gridCols = 12; // total columns in layout
        const itemsPerRow = gridCols / colWidth;
        const tileHeight = 3; // consistent height per tile

        arrayWeather.forEach((key: any, index: any) => {
            const x = (index % itemsPerRow) * colWidth;
            const y = Math.floor(index / itemsPerRow) * tileHeight;
            formattedWeather.push({
                id: index,
                componentName: key[0],
                componentData: key[1],
                dataGrid: {
                    x,
                    y,
                    w: 2,
                    h: 3,
                    minW: 2,
                    minH: 3,
                    maxW: 5,
                    maxH: 6,
                },
            });
        });
        console.log(weatherData.name);
        // setting head info

        setHeadInfo({
            location: weatherData.name,
            time: timeConvert(weatherData.dt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        });

        return [formattedWeather];
    };
    const formatWeatherData = (weatherData: any) => {
        const arrayWeather = Object.entries({ ...weatherData.main });
        let formattedWeather: {
            id: number;
            componentName: string;
            componentData: number | string | Record<string, any>;
        }[] = [];

        arrayWeather.forEach((key: any, index: any) => {
            formattedWeather.push({
                id: index,
                componentName: key[0],
                componentData: key[1],
            });
        });

        // setting head info
        setHeadInfo({
            location: weatherData.name,
            time: timeConvert(weatherData.dt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            }),
        });

        return arrayWeather;
    };

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
                    const [formattedData] = formatNewWeatherData(data);
                    setUserComponent(formattedData);
                    setWeatherComponent(formattedData);
                }),
            );
        }
    }, []);
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
                            console.log("fresh");
                            const weatherData = formatWeatherData(data);
                            // updating user weather data
                            // returning weather list
                            const newData = parsedComponentData.map(
                                (e: weatherDataType) => {
                                    const weatherEntry = weatherData[e.id];
                                    const componentData = weatherEntry
                                        ? weatherEntry[1]
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
                    const [formattedData] = formatNewWeatherData(data);
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
        <weatherComponentContext.Provider
            value={{
                weatherComponent: weatherComponent,
                setWeatherComponent: setWeatherComponent,
            }}
        >
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
        </weatherComponentContext.Provider>
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
export { userComponentContext, weatherComponentContext };
export type {
    weatherDataType,
    UserComponentContextType,
    WeatherComponentContextType,
    ComponentState,
};
