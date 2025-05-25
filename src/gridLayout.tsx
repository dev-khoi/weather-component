import type { ReactNode, Dispatch, SetStateAction } from "react";
import { useState, createContext, useContext, useEffect } from "react";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { GridComponent } from "./gridComponent";

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
    componentData: number;
    dataGrid: ComponentState;
}

type UserComponentContextType = {
    component: weatherDataType[] ;
    setComponent: Dispatch<SetStateAction<weatherDataType[]>>;
} ;

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
// localStorage.setItem("componentData", JSON.stringify(mockData));

// create context of what components
const userComponentContext = createContext<UserComponentContextType | null>(null
);
const Layout = (prop: prop) => {
    const stored = localStorage.getItem("componentData");
    const parsedComponentData = stored?JSON.parse(stored):null;

    // state of component in layout
    const [component, setComponent] = useState<weatherDataType[]>(parsedComponentData);

    // storing the data
    useEffect(()=>{
        localStorage.setItem("componentData", JSON.stringify(component));

    },[component])
 
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
export type {weatherDataType, UserComponentContextType, ComponentState}