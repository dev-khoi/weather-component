import { useContext, useEffect, useState } from "react";
import { userComponentContext } from "./gridLayout";
import GridLayout from "react-grid-layout";
import { getWeather } from "./weatherAPI.tsx";

const WeatherComponent = () => {
    const [weatherData, setWeatherData] = useState<any>(null);

    useEffect(() => {
        getWeather().then((data) => {
            setWeatherData(data);
        });
    }, []);
    if (!weatherData) return (<p>Loading...</p>);
    console.debug(weatherData)
    return (
        <>
            <h2>feelslike_c</h2>
            <p>{weatherData.current.feelslike_c}</p>
        </>
    );
};

const GridComponent = () => {
    // Taking the existed data
    const context = useContext(userComponentContext);
    if (!context) return null;
    const { component, setComponent } = context;

    return (
        <GridLayout className="layout" cols={12} rowHeight={30} width={1200}>
            {component.map((grid) => {
                return (
                    <div
                        className="grid-layout-item-content"
                        key={grid.i}
                        data-grid={grid}
                    >
                        <WeatherComponent />
                    </div>
                );
            })}
        </GridLayout>
    );
};

export { GridComponent };
