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

    const [currentBreakpoint, setCurrentBreakpoint] = useState<string>("");

    const getBreakpointFromWidth = (width: number): string => {
        if (width >= 1150) return "lg";
        if (width >= 996) return "md";
        if (width >= 768) return "sm";
        if (width >= 480) return "xs";
        return "xxs";
    };

    useEffect(() => {
        setCurrentBreakpoint(getBreakpointFromWidth(window.innerWidth));
    }, []);
    const ignoreLayoutChange = useRef(false);
    const saveLayoutDb = useRef(false);
    const [compactType] = useState<
        "vertical" | "horizontal" | null | undefined
    >("vertical");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [layouts, setLayouts] = useState<Layouts | undefined>();
    const lastSavedLayout = useRef<Layout[]>([]);
    const isFirstRender = useRef(true);
    useEffect(() => {
        axios
            .get("http://localhost:3000/layout", {
                withCredentials: true,
            })
            .then((e) => {
                setLayouts(e.data.dataGrid);
            });
    }, []);

    useEffect(() => {
        if (!layouts || layouts[currentBreakpoint].length === 0 ) return;

        // Don't run on first render
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        // Compare current layout with last saved
        const oldLayout = JSON.stringify(lastSavedLayout.current);
        const newLayout = JSON.stringify(layouts);

        if (oldLayout !== newLayout && !saveLayoutDb.current) {
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
            saveLayoutDb.current = true;
        }
    }, [layouts]);

    if (
        !userComponent ||
        userComponent.length === 0 ||
        currentBreakpoint === ""
    ) {
        return <LoadingAnimation />;
    }

    // callback when layouts change
    // lastSavedLayout ref is used for saving the last layout before changing,
    // in this case it is used for saving the layout before a breakpoint change
    // ignoreLayoutChange ref is used for ignoring the layoutChanges
    // when a breakpoint is made
    const onLayoutChange = (layout: Layout[], allLayouts: Layouts) => {
        console.log("layout");
        lastSavedLayout.current = layout;

        if (!ignoreLayoutChange.current) {
            setLayouts(allLayouts);
            saveLayoutDb.current = false;
            console.log("layout set");
        }
        ignoreLayoutChange.current = false;
    };

    // callback when breakpoint change
    // onbreakpoint -> rerender -> onlayoutchange
    // during rerender, ignoreLayoutChange will be
    // set to default value (false)
    // Save current layout before switch
    // using lastSavedLayout ref
    // Update currentBreakpoint after saving
    const onBreakpointChange = (newBreakpoint: string) => {
        console.log(window.innerWidth)
        console.log("breakpoint");

        if (lastSavedLayout.current) {
            ignoreLayoutChange.current = true;

            setLayouts((prevLayouts) => {
                return {
                    ...prevLayouts,
                    [currentBreakpoint]: lastSavedLayout.current,
                };
            });
        }
        setCurrentBreakpoint(newBreakpoint);
    };
    //
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
                                {comp && <GenerateData comp={comp} />}
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
                        useCSSTransforms={mounted}
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
