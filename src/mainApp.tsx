import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    DndContext,
    type DragStartEvent,
    type DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import Draggable from "./Draggable.tsx";
import Droppable from "./Droppable.tsx";

import { createSnapModifier } from "@dnd-kit/modifiers";
import { getWeather } from "./weatherAPI.tsx";

//drop animation
interface DropAnimation {
    duration: number;
    easing: string;
}
// import { useDroppable } from "@dnd-kit/core";

// const DroppableComp = (id: string | number) => {
//     const { setNodeRef } = useDroppable({
//         id: id,
//     });

//     return (
//         <div ref={setNodeRef}>

//         </div>
//     )
// };

// creating the interface of dragging and dropping
export function App() {
    // Parent state is set to the id of the parent droppable box
    // Parent type can be string, null or number
    const [parent, setParent] = useState<String | null | Number>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [weather, setWeather] = useState<any | null>(null);
    // api fetch

    useEffect(() => {
        getWeather().then((result) => {
            setWeather(result);
        });
    }, [getWeather]);

    // dragable content render
    const draggableMarkup = <Draggable>weather component</Draggable>;

    // list of droppable
    const droppables = [
        { id: 1, name: "first box" },
        { id: 2, name: "second box" },
        { id: 3, name: "third box" },
    ];
    // rendering the droppables
    const droppableRenderList = droppables.map((item) => (
        <Droppable
            className="size-30 w-70 bg-blue-300 m-5 text-black"
            id={item.id}
            key={item.id}
        >
            {item.name}
            {parent === item.id ? draggableMarkup : null}
        </Droppable>
    ));

    // rendering the app
    return (
        <div>
            {weather ? (
                <p>Render some weather shit</p>
            ) : (
                <span>Loading...</span>
            )}
        </div>
    );

    // Handle dragging
    // start -> setting it is dragging
    // end   -> setting dragging to false
    function handleDragStart(event: DragStartEvent) {
        setParent(null);
        setIsDragging(true);
    }

    function handleDragEnd(event: DragEndEvent) {
        const { over } = event;

        setParent(over ? over.id : null);
        setIsDragging(false);
    }
}

export default App;
