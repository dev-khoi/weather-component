import type { Dispatch, SetStateAction } from "react";
// TYPE:
// prop type

// component type
interface ComponentState {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
}
// Mock data type
interface WeatherDataType {
    id: string;
    componentName: string;
    componentData: number | string;
}

interface HeadInfo {
    location: string;
    time: string;
}
interface UserComponentContextType {
    weatherData: WeatherDataType[];
    setWeatherData: Dispatch<SetStateAction<WeatherDataType[]>>;
    headInfo: HeadInfo;
}

interface WeatherComponentContextType {
    weatherComponent: WeatherDataType[];
    setWeatherComponent: Dispatch<SetStateAction<WeatherDataType[]>>;
}
interface LatLongType {
    lat: Number;
    long: Number;
}

interface ComponentListType {
    id: string;
    componentName: string;
}



export type {
    ComponentState,
    WeatherDataType,
    UserComponentContextType,
    WeatherComponentContextType,
    LatLongType,
    ComponentListType,
    HeadInfo,
};
