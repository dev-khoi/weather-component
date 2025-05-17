import { type ReactNode, useEffect, useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS, type Transform } from "@dnd-kit/utilities";
type DraggableProps = {
    children: ReactNode;
    moving: Transform | null;
};

function Draggable({ children, moving }: DraggableProps) {
    // everytime it moves, it is set into that location

    // transform {x: number, y: number, scaleX: number, scaleY: number}
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: "draggable",
    });
    
    const style = transform
        ? {
              transform: CSS.Translate.toString(transform)
              
          }
        : {
            transform: CSS.Translate.toString(moving)
        };

    return (
        <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
            {children}
        </button>
    );
}

export default Draggable;
