import { type ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";

type DraggableProps = {
    children: ReactNode,
    id: string | number,
    className: string | undefined
};
function Droppable(props: DraggableProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? "green" : undefined,
    };

    return (
        <div className={props.className} ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
}

export default Droppable;
