import axios from "axios";
import type { Layout, Layouts } from "react-grid-layout";
const host =  import.meta.env.VITE_BACKEND_HOST
// saving layout to the database
const updateLayoutDb = async (allLayouts: Layouts) => {
    console.debug("save to db");
    try {
        axios.put(
            `${host}/componentInLayouts`,
            { layouts: allLayouts },
            { withCredentials: true },
        );
    } catch (e) {
        console.error(e);
    }
};

const deleteComponentDb = async (id: string, breakpoint: string) => {
    try {
        axios.delete(`${host}/componentInLayouts`, {
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
        axios.post(
            `${host}/componentInLayouts`,
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
