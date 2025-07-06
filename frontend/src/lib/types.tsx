import  type {  ReactNode, Dispatch, SetStateAction} from "react";
// TYPE:
// prop type
interface prop {
    children: ReactNode;
}
// component type
type ComponentState = {
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
};
// Mock data type
type weatherDataType = {
    id: number;
    componentName: string;
    componentData: number | string | Record<string, any>;
    dataGrid: ComponentState;
};

type UserComponentContextType = {
    userComponent: weatherDataType[];
    setUserComponent: Dispatch<SetStateAction<weatherDataType[]>>;
};

type WeatherComponentContextType = {
    weatherComponent: weatherDataType[];
    setWeatherComponent: Dispatch<SetStateAction<weatherDataType[]>>;
};
type latLongType = {
    lat: Number;
    long: Number;
};
// formatting the api

export type {prop, ComponentState, weatherDataType, UserComponentContextType, WeatherComponentContextType, latLongType}