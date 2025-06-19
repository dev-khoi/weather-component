import { useContext, useEffect, useState, type FunctionComponent } from "react";
import { userComponentContext, type weatherDataType } from "./gridLayout";
import {
    Responsive,
    WidthProvider,
    type Layout,
    type Layouts,
} from "react-grid-layout";

import { weatherIcon } from "./weatherAPI.tsx";

// props interface

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Rendering the grid component inside the grid layout
const GridComponent: FunctionComponent = () => {
    // _______________________________
    // Grid layout configuration

    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
    const [compactType] = useState<
        "vertical" | "horizontal" | null | undefined
    >("vertical");
    const [mounted, setMounted] = useState(false);
    const [toolbox, setToolbox] = useState<{ [index: string]: any[] }>({
        lg: [],
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // useContext to get the components array
    const context = useContext(userComponentContext);
    if (!context) return <p>loading...</p>;

    const { userComponent: component, setUserComponent: setComponent } =
        context;

    // * LAYOUTS
    const [layouts, setLayouts] = useState<Layouts>();
    const createBaseLayout = () =>
        component.map((item) => ({
            ...item.dataGrid,
            i: item.id.toString(),
            minW: 2,
            maxW: 5,
            minH: 3,
            maxH: 6,
            static: false,
        }));

    const defaultLayouts: Layouts = {
        lg: createBaseLayout(),
        md: createBaseLayout(),
        sm: createBaseLayout(),
        xs: createBaseLayout(),
        xxs: createBaseLayout(),
    };
    // loading layouts before
    useEffect(() => {
        const saved = loadLayouts();

        if (saved) {
            setLayouts(saved);
        } else {
            return setLayouts(defaultLayouts);
        }
    }, []);

    // if component is changed, the layout changes with the component
    // useEffect(() => {
    //     if (hasLoadedLayout) {
    //         setLayouts(toLayouts(component));
    //     }
    // }, [component]);

    // before user leave the page, the layout is saved into local storage
    useEffect(() => {
        window.addEventListener("beforeunload", () => saveLayouts(layouts));
        return () =>
            window.removeEventListener("beforeunload", () =>
                saveLayouts(layouts),
            );
    }, [layouts]);

    // default layout

    const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        // Setting the
        // Update ALL component dataGrids to match the layout
        const updatedComponents = component.map((comp) => {
            const layoutItem = layout.find(
                (item) => item.i === comp.id.toString(),
            );
            if (!layoutItem) return comp;

            return {
                ...comp,
                dataGrid: {
                    ...comp.dataGrid,
                    x: layoutItem.x,
                    y: layoutItem.y,
                    w: layoutItem.w,
                    h: layoutItem.h,
                },
            };
        });
        setComponent(updatedComponents);
        // Update full layouts state with all breakpoints
        setLayouts(allLayouts);

        // Save updated layouts to localStorage
        saveLayouts(allLayouts);
        // saveLayouts();
        // console.log(component[0].dataGrid)
    };

    // convert component into layout type
    // function toLayouts(components: weatherDataType[]): Layouts {
    //     const baseLayout = components.map((item) => ({
    //         ...item.dataGrid,
    //         i: item.id.toString(),
    //         minW: 2,
    //         maxW: 5,
    //         minH: 3,
    //         maxH: 6,
    //         static: false,
    //     }));

    //     return {
    //         lg: baseLayout,
    //         md: baseLayout,
    //         sm: baseLayout,
    //         xs: baseLayout,
    //         xxs: baseLayout,
    //     };
    // }

    // load layouts from storage
    const loadLayouts = () => {
        try {
            const savedLayouts = localStorage.getItem("layouts");
            return savedLayouts ? JSON.parse(savedLayouts) : defaultLayouts;
        } catch (err) {
            console.error("Failed to load layouts from localStorage", err);
            return defaultLayouts;
        }
    };
    // save layouts to locale storage
    const saveLayouts = (layouts: Layouts | undefined) => {
        try {
            localStorage.setItem("layouts", JSON.stringify(layouts));
        } catch (err) {
            console.error("Failed to save layouts to localStorage", err);
        }
    };

    // *
    // removing button
    const removeComponent = (id: number) => {
        const updatedComponents = component.filter((comp) => id !== comp.id);
        setComponent(updatedComponents);
    };

    // generate data
    const GenerateData = (props: { comp: weatherDataType }) => {
        const data = props.comp.componentData;
        if (typeof data === "string" || typeof data === "number") {
            return <>{data}</>;
        }
        if (typeof data === "object" && data !== null && !Array.isArray(data)) {
            const compDataArr = Object.entries(data);

            if (!compDataArr || !compDataArr.length) {
                return <div></div>;
            }
            return compDataArr.map(([key], index) => {
                return <div key={index}>{key}</div>;
            });
        }
    };

    // Generating the components:
    const generateDOM = () => {
        return component.map((comp: weatherDataType) => {
            const description = "remove button" + comp.componentName;
            return (
                <div
                    className="grid-layout-item-content"
                    key={comp.id}
                    data-grid={comp.dataGrid}
                >
                    {/* remove button */}
                    <button
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
                    </button>

                    {/* ICON / DATA / name */}
                    <div className="flex flex-col items-center justify-center text-white h-full">
                        <div className="flex items-start justify-center mb-2 ml-1">
                            <div className="text-5xl mr-3">
                                {weatherIcon[comp.componentName]}
                            </div>
                            <div className="text-sm tracking-wide">
                                {comp.componentName ?? "[no name]"}
                            </div>
                        </div>

                        {/* Data */}
                        <div>
                            <div className="text-4xl font-semibold text-amber-200">
                                <GenerateData comp={comp} />
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    const onBreakpointChange = (breakpoint: any) => {
        setCurrentBreakpoint(breakpoint);
        setToolbox({
            ...toolbox,
            [breakpoint]:
                toolbox[breakpoint] || toolbox[currentBreakpoint] || [],
        });
    };

    // const onDrop = (layoutItem: Layout, _ev: Event) => {
    //     alert(
    //         `Element parameters:\n${JSON.stringify(
    //             layoutItem,
    //             ["x", "y", "w", "h"],
    //             2,
    //         )}`,
    //     );
    // };

    return (
        <>
            <div className="grid-layout">
                <ResponsiveReactGridLayout
                    key={currentBreakpoint}
                    rowHeight={30}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    containerPadding={[0, 0]}
                    //--

                    layouts={layouts}
                    measureBeforeMount={false}
                    useCSSTransforms={mounted}
                    compactType={compactType}
                    preventCollision={!compactType}
                    onLayoutChange={onLayoutChange}
                    onBreakpointChange={onBreakpointChange}
                    // onDrop={onDrop}
                    isDroppable
                    draggableCancel=".cancelSelector"
                >
                    {generateDOM() ?? <div>loading</div>}
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
};

export { GridComponent };
