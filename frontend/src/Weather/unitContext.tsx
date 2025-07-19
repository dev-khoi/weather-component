import { createContext, useState, type ReactNode, useContext, useEffect } from "react";

type Unit = "f" | "c";
type UnitContextType = {
    unit: Unit;
    setUnit: (unit: Unit) => void;
};

const UnitContext = createContext<UnitContextType | undefined>(undefined);

const UnitProvider = ({ children }: { children: ReactNode }) => {
    const [unit, setUnit] = useState<Unit>(() => {
        if (typeof window === "undefined") return "c"; // SSR safe
        const stored = localStorage.getItem("LOCAL_STORAGE_KEY");
        return stored === "f" || stored === "c" ? stored : "c";
    });
    
    // Sync unit changes to localStorage
    useEffect(() => {
        localStorage.setItem("LOCAL_STORAGE_KEY", unit);
    }, [unit]);

    return (
        <UnitContext.Provider value={{ unit, setUnit }}>
            {children}
        </UnitContext.Provider>
    );
};

const useUnit = () => {
    const context = useContext(UnitContext);
    if (!context) {
        throw new Error("useUnit must be used within UnitProvider");
    }
    return context;
};

export { useUnit, UnitProvider };
