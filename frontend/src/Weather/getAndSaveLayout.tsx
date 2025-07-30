import {
    useContext,
    useRef,
    useEffect,
    useState,
    type FunctionComponent,
} from "react";
import {
    weatherDataContext,
    type weatherDataType,
} from "./getAndStoreWeather.tsx";
import {
    Responsive,
    WidthProvider,
    type Layout,
    type Layouts,
} from "react-grid-layout";

import { weatherIcon } from "../helpers/weatherAPI.tsx";
import { LoadingAnimation } from "@/components/ui/loading.tsx";
import axios from "axios";

import { HeadInfo } from "@/components/ui/info.tsx";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { createLayout, getListMissingId } from "@/helpers/helper.ts";
import {
    updateLayoutDb,
    deleteComponentDb,
    addComponentDb,
} from "@/helpers/layoutDb.ts";
import { SearchBar } from "./searchBar.tsx";
import { isMobile } from "react-device-detect";

import type { ComponentListType } from "@/types/types";
import { GetLocationButton } from "@/components/ui/GetLocationButton.tsx";
import { UnitToggleSwitch } from "@/components/ui/UnitToggleButton.tsx";
import { SkeletonGrid } from "@/components/ui/PageSkeletonLoading.tsx";
import { AiChat } from "@/components/ui/WeatherAiAssistant.tsx";

const host = import.meta.env.VITE_BACKEND_HOST;
// const removeComponent = (id: number) => {
//     const updatedComponents = component.filter((comp) => id !== comp.id);
//     setComponent(updatedComponents);

// };

//~ logic:
// a user has multiple breakpoint xxs -> lg
// a change of layout in one breakpoint -> update that breakpoint layout

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Rendering the grid component inside the grid layout
const GridComponent: FunctionComponent = () => {
    // weather data
    const weatherDataContextValue = useContext(weatherDataContext);

    const { weatherData, headInfo, assignWeatherData } =
        weatherDataContextValue || {
            weatherData: [],
            headInfo: { location: "loading", time: "loading" },
            assignWeatherData: () => {},
        };
    const [permissionState, setPermissionState] = useState<
        "granted" | "prompt" | "denied" | null
    >(null);
    useEffect(() => {
        navigator.permissions.query({ name: "geolocation" }).then((result) => {
            setPermissionState(result.state);

            // Optional: Listen for changes (e.g. if user changes permission mid-session)
            result.onchange = () => {
                setPermissionState(result.state);
                assignWeatherData();
            };
        });
    }, [permissionState]);

    //~
    // Grid layout configuration
    const getBreakpointFromWidth = (width: number): string => {
        if (width >= 1150) return "lg";
        if (width >= 996) return "md";
        if (width >= 768) return "sm";
        if (width >= 480) return "xs";
        return "xxs";
    };
    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>(
        getBreakpointFromWidth(window.innerWidth),
    );
    const changingBreakpoint = useRef(false);

    const [compactType] = useState<
        "vertical" | "horizontal" | null | undefined
    >("vertical");

    const ignoreLayoutChange = useRef(false);
    const [allLayouts, setAllLayouts] = useState<Layouts>({
        lg: [],
        md: [],
        sm: [],
        xs: [],
        xxs: [],
    });
    const [editMode, setEditMode] = useState<boolean>(false);

    const scrollRef = useRef<NodeJS.Timeout | null>(null);
    const [scroll, setScroll] = useState<"up" | "down" | null>(null);

    const lastSavedLayout = useRef<Layout[]>([]);
    if (allLayouts && allLayouts[currentBreakpoint]) {
        lastSavedLayout.current = allLayouts[currentBreakpoint];
    }

    // search list
    const isFirstRender = useRef<boolean>(true);

    const searchList = getListMissingId(
        weatherData,
        allLayouts?.[currentBreakpoint] ?? [],
    );

    // Fetching all breakpoint layouts
    useEffect(() => {
        axios
            .get(`${host}/componentInLayouts`, {
                withCredentials: true,
            })
            .then((e: any) => {
                console.log(e.data);
                setAllLayouts(e.data);
            });
    }, []);
    if (permissionState === "denied") {
        return <GetLocationButton />;
    }
    if (
        !weatherData ||
        weatherData.length === 0 ||
        !allLayouts ||
        !allLayouts[currentBreakpoint]
    ) {
        return <SkeletonGrid />;
    }
    // callback when layout is change
    // callback after new breakpoint (not firstload)
    const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        console.log("layout");
        if (!isFirstRender.current || currentBreakpoint === "lg") {
            lastSavedLayout.current = layout;
            if (
                !ignoreLayoutChange.current &&
                !(
                    !allLayouts ||
                    (allLayouts[currentBreakpoint].length === 0 &&
                        currentBreakpoint)
                )
            ) {
                setAllLayouts({
                    ...allLayouts,
                    [currentBreakpoint]: layout,
                });
                ignoreLayoutChange.current = false;
            }
        }
    };

    const onBreakpointChange = (newBreakpoint: string) => {
        changingBreakpoint.current = true;

        if (lastSavedLayout.current) {
            ignoreLayoutChange.current = true;
            setAllLayouts((prevLayout) => {
                return {
                    ...prevLayout,
                    [currentBreakpoint]: lastSavedLayout.current,
                };
            });
            console.log(
                "change layouts on break point",
                currentBreakpoint,
                newBreakpoint,
            );
            if (allLayouts && allLayouts[currentBreakpoint]) {
                lastSavedLayout.current = allLayouts[currentBreakpoint];
            }
        }

        setCurrentBreakpoint(newBreakpoint);
        isFirstRender.current = false;
        changingBreakpoint.current = false;

        console.log("setting new breakpoint");
    };

    const removeComponent = (id: string) => {
        if (allLayouts[currentBreakpoint].length <= 1) {
            return;
        }
        const layoutsId = allLayouts[currentBreakpoint].map((e) => e.i);

        if (layoutsId.includes(id)) {
            deleteComponentDb(id, currentBreakpoint);

            const newAllLayouts = {
                ...allLayouts,
                [currentBreakpoint]: allLayouts[currentBreakpoint].filter(
                    (layout) => {
                        console.log("finding the component to remove");
                        return layout.i !== id;
                    },
                ),
            };
            console.log(newAllLayouts);
            setAllLayouts(newAllLayouts);
        }
    };
    // add component button (allows you to add new component)
    const addComponent = async (id: string) => {
        const componentToAdd: ComponentListType | undefined = searchList.find(
            (comp) => comp.id === id,
        );

        if (componentToAdd) {
            const newComp = createLayout(componentToAdd.id);
            setAllLayouts({
                ...allLayouts,
                [currentBreakpoint]: [
                    ...allLayouts[currentBreakpoint],
                    newComp,
                ],
            });

            try {
                await addComponentDb(newComp, currentBreakpoint);
                await updateLayoutDb(allLayouts);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.log("component not found");
        }
    };

    const RemoveButton = ({ comp }: { comp: weatherDataType }) => {
        const description = comp.componentName;

        return (
            <button
                onClick={() => removeComponent(comp.id)}
                type="button"
                className="cancelSelector absolute top-1 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-400 dark:text-gray-600 hover:text-amber-600 focus:text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
                aria-label={description || "Remove component"}
                title="Remove component"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </button>
        );
    };
    // Generating the layouts and the components:
    const renderComponents = () => {
        if (!allLayouts || !allLayouts[currentBreakpoint]) {
            return;
        }
        // returning the layout and weather datain the current breakpoint
        return allLayouts[currentBreakpoint].map((layout) => {
            const comp = weatherData.find((comp) => comp.id === layout.i);
            if (!comp) {
                return;
            }
            return (
                <div
                    className="grid-layout-item-content"
                    key={layout.i}
                    data-grid={layout}
                >
                    {/* remove button */}
                    {editMode ? <RemoveButton comp={comp} /> : ""}
                    {/* ICON / DATA / name */}
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <div className="flex items-start justify-center mb-2 ml-1">
                            <div className="text-5xl mr-3"></div>
                            {weatherIcon[comp.componentName]}
                            <div className="text-sm tracking-wide">
                                {comp.componentName}
                            </div>
                        </div>

                        {/* Data */}

                        <div className="text-4xl font-semibold text-amber-200">
                            {comp && (
                                <span className="weather-value">
                                    {comp.componentData}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            );
        });
    };
    const handleDragAndScroll = (to?: "up" | "down") => {
        setScroll((scroll) => {
            const scrollRoot =
                document.scrollingElement || document.documentElement;

            if (scroll === "up" || to === "up") {
                scrollRoot.scrollBy({ top: -5 });
            }
            if (scroll === "down" || to === "down") {
                scrollRoot.scrollBy({ top: 5 });
            }

            if (
                scrollRoot &&
                ((scrollRoot.scrollTop > 0 && scroll === "up") ||
                    (scrollRoot.scrollHeight -
                        window.innerHeight -
                        scrollRoot.scrollTop >
                        0 &&
                        scroll === "down"))
            ) {
                setTimeout(() => handleDragAndScroll(), 1);
            }

            return scroll;
        });
    };
    const handleDrag = (
        layout: Layout[],
        oldItem: Layout,
        newItem: Layout,
        placeholder: Layout,
        event: MouseEvent | TouchEvent,
        element: HTMLElement,
    ) => {
        if (layout || oldItem || newItem || placeholder || event) {
        }
        const { top } = element.getBoundingClientRect();

        if (isMobile) {
            if (window.innerHeight - top - element.clientHeight < 100) {
                if (scroll !== "down") {
                    setScroll("down");
                    setTimeout(() => handleDragAndScroll("down"), 200);
                }
            }

            if (top - element.clientHeight < 0) {
                if (scroll !== "up") {
                    setScroll("up");
                    setTimeout(() => handleDragAndScroll("up"), 200);
                }
            }
        }
    };
    const onDragStop = () => {
        setScroll(null);
        if (scrollRef.current) {
            clearTimeout(scrollRef.current);
            scrollRef.current = null;
        }
    };
    return (
        <div className="overflow-visible">
            <div className="sticky flex-col sm:flex-row items-center justify-center  px-2  md:px-8 lg:flex lg:flex-row-reverse lg:justify-between top-0 z-1 backdrop-blur-[2px] lg:px-32 py-2 rounded-xl rounded-t-none">
                <div className="relative flex justify-center items-start mt-2">
                    <HeadInfo
                        location={headInfo.location}
                        time={headInfo.time}
                    />
                </div>
                {/* tool bar and time */}
                <div className="z-10 bg-gray-800 dark:bg-gray-750  text-accent-foreground justify-self-center flex justify-center items-center space-x-4 px-6 py-3 mt-4 mb-4 w-fit  border rounded-xl">
                    <div className=" bg-(--background-color) inline-flex items-center align-middle gap-2 border-2 border-card dark:border-border  rounded-lg py-1 px-3">
                        <Switch
                            id="edit-mode"
                            checked={editMode}
                            onCheckedChange={() => {
                                setEditMode(!editMode);
                                if (!changingBreakpoint.current && editMode) {
                                    updateLayoutDb(allLayouts);
                                }
                            }}
                            className="mr-1"
                            aria-readonly
                        />

                        <Label
                            htmlFor="edit-mode"
                            className="w-fit text-lg md:text-2xl mr-4 md:text-md"
                        >
                            Edit
                        </Label>
                    </div>

                    <SearchBar
                        originComponentList={searchList}
                        currentBreakpoint={currentBreakpoint}
                        addComponent={addComponent}
                    />
                    <UnitToggleSwitch />
                </div>
            </div>

            {/* Ai for chat */}
            <AiChat weatherData={JSON.stringify(weatherData)} />
            {/* grid layout */}
            <div>
                <ResponsiveReactGridLayout
                    className="grid-layout px-2 "
                    rowHeight={30}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    breakpoints={{
                        lg: 1150,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    containerPadding={[0, 0]}
                    layouts={allLayouts}
                    measureBeforeMount={false}
                    useCSSTransforms
                    compactType={compactType}
                    preventCollision={!compactType}
                    onLayoutChange={onLayoutChange}
                    onBreakpointChange={onBreakpointChange}
                    isDroppable
                    isBounded
                    draggableCancel=".cancelSelector"
                    isDraggable={editMode}
                    isResizable={editMode}
                    onDrag={handleDrag}
                    onDragStop={onDragStop}
                >
                    {renderComponents() ?? <LoadingAnimation />}
                </ResponsiveReactGridLayout>
            </div>
        </div>
    );
};

export { GridComponent };
