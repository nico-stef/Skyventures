import axios from "axios";

export const getCurrentWeather = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
            params: {
                key:"", // Your WeatherAPI.com API Key
                q: `${latitude},${longitude}`, // Format: 'latitude,longitude'
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}