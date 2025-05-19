import { useState, useEffect } from "react";
import { getWeather } from "./weatherAPI.tsx";
// Grid import
import "gridstack/dist/gridstack.min.css";
import { GridStack } from "gridstack";
const App = () => {
    useEffect(() => {
        const grid = GridStack.init();
        grid.load(serializedData)
        console.log("grid")
    },[])
    const serializedData = [
        { x: 0, y: 0, w: 2, h: 2, minW:2, minH:2},
    ];

     return (
        <>
        </>
    );
};

export default App;
