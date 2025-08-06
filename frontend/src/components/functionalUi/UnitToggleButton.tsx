import { useUnit } from "@/Weather/unitContext";
import React from "react";

const UnitToggleSwitch = () => {
    const {unit, setUnit} = useUnit();

    const toggleUnit = () => setUnit(unit === "f" ? "c" : "f");

    return (
        <label style={styles.switch}>
            <input
                type="checkbox"
                checked={unit === "c"}
                onChange={toggleUnit}
                style={{ display: "none" }}
            />
            <span style={styles.slider}>
                <span
                    style={unit === "f" ? styles.leftLabel : styles.rightLabel}
                >
                    °F
                </span>
                <span
                    style={unit === "c" ? styles.leftLabel : styles.rightLabel}
                >
                    °C
                </span>
            </span>
        </label>
    );
};

const styles: Record<string, React.CSSProperties> = {
    switch: {
        position: "relative",
        display: "inline-block",
        width: 80,
        height: 36,
        userSelect: "none",
    },
    slider: {
        position: "absolute",
        cursor: "pointer",
        backgroundColor: "#ccc",
        borderRadius: 18,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        transition: "0.4s",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 10px",
        fontWeight: "bold",
        fontSize: 16,
        color: "#fff",
        boxSizing: "border-box",
    },
    leftLabel: {
        color: "#000",
        fontWeight: "bold",
    },
    rightLabel: {
        color: "#aaa",
    },
};

export  {UnitToggleSwitch};
