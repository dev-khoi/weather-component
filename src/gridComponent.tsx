import {
    useContext,
    useEffect,
    useState,
    type ReactNode,
    type FunctionComponent,
} from "react";
import { userComponentContext, type weatherDataType } from "./gridLayout";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import _ from "lodash";
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
        lg: component.map((item) => ({
            ...item.dataGrid,
            i: item.id.toString(), // react-grid-layout needs "i" as string
            minW: 2,
  maxW: 5,
  minH: 2,
  maxH: 6,
  static:false,
            
        })),
    });
    // Generating the components:
    const generateDOM = () => {
        return component.map((comp: weatherDataType) => {
            return (
                <div
                    className="grid-layout-item-content"
                    key={comp.id}
                    // data-grid={comp.dataGrid}
                >
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

    const onLayoutChange = (layout: any, layouts: any) => {
        setLayouts({ ...layouts });
        // Setting the 
    };

    const onDrop = (layout: any, layoutItem: any, _ev: any) => {
        alert(
            `Element parameters:\n${JSON.stringify(
                layoutItem,
                ["x", "y", "w", "h"],
                2
            )}`
        );
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
                >
                    {generateDOM()}
                    
                </ResponsiveReactGridLayout>
            </div>
        </>
    );
};

export { GridComponent };
