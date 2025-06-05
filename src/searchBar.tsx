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

import { getWeather } from "./weatherAPI.tsx";

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

const SearchBar = () => {
    const context = useContext(userComponentContext);
    if (!context) return <p>loading...</p>;

    const { component, setComponent } = context;

    // Genereate the name of component

    // list of components that haven't been added
    const [componentList, setComponentList] = useState<weatherDataType[]>([]);

    const assignComponentList = async () => {
        getWeather().then((data) => {
            const formattedData = formatWeatherData(data.current).filter(
                (comp) =>
                    !component.some(
                        (originalComp) => comp.id === originalComp.id
                    )
            );
            setComponentList(formattedData);
        });
        // List of weather components contains real data
    };

    useEffect(() => {
        assignComponentList();
    }, [component]);

    const searching = (e: string) => {
        const value = e.trim();

        const re = new RegExp(e, "ig");
        if (value === "" || value === null) {
            assignComponentList();
        } else {
            setComponentList(
                componentList.filter((comp) => comp.componentName.match(re))
            );
        }
    };
    // add component button (allows you to add new component)
    const addComponent = (id: number) => {
        // setComponent([
        //     ...(component ?? []),
        //     {
        //         id: 3,
        //         componentName: "wea",
        //         componentData: 3,
        //         dataGrid: { w: 2, h: 3, x: 0,     y: 0 },
        //     },
        // ]);
        // removing from search list
        const componentAdding: weatherDataType | undefined = componentList.find(
            (comp) => comp.id === id
        );
    
        if (componentAdding) {
            setComponent([ ...component, componentAdding ]);
        }else{
            setComponent(component)
            console.debug("component not found")
        }   

        assignComponentList();
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
                {componentList.map((comp) => {
                    return (
                        <li key={comp.id}>
                            <button onClick={() => addComponent(comp.id)}>
                                {comp.componentName}
                            </button>
                        </li>
                    );
                })}
            </ul>
        </>
    );
};

export { SearchBar };
