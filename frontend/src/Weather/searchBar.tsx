import { useRef, useState, useCallback, useEffect } from "react";

import { CiCircleRemove } from "react-icons/ci";
import { IconContext } from "react-icons";
import type { ComponentListType } from "@/types/types";

const SearchBar = ({
    originComponentList,
    currentBreakpoint,
    addComponent,
}: {
    originComponentList: ComponentListType[];
    currentBreakpoint: string;
    addComponent: (id: string) => Promise<void>;
}) => {
    // list of components that haven't been added
    const [componentList, setComponentList] =
        useState<ComponentListType[]>(originComponentList);

    // dialog visibility
    const [visible, setVisible] = useState<Boolean>(false);
    const dialogRef = useRef<HTMLDialogElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    if (!componentList || !currentBreakpoint) {
        return;
    }

    // List of weather components contains real data
    // dialog toggle
    useEffect(() => {
        if (visible) {
            setComponentList(originComponentList);
            dialogRef.current?.showModal();
            inputRef.current?.focus();
        } else {
            dialogRef.current?.close();
        }
    }, [visible]);

    // *
    // Turning dialog on or off
    const toggleDialog = () => {
        setVisible(!visible);
    };
    // shortcut to open dialog
    const handleKeyPress = useCallback(
        (event: KeyboardEvent) => {
            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {
                event.preventDefault(); // prevent default browser behavior like focus search bar
                toggleDialog();
            }
        },
        [toggleDialog],
    );

    useEffect(() => {
        // attach the event listener
        document.addEventListener("keydown", handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    // searching and adding componenent
    const searching = (e: string) => {
        const value = e.trim();

        const re = new RegExp(e, "ig");
        if (value === "" || value === null || value === undefined) {
            setComponentList(originComponentList);
        } else {
            setComponentList(
                componentList.filter((comp) => comp.componentName.match(re)),
            );
        }
    };

    return (
        <>
            <button
                className="bg-(--background-color) inline-flex items-center align-middle gap-2 border-2 border-card dark:border-border  rounded-lg py-1 px-3"
                onClick={toggleDialog}
            >
                Add component
                <div className="hidden gap-1 sm:flex">
                    <kbd className="bg-primary-foreground text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3">
                        Ctrl
                    </kbd>
                    <kbd className="bg-primary-foreground text-muted-foreground pointer-events-none flex h-5 items-center justify-center gap-1 rounded border px-1 font-sans text-[0.7rem] font-medium select-none [&amp;_svg:not([class*='size-'])]:size-3 aspect-square">
                        K
                    </kbd>
                </div>
            </button>

            {/* dialog to add component */}
            {visible && (
                <dialog
                    title="Search dialog"
                    ref={dialogRef}
                    onClose={toggleDialog}
                    className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
               w-96 max-h-[80vh] overflow-y-auto p-6 
               rounded-xl shadow-xl border border-gray-300 
               dark: bg-gray-700 text-white z-50
               backdrop:backdrop-blur-[2px]
"
                >
                    <p className=" text-(-primary-white) text-lg md:text-md mb-4">
                        Add Component
                    </p>
                    <button
                        onClick={toggleDialog}
                        className="absolute right-2 top-2 "
                    >
                        <IconContext
                            value={{ className: "text-red-400", size: "33px" }}
                        >
                            <CiCircleRemove />
                        </IconContext>
                    </button>
                    <input
                        ref={inputRef}
                        placeholder="Find a component"
                        type="text"
                        defaultValue=""
                        onChange={(e) => searching(e.target.value)}
                        className="w-full px-3 py-2 mb-4  border rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                    bg-white text-black"
                    />
                    <ul className="space-y-2">
                        {componentList.map((comp) => (
                            <li key={comp.id}>
                                <button
                                    onClick={() =>{ addComponent(comp.id);
                                        setComponentList(componentList.filter((e) => e.id !== comp.id))
                                     }}
                                    className="w-full text-left px-3 py-2 bg-gray-500 rounded-md 
                               hover:bg-gray-400 "
                                >
                                    {comp.componentName}
                                </button>
                            </li>
                        ))}
                    </ul>
                </dialog>
            )}
        </>
    );
};

export { SearchBar };
