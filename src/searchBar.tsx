import {
    useContext,
    useRef,
    useState,
    useMemo,
    useEffect,
    type FunctionComponent,
} from "react";
import { userComponentContext, type weatherDataType } from "./gridLayout.tsx";

import { type ComponentState } from "./gridLayout";

const SearchBar = () => {
    const context = useContext(userComponentContext);
    if (!context) return <p>loading...</p>;

    const { component, setComponent } = context;

    // Genereate the name of component
    const originalComponent = component.map((comp) => comp.componentName);

    const [componentList, setComponentList] = useState(originalComponent);
    
    useEffect(() => {
        setComponentList(originalComponent);
    }, [component]);

    const searching = (e: string) => {
        const value = e.trim();

        const re = new RegExp(e, "ig");
        if (value === "") {
            setComponentList(originalComponent);
        } else {
            setComponentList(
                componentList.filter((comp) => comp.match(re))
            );
        }
    };
    return (
        <>
            <input
                placeholder="enter a word"
                type="text"
                defaultValue={""}
                onChange={(e) => searching(e.target.value)}
            ></input>
            <ul>
                {componentList.map((comp, i) => {
                    return <li key={i}>{comp}</li>;
                })}
            </ul>
        </>
    );
};

export { SearchBar };
