import { useContext, useRef, useState, useCallback, useEffect } from "react";
import {
    userComponentContext,
    weatherComponentContext,
    type weatherDataType,
} from "./gridLayout.tsx";
import { type latLongType } from "./gridLayout";

import { getWeather, getLocation } from "./weatherAPI.tsx";
import { CiCircleRemove } from "react-icons/ci";
import { IconContext } from "react-icons";

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
    // getting user components
    const userContext = useContext(userComponentContext);
    if (!userContext) return <p>loading...</p>;

    const { userComponent, setUserComponent } = userContext;

    // getting the api components
    const weatherContext = useContext(weatherComponentContext);
    if (!weatherContext) return <p>loading...</p>;

    const { weatherComponent, setWeatherComponent } = weatherContext;

    // list of components that haven't been added
    const [componentList, setComponentList] = useState<weatherDataType[]>([]);

    // dialog visibility
    const [visible, setVisible] = useState<Boolean>(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null)

    const assignComponentList = async () => {
        // filtering which hasn't been added to userComponent
        // assigning them into the component list
        const formattedData = weatherComponent.filter(
            (comp) =>
                !userComponent.some(
                    (originalComp) => comp.id === originalComp.id
                )
        );
        setComponentList(formattedData);
    };
    // List of weather components contains real data

    useEffect(() => {
        assignComponentList();
    }, []);

    // dialog toggle
    useEffect(() => {
        if (visible) {
            dialogRef.current?.showModal();
            inputRef.current?.focus();
        } else {
            dialogRef.current?.close();
            assignComponentList();
        }
    }, [visible]);

    // *
    // Turning dialog on or off
    const toggleDialog = () => {
        setVisible(!visible);
    };
    // shortcut to open dialog
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault(); // prevent default browser behavior like focus search bar
                toggleDialog();
            }
        },
        [toggleDialog]
    );

    useEffect(() => {
        // attach the event listener
        document.addEventListener("keydown", handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    // searching and adding componenent
    const searching = (e: string) => {
        const value = e.trim();

        const re = new RegExp(e, "ig");
        if (value === "" || value === null || value === undefined) {
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
            setComponentList([...componentList, componentAdding]);
        } else {
            setComponentList(componentList);
            console.debug("component not found");
        }

        assignComponentList();
    };

    return (
        <>
            <button
                className="inline-flex items-center align-middle gap-2 border-2 rounded-lg py-1 px-3"
                onClick={toggleDialog}
            >
                Add component
                <div className="hidden gap-1 sm:flex">
                    <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3">
                        Ctrl
                    </kbd>
                    <kbd className="bg-background text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3 aspect-square">
                        K
                    </kbd>
                </div>
            </button>

            {/* dialog to add component */}
            {visible && (
                <dialog
                title="Search dialog"
                    ref={dialogRef}
                    onClose={toggleDialog}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               w-96 max-h-[80vh] overflow-y-auto p-6 
               rounded-xl shadow-xl border border-gray-300 
               bg-white dark:bg-gray-800 dark:text-white z-50
               backdrop:backdrop-blur-[2px]
"
                >
                    <h2 className="text-xl font-semibold mb-4">
                        Add Component
                    </h2>
                    <button
                        onClick={toggleDialog}
                        className="absolute right-2 top-2 "
                    >
                        <IconContext
                            value={{ className: "text-red-400", size: "33px" }}
                        >
                            <CiCircleRemove />
                        </IconContext>
                    </button>
                    <input
                        ref={inputRef}
                        placeholder="Find a component"
                        type="text"
                        defaultValue=""
                        onChange={(e) => searching(e.target.value)}
                        className="w-full px-3 py-2 mb-4 border rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   dark:bg-gray-700"
                    />
                    <ul className="space-y-2">
                        {componentList.map((comp) => (
                            <li key={comp.id}>
                                <button
                                    onClick={() => addComponent(comp.id)}
                                    className="w-full text-left px-3 py-2 bg-gray-100 rounded-md 
                               hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                                >
                                    {comp.componentName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </dialog>
            )}
        </>
    );
};

export { SearchBar };
