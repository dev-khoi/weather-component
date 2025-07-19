import axios from "axios";
import type { Layout, Layouts } from "react-grid-layout";
// saving layout to the database
const updateLayoutDb = async (allLayouts: Layouts) => {
    console.debug("save to db");
    try {
        axios.put(
            "http://localhost:3000/componentInLayouts",
            { layouts: allLayouts },
            { withCredentials: true },
        );
    } catch (e) {
        console.error(e);
    }
};

const deleteComponentDb = async (id: string, breakpoint: string) => {
    try {
        axios.delete("http://localhost:3000/componentInLayouts", {
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
            "http://localhost:3000/componentInLayouts",
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
