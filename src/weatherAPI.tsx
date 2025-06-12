import { useEffect, useState } from "react";

const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const baseUrl = import.meta.env.VITE_WEATHER_HOST;

// fetch('https://ip-api.com/json/')
//       .then(response => response.json())
//       .then(data => {
//         const output = `
//           IP Address: ${data.query}
//           City: ${data.city}
//           Region: ${data.regionName}
//           Country: ${data.country}
//           Latitude: ${data.lat}
//           Longitude: ${data.lon}
//           Timezone: ${data.timezone}
//         `;
//         document.getElementById('output').textContent = output;
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         document.getElementById('output').textContent = 'Could not fetch location';
//       });

const getLocation = async () => {
    return new Promise<{ lat: Number; long: Number }>((resolve, reject) => {
        // success getting data
        const success = (pos: GeolocationPosition) => {
            console.debug("success");
            resolve({ lat: pos.coords.latitude, long: pos.coords.longitude });
        };

        // failure getting data
        const error = (e: GeolocationPositionError) => {
            reject(e);
        };

        // getCurrentPosition api
        const location = navigator.geolocation;
        if (location) {
            location.getCurrentPosition(success, error);
        }
    });
};

const getWeather = async (location: {lat:Number; long:Number}) => {

    const url = `${baseUrl}?${new URLSearchParams({
        lat: String(location.lat),
        lon: String(location.long),
        appid: apiKey,
    })}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const responseData = await response.json();
            // console.debug(responseData);
            console.debug(responseData);

            return responseData;
        }
        console.error(response);
    } catch (error) {
        console.error(error);
    }
};

export { getWeather, getLocation };
