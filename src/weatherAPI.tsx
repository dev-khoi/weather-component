const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = import.meta.env.VITE_WEATHER_HOST;

const getWeather = async () => {
    const url = `${baseUrl}?${new URLSearchParams({
        key: apiKey,
        q: "auto:ip",
    })}`;

    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            // console.debug(responseData);
            return responseData;
        }
        console.error(response.status);
    } catch (error) {
        console.error(error);
    }
};

// Return formatted date for api key
const todayFormattedDate = () => {
    const ms = new Date();

    const formattedDate = `${ms.getFullYear()}-${(ms.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${ms.getDate().toString().padStart(2, "0")}`;

    return formattedDate;
};
export { getWeather };
