import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useState, createContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent";
import { getWeather, getLocation } from "./weatherAPI";
import { SearchBar } from "./searchBar.tsx";
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
    static?: boolean;
};
// Mock data type
type weatherDataType = {
    id: number;
    componentName: string;
    componentData: number | string;
    dataGrid: ComponentState;
};

type UserComponentContextType = {
    component: weatherDataType[];
    setComponent: Dispatch<SetStateAction<weatherDataType[]>>;
};

export type latLongType = {
    lat: Number;
    long: Number;
};
// formatting the api
const formatWeatherData = (weatherData: any) => {
    console.log(weatherData)
    const arrayWeather = Object.entries(weatherData);
    let formattedWeather: weatherDataType[] = [];

    const y = Math.ceil(Math.random() * 4) + 1;

    arrayWeather.forEach((key: any, index: any) => {
        formattedWeather.push({
            id: index,
            componentName: key[0],
            componentData: key[1],
            dataGrid: {
                x: (index * 2) % 12,
                y: Math.floor(index / 6) * y,
                w: 2,
                h: y,
            },
        });
    });
    return formattedWeather;
};

// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(
    null
);
const Layout = (prop: prop) => {
    // state of component in layout
    const [component, setComponent] = useState<weatherDataType[]>([]);

    // Updating component in the initial load
    // This useEffect will render out the weatherAPI if there
    // isn't anything stored in localStorage
    useEffect(() => {
        const stored = localStorage.getItem("componentData");

        if (stored && JSON.parse(stored).length > 0) {
            try {
                const parsedComponentData = JSON.parse(stored);
                setComponent(parsedComponentData);
            } catch (e) {
                console.error(e);
            }
        } else {
            getLocation().then((location: latLongType) =>
                getWeather(location).then((data) => {
                    const formattedData = formatWeatherData(data);
                    setComponent(formattedData);
                })
            );
        }
    }, []);

    // Updating the localStorage every time component
    useEffect(() => {
        if (component && component.length > 0) {
            console.debug(component[0].dataGrid);

            localStorage.setItem("componentData", JSON.stringify(component));
        }
    }, [component]);

    return (
        <userComponentContext.Provider value={{ component, setComponent }}>
            {prop.children}
        </userComponentContext.Provider>
    );
};

export const App = () => {
    return (
        <>
            <Layout>
                {/* <SearchBar /> */}

                {/* <AddGridComponentButton /> */}
                <GridComponent />
            </Layout>
        </>
    );
};

export { userComponentContext };
export type { weatherDataType, UserComponentContextType, ComponentState };
