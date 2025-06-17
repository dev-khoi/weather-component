import { useContext, useEffect, useState, type FunctionComponent } from "react";
import { userComponentContext, type weatherDataType } from "./gridLayout";
import {
    Responsive,
    WidthProvider,
    type Layout,
    type Layouts,
} from "react-grid-layout";

import { type ComponentState } from "./gridLayout";
import { weatherIcon } from "./weatherAPI.tsx";
import { Disclosure } from "@headlessui/react";

import { SearchBar } from "./searchBar.tsx";
// props interface

const ResponsiveReactGridLayout = WidthProvider(Responsive);

// Rendering the grid component inside the grid layout
const GridComponent: FunctionComponent = () => {
    // _______________________________
    // Grid layout configuration

    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("lg");
    const [compactType, setCompactType] = useState<
        "vertical" | "horizontal" | null | undefined
    >("vertical");
    const [mounted, setMounted] = useState(false);
    const [toolbox, setToolbox] = useState<{ [index: string]: any[] }>({
        lg: [],
    });
    const [hasLoadedLayout, setHasLoadedLayout] = useState(false);

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

    // loading layouts before
    useEffect(() => {
        const saved = loadLayouts();

        if (saved) {
            setLayouts(saved);
            setHasLoadedLayout(true);
        }
    }, []);

    // if component is changed, the layout changes with the component
    useEffect(() => {
        if (hasLoadedLayout) {
            setLayouts(toLayouts(component));
        }
    }, [component]);

    // before user leave the page, the layout is saved into local storage
    useEffect(() => {
        window.addEventListener("beforeunload", () => saveLayouts(layouts));
        return () =>
            window.removeEventListener("beforeunload", () =>
                saveLayouts(layouts)
            );
    }, [layouts]);

    // default layout
    const defaultLayouts = {
        lg: component.map((item) => ({
            ...item.dataGrid,
            i: item.id.toString(),
            minW: 2,
            maxW: 5,
            minH: 3,
            maxH: 6,
            static: false,
        })),
    };
    ``;

    const onLayoutChange = (layout: Layout[], layouts: Layouts) => {
        // Setting the
        // Update ALL component dataGrids to match the layout
        const updatedComponents = component.map((comp) => {
            const layoutItem = layout.find(
                (item) => item.i === comp.id.toString()
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

        // console.log(component[0].dataGrid)
    };

    // convert component into layout type
    function toLayouts(components: weatherDataType[]): Layouts {
        const baseLayout = components.map((item) => ({
            ...item.dataGrid,
            i: item.id.toString(),
            minW: 2,
            maxW: 5,
            minH: 3,
            maxH: 6,
            static: false,
        }));

        return {
            lg: baseLayout,
            md: baseLayout,
            sm: baseLayout,
            xs: baseLayout,
            xxs: baseLayout,
        };
    }

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
            return compDataArr.map(([key, value], index) => {
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
                    // data-grid={comp.dataGrid}
                >
                    {/* remove button */}
                    <button
                        onClick={() => {
                            removeComponent(comp.id);
                        }}
                        className="p-0 w-20 h-5 absolute top-0 right-2 hover:bg-amber-100 z-6 cancelSelector"
                        role="remove component"
                        aria-label={description}
                    ></button>

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

    const onCompactTypeChange = () => {
        let oldCompactType = "";

        const compactType =
            oldCompactType === "horizontal"
                ? "vertical"
                : oldCompactType === "vertical"
                ? null
                : "horizontal";
        setCompactType(compactType);
    };

    const onDrop = (layout: Layout[], layoutItem: Layout, _ev: Event) => {
        alert(
            `Element parameters:\n${JSON.stringify(
                layoutItem,
                ["x", "y", "w", "h"],
                2
            )}`
        );
    };

    // controlling where the element is dragged
    const draggingStop = (index: number, grid: ComponentState) => {
        const newComp = [...component];
        newComp[index] = {
            ...newComp[index],
            dataGrid: {
                ...newComp[index].dataGrid,
                x: grid.x,
                y: grid.y,
            },
        };

        setComponent(newComp);
        // console.debug(component[index].dataGrid.x, grid.x);
    };
    // controlling how the element is resize
    const resizingStop = (index: number, grid: ComponentState) => {
        const newComp = [...component];
        newComp[index] = {
            ...newComp[index],
            dataGrid: {
                ...newComp[index].dataGrid,
                w: grid.w,
                h: grid.h,
            },
        };
        setComponent(newComp);
        // console.debug(component[index].dataGrid.w, grid.w);
    };

    return (
        <>
            <div className="grid-layout">
                <ResponsiveReactGridLayout
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
                    onDrop={onDrop}
                    isDroppable
                    draggableCancel=".cancelSelector"
                    // onDragStop={(
                    //     layout,
                    //     oldItem,
                    //     newItem,
                    //     placeholder,
                    //     e,
                    //     element
                    // ) => {
                    //     const index = component.findIndex(
                    //         (comp) => comp.id.toString() === newItem.i
                    //     );
                    //     if (index !== -1) {
                    //         draggingStop(index, newItem); // Update the context
                    //     }
                    // }}
                    // onResizeStop={(
                    //     layout,
                    //     oldItem,
                    //     newItem,
                    //     placeholder,
                    //     event,
                    //     element
                    // ) => {
                    //     const index = component.findIndex(
                    //         (comp) => comp.id.toString() === newItem.i
                    //     );
                    //     if (index !== -1) {
                    //         resizingStop(index, newItem);
                    //     }
                    // }}
                >
                    {generateDOM()}
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
};

export { GridComponent };
