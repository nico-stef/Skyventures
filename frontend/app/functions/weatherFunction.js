import axios from "axios";
import Constants from 'expo-constants';

const API_KEY = Constants.expoConfig.extra.WEATHER_API;

export const getCurrentWeather = async (latitude, longitude) => {
  try {
    const response = await axios.get(
      "https://api.weatherapi.com/v1/current.json",
      {
        params: {
          key: API_KEY, // Your WeatherAPI.com API Key
          q: `${latitude},${longitude}`, // Format: 'latitude,longitude'
        },
      }
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
