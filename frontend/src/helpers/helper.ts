import type { WeatherDataType } from "@/types/types";
import type { Layout } from "react-grid-layout";

// converting epoch time to time
const timeConvert = (
    dt: number,
    format: Intl.DateTimeFormatOptions,
): string => {
    const time = new Date(0);
    time.setUTCSeconds(dt);
    return time.toLocaleString("en-US", format);
};

// Map of parameter keys to their units
const weatherUnits: Record<string, string> = {
    // Main Weather Info
    weather_main: "",
    weather_description: "",
    weather_icon: "",
    // Temperature Info
    temp: "°c", // Kelvin by default
    feels_like: "°c",
    temp_min: "°c",
    temp_max: "°c",
    // Atmospheric Info
    pressure: "hPa",
    humidity: "%",
    sea_level: "hPa",
    grnd_level: "hPa",
    // Wind & Clouds
    wind_speed: "m/s",
    wind_deg: "°",
    wind_gust: "m/s",
    cloudiness: "%",
    visibility: "m",
    // Rain/Snow (optional)
    rain_1h: "mm/h",
    snow_1h: "mm/h",
    // Sunrise/Sunset
    sunrise: "",
    sunset: "",
};

// Map of parameter keys to their units
const weatherFUnits: Record<string, string> = {
    // Main Weather Info
    weather_main: "",
    weather_description: "",
    weather_icon: "",
    // Temperature Info
    temp: "°f", // Kelvin by default
    feels_like: "°f",
    temp_min: "°f",
    temp_max: "°f",
    // Atmospheric Info
    pressure: "hPa",
    humidity: "%",
    sea_level: "hPa",
    grnd_level: "hPa",
    // Wind & Clouds
    wind_speed: "m/s",
    wind_deg: "°",
    wind_gust: "m/s",
    cloudiness: "%",
    visibility: "m",
    // Rain/Snow (optional)
    rain_1h: "mm/h",
    snow_1h: "mm/h",
    // Sunrise/Sunset
    sunrise: "",
    sunset: "",
};

function getListMissingId(
    weatherData: WeatherDataType[],
    layoutComp: Layout[],
) {
    if (!layoutComp) {
        weatherData.map((e) => {
            return ({id: e.id, componentName: e.componentName});
        });
    }
    const layoutIds = new Set(layoutComp.map((w) => w.i)); // Assuming `id` is the correct key
    const searchList = weatherData
        .filter((user) => !layoutIds.has(user.id))
        .map((e) => {
            return { id: e.id, componentName: e.componentName };
        });

    return searchList;
}

const colWidth = 2;
const tileHeight = 3;

const createLayout = (id: string) => {
  return {
    i: id,
    x: 0,
    y: 0,
    w: colWidth,
    h: tileHeight,
    minW: colWidth,
    minH: tileHeight,
    maxW: 5,
    maxH: 6,
    static: false,
  };
};

const provokeGeolocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      console.log("Latitude:", position.coords.latitude);
      console.log("Longitude:", position.coords.longitude);
      // Fetch weather or update state here
    },
    (error) => {
      if (error.code === error.PERMISSION_DENIED) {
        alert("Location permission denied. Please enable it in browser settings.");
      } else {
        alert("Error getting location: " + error.message);
      }
    }
  );
}
export { timeConvert, weatherUnits, weatherFUnits, getListMissingId, createLayout, provokeGeolocation};
