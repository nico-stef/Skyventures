import axios from "axios";

export const getCurrentWeather = async (latitude, longitude) => {
    try {
        const response = await axios.get('https://api.weatherapi.com/v1/current.json', {
            params: {
                key:"30db7c9bdd8f404ba3d90011240911", // Your WeatherAPI.com API Key
                q: `${latitude},${longitude}`, // Format: 'latitude,longitude'
            },
        });
        return response.data;
    } catch (error) {
        return error;
    }
}