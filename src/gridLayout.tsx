import type { ReactNode, HTMLAttributes } from "react";
import GridLayout from "react-grid-layout";
import { type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
interface prop {
    children: ReactNode;
    layout?: Layout[];
}
const Layout = (prop: prop) => {
    return (
        <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
            {prop.children}
        </GridLayout>
    );
};

// component of layout
interface Component {
    children: ReactNode;
    grid: Layout;
    className: string;
}
const Component = (prop: Component) => {
    return(
        <div key={prop.grid?.i} data-grid={prop.grid} className={prop.className}>

        </div>
    )
};

export const App = () => {
    return (
        <Layout>
            <Component
                key="a"
                grid={{ i: "a", x: 0, y: 0, w: 1, h: 2, static: false }}
                className="grid-layout-item-content"
            >
                a
            </Component>
            <Component
                key="b"
                grid={{ i: "b", x: 1, y: 1, w: 1, h: 2, static: false }}
                className="grid-layout-item-content"
            >
                b
            </Component>
        </Layout>
    );
};
