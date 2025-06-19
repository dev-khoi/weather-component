import type { ReactNode, Dispatch, SetStateAction, JSX } from "react";
import { useState, createContext, useEffect, useRef } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent.tsx";
import { getWeather, getLocation } from "./weatherAPI.tsx";
import { IconContext } from "react-icons";
import { FunctionBar } from "./functionBar.tsx";

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

const Layout = (prop: prop) => {
    // state of component in layout
    const [userComponent, setUserComponent] = useState<weatherDataType[]>([]);
    const [weatherComponent, setWeatherComponent] = useState<weatherDataType[]>(
        [],
    );
    const loc = useRef<string>("");

    const formatWeatherData = (weatherData: any) => {
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
        loc.current = weatherData.name;
        return [formattedWeather];
    };
    useEffect(() => {
        const stored = localStorage.getItem("weatherComponentData");

        if (stored && JSON.parse(stored).length > 0) {
            try {
                const parsedComponentData = JSON.parse(stored);
                setWeatherComponent(parsedComponentData);
                loc.current = parsedComponentData[1];
            } catch (e) {
                console.error(e);
            }
        } else {
            getLocation().then((location: latLongType) =>
                getWeather(location).then((data) => {
                    const [formattedData] = formatWeatherData(data);
                    setWeatherComponent(formattedData);
                }),
            );
        }
    }, []);
    // Updating the localStorage every time component
    useEffect(() => {
        if (weatherComponent && weatherComponent.length > 0) {
            localStorage.setItem(
                "weatherComponentData",
                JSON.stringify(weatherComponent),
            );
        }
    }, [weatherComponent]);

    // Updating component in the initial load
    // This useEffect will render out the weatherAPI if there
    // isn't anything stored in localStorage
    useEffect(() => {
        const stored = localStorage.getItem("userComponentData");

        if (stored && JSON.parse(stored).length > 0) {
            try {
                const parsedComponentData = JSON.parse(stored);
                setUserComponent(parsedComponentData);
            } catch (e) {
                console.error(e);
            }
        } else {
            getLocation().then((location: latLongType) =>
                getWeather(location).then((data) => {
                    const [formattedData, cityName] = formatWeatherData(data);
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
                    <FunctionBar city={loc.current} />

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
