import { useState, useEffect } from "react";
import { getWeather } from "./weatherAPI.tsx";
// Grid import
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
const App = () => {
    const grid = GridStack.init();
    const serializedData = [
  {x: 0, y: 0, w: 2, h: 2},
  {x: 2, y: 3, w: 3, content: 'item 2'},
  {x: 1, y: 3}
];

grid.load(serializedData);
    return(
        <>
        </>
    )
}

export default App;
