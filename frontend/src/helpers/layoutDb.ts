import axios from "axios";
import type { Layout, Layouts } from "react-grid-layout";
const layoutHost =  import.meta.env.VITE_LAYOUT_HOST
// saving layout to the database
const updateLayoutDb = async (allLayouts: Layouts) => {
    console.debug("save to db");
    try {
        await axios.put(
            `${layoutHost}/components`,
            { layouts: allLayouts },
            { withCredentials: true },
        );
    } catch (e) {
        console.error(e);
    }
};

const deleteComponentDb = async (id: string, breakpoint: string) => {
    try {
        await axios.delete(`${layoutHost}/components/${breakpoint}/${id}`, {
            data: {
                id,
                breakpoint,
            },
            withCredentials: true,
        });
    } catch (e) {
        console.error(e);
    }
};

const addComponentDb = async (newComp: Layout, breakpoint: string) => {
    console.log(newComp, breakpoint);
    try {
        await axios.post(
            `${layoutHost}/components`,
            {
                newComp,
                breakpoint,
            },
            {
                withCredentials: true,
            },
        );
    } catch (e) {
        console.log(e);
    }
};

export { updateLayoutDb, deleteComponentDb, addComponentDb };
