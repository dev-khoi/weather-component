import {
    useContext,
    useRef,
    useEffect,
    useState,
    type FunctionComponent,
} from "react";
import { userComponentContext, type weatherDataType } from "./gridLayout";
import {
    Responsive,
    WidthProvider,
    type Layout,
    type Layouts,
} from "react-grid-layout";

import { weatherIcon } from "./weatherAPI.tsx";
import { LoadingAnimation } from "@/components/loading.tsx";
import axios from "axios";
// * MOCK DATA

// props interface
// *
// // removing button
// const removeComponent = (id: number) => {
//     const updatedComponents = component.filter((comp) => id !== comp.id);
//     setComponent(updatedComponents);
// };
{
    /* <button
                            onClick={() => removeComponent(comp.id)}
                            type="button"
                            className="cancelSelector absolute top-1 right-2 w-6 h-6 flex items-center justify-center rounded-full text-gray-600 hover:text-amber-600 focus:text-amber-600 hover:bg-amber-100 focus:outline-none focus:ring-2 focus:ring-amber-400"
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
                        </button> */
}

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Rendering the grid component inside the grid layout
const GridComponent: FunctionComponent = () => {
    // _______________________________
    // Grid layout configuration
    const userComponentContextValue = useContext(userComponentContext);
    const userComponent = userComponentContextValue?.userComponent;
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

    const ignoreLayoutChange = useRef(false);
    const [compactType] = useState<
        "vertical" | "horizontal" | null | undefined
    >("vertical");

    const [layouts, setLayouts] = useState<Layouts | undefined>();
    const lastSavedLayout = useRef<Layout[]>([]);
    if (layouts && layouts[currentBreakpoint]) {
        lastSavedLayout.current = layouts[currentBreakpoint];
    }

    const isFirstRender = useRef<boolean>(true);

    useEffect(() => {
        axios
            .get("http://localhost:3000/layout", {
                withCredentials: true,
            })
            .then((e) => {
                setLayouts(e.data);
            });
    }, []);

    // saving layout to the database
    const saveLayout = async () => {
        console.log("save to db");
        try {
            axios.put(
                "http://localhost:3000/savingLayout",
                { layouts },
                { withCredentials: true },
            );
        } catch (e) {
            console.error(e);
        }
    };

    if (
        !userComponent ||
        userComponent.length === 0 ||
        currentBreakpoint === ""
    ) {
        return <LoadingAnimation />;
    }

    // callback when layout is change
    // callback after new breakpoint (not firstload)
    const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        if (!isFirstRender.current) {
            lastSavedLayout.current = layout;

            if (
                !ignoreLayoutChange.current &&
                !(
                    !layouts ||
                    (layouts[currentBreakpoint].length === 0 &&
                        currentBreakpoint)
                )
            ) {
                setLayouts({
                    ...allLayouts,
                    [currentBreakpoint]: layout,
                });
                console.log("layout change on layout change");
                if (!changingBreakpoint.current) {
                    saveLayout();
                }
            }
            ignoreLayoutChange.current = false;
            changingBreakpoint.current = false;
        }
    };

    const onBreakpointChange = (newBreakpoint: string) => {
        console.log(window.innerWidth);

        if (lastSavedLayout.current) {
            ignoreLayoutChange.current = true;
            setLayouts((prevLayout) => {
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
            if (layouts && layouts[currentBreakpoint]) {
                lastSavedLayout.current = layouts[currentBreakpoint];
            }
        }

        setCurrentBreakpoint(newBreakpoint);
        changingBreakpoint.current = true;
        isFirstRender.current = false;

        console.log("setting new breakpoint");
    };

    // Generating the components:
    const generateDOM = () => {
        if (!layouts || !layouts[currentBreakpoint]) {
            return;
        }
        return layouts[currentBreakpoint].map((layout) => {
            const comp = userComponent.find(
                (comp) => comp.id.toString() === layout.i,
            );
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
                        <div>
                            <div className="text-4xl font-semibold text-amber-200">
                                {comp && (
                                    <span className="weather-value">
                                        {comp.componentData}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    return (
        <>
            <div className="grid-layout">
                {
                    <ResponsiveReactGridLayout
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
                        //--
                        isBounded={false}
                        layouts={layouts}
                        measureBeforeMount={false}
                        useCSSTransforms
                        compactType={compactType}
                        preventCollision={!compactType}
                        onLayoutChange={onLayoutChange}
                        onBreakpointChange={onBreakpointChange}
                        isDroppable
                        draggableCancel=".cancelSelector"
                    >
                        {generateDOM() ?? <LoadingAnimation />}
                    </ResponsiveReactGridLayout>
                }
            </div>
        </>
    );
};

export { GridComponent };
