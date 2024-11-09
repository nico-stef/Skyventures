// GooglePlacesService.js
import axios from "axios";

const API_KEY = "AIzaSyBk0uay8YDjl8B6qgsADQbobRY19bmpD4M"; // Replace with your API Key
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export const getNearbyPlaces = async (latitude, longitude, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        rankby: "distance",
        type: type, // Uses the type passed from `NearbyPlaces`
        key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};
