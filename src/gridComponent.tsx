import {
    useContext,
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

import { type ComponentState } from "./gridLayout";
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

    useEffect(() => {
        setMounted(true);
    }, []);

    // useContext to get the components array
    const context = useContext(userComponentContext);
    if (!context) return <p>loading...</p>;

    const { component, setComponent } = context;

    // map it into layout
    const [layouts, setLayouts] = useState<{ [index: string]: any[] }>({
        lg: component.map((item, index) => ({
            ...item.dataGrid,
            i: item.id.toString(), // react-grid-layout needs "i" as string
            minW: 2,
            maxW: 5,
            minH: 2,
            maxH: 6,
            static: false,
        })),
    });

    // removing button
    const removeComponent = (id: number) => {
        const updatedComponents = component.filter(comp => id !== comp.id)
        setComponent(updatedComponents);
    }

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
                    <button onClick={()=>{removeComponent(comp.id)}} className="p-0 w-20 h-5 absolute top-0 right-2 hover:bg-amber-100 z-6 cancelSelector" role="remove component" aria-label={description} >
                        remove
                    </button>
                    {comp.componentName}
                    {comp.componentData}
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

    const onLayoutChange = (layout: Layout[], layouts: Layouts) => {
        setLayouts({ ...layouts });
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
        console.debug(component[index].dataGrid.x, grid.x);
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
        console.debug(component[index].dataGrid.w, grid.w);
    };
    return (
        <>
            <div className="mb-4">
                <ResponsiveReactGridLayout
                    className="layout p-4"
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
                    style={{ background: "#f0f0f0" }}
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
