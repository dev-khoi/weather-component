import type {
    ReactNode,
    Dispatch,
    SetStateAction,
} from "react";
import { useState, createContext, useContext } from "react";
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
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    static: boolean;
};

type UserComponentContextType = {
    component: ComponentState[];
    setComponent: Dispatch<SetStateAction<ComponentState[]>>;
} | null;

// create context of what components
const userComponentContext = createContext<UserComponentContextType>(null);
const Layout = (prop: prop) => {
    // state of component in layout
    const [component, setComponent] = useState([
        {
            i: "b",
            x: 1,
            y: 1,
            w: 1,
            h: 2,
            static: false,
        },
    ]);
    return (
        <userComponentContext.Provider value={{ component, setComponent }}>
            {prop.children}
        </userComponentContext.Provider>
    );
};

// add component button (allows you to add new component)
const AddGridComponentButton = () => {
    const context = useContext(userComponentContext);
    if (!context) return null;

    const { component, setComponent } = context;

    // Adding item to the array
    const onAddItem = () => {
        setComponent([
            ...component,
            {
                i: "c",
                x: 3,
                y: Infinity,
                w: 1,
                h: 2,
                static: false,
            },
        ]);
    };
    return (
        <button className="size-30 bg-amber-500" onClick={onAddItem}>
            Add Item
        </button>
    );
};



export const App = () => {
    return (
        <Layout>
            <AddGridComponentButton />
            <GridComponent />
        </Layout>
    );
};

export {userComponentContext}