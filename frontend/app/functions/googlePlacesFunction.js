// GooglePlacesService.js
import axios from "axios";

const API_KEY = ""; // Replace with your API Key
const BASE_URL = "https://maps.googleapis.com/maps/api/place";

export const getNearbyPlaces = async (latitude, longitude, type) => {
  try {
    const response = await axios.get(`${BASE_URL}/nearbysearch/json`, {
      params: {
        location: `${latitude},${longitude}`,
        radius: 1000,
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

export const getPlacePhotoUrl = (
  photoReference,
  maxWidth = 24,
  maxHeight = 24
) => {
  return `${BASE_URL}/photo?maxwidth=${maxWidth}&maxheight=${maxHeight}&photoreference=${photoReference}&key=${API_KEY}`;
};

export const getPlaceDetails = async (placeId) => {
  try {
    const response = await axios.get(`${BASE_URL}/details/json`, {
      params: {
        place_id: placeId,
        key: API_KEY,
      },
    });
    return response.data.result; // Returns the 'result' object with detailed information
  } catch (error) {
    console.error("Error fetching place details:", error);
    throw error;
  }
};
