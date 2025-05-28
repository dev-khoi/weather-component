import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useRef, useState, createContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent";
import { getWeather } from "./weatherAPI";
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

// formatting the api
const formatWeatherData = (weatherData: any) => {
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

// ignore-prettier
// mock data of the weather app
// const mockData: weatherDataType[] = [
//    { id: 1, componentName: "tempera", componentData: 30, dataGrid: {w: 2, h: 3, x: 0, y: 0 } },
//   { id: 2, componentName: "humidity", componentData: 65, dataGrid: { w: 2, h: 3, x: 2, y: 0 } },
//   { id: 3, componentName: "windSpeed", componentData: 15, dataGrid: { w: 2, h: 3, x: 4, y: 0 } },
//   { id: 4, componentName: "precipitation", componentData: 20, dataGrid: { w: 2, h: 3, x: 6, y: 0 } },
//   { id: 5, componentName: "uvIndex", componentData: 7, dataGrid: { w: 2, h: 3, x: 8, y: 0 } },
//   { id: 6, componentName: "visibility", componentData: 10, dataGrid: { w: 2, h: 3, x: 0, y: 3 } },
//   { id: 7, componentName: "cloudCover", componentData: 40, dataGrid: { w: 2, h: 3, x: 2, y: 3 } },
//   { id: 8, componentName: "pressure", componentData: 1015, dataGrid: { w: 2, h: 3, x: 4, y: 3 } },
//   { id: 9, componentName: "sunrise", componentData: 545, dataGrid: { w: 2, h: 3, x: 6, y: 3 } },
//   { id: 10, componentName: "sunset", componentData: 1930, dataGrid: { w: 2, h: 3, x: 8, y: 3 } },
// ];

// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(
    null
);
const Layout = (prop: prop) => {
    // state of component in layout
    const [component, setComponent] = useState<weatherDataType[]>([]);
    const hasRun = useRef(false); // prevents dev-mode double run

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
            getWeather().then((data) => {
                const formattedData = formatWeatherData(data.current);
                setComponent(formattedData);
            });
        }
    }, []);

    // Updating the localStorage every time component changes
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

// add component button (allows you to add new component)
// const AddGridComponentButton = () => {
//     const context = useContext(userComponentContext);
//     if(!context) return (<p>loading...</p>)

//     const { component, setComponent } = context;
//     // Adding item to the array
//     const onAddItem = () => {
//         setComponent([
//             ...(component??[]),
//             {
//                 id: 3,
//                 componentName: "wea",
//                 componentData: 3,
//                 dataGrid:{}
//             },
//         ]);
//     };
//     return (
//         <button className="size-30 bg-amber-500" onClick={onAddItem}>
//             Add Item
//         </button>
//     );
// };

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
