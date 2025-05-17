import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    DndContext,
    type DragStartEvent,
    type DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import { type Coordinates, type Transform } from "@dnd-kit/utilities";

import Draggable from "./Draggable.tsx";
import Droppable from "./Droppable.tsx";

import { createSnapModifier } from "@dnd-kit/modifiers";

//drop animation
interface DropAnimation {
    duration: number;
    easing: string;
}

// creating the interface of dragging and dropping
export function App() {
    // Setting initial coord
    const [dragCoord, setDragCoord] = useState<Transform | null>(null);

    const draggableMarkup = (
        <Draggable moving={dragCoord}>weather component</Draggable>
    );

    // Handling drag start and end
    const handleDragStart = () => {};

    const handleDragEnd = (prop: DragEndEvent) => {
        // Getting and assigning the coordination of the prop
        const coordWithScale = Object.assign(prop.delta, {
            scaleX: 1,
            scaleY: 1,
        });
        setDragCoord(coordWithScale);
        console.debug(coordWithScale);
    };
    // rendering the app
    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
        >
            {draggableMarkup}
        </DndContext>
    );
}

export default App;
