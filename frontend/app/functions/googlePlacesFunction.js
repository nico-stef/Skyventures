// GooglePlacesService.js
import axios from "axios";

const API_KEY = ""; //your API Key
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

export const getFavoritePlacesDetails = async (placeIds) => {
  try {
    const placeDetailsPromises = placeIds.map(async (placeId) => {
      try {
        const details = await getPlaceDetails(placeId);

        // Check if details exist and handle missing properties gracefully
        if (details) {
          const photoUrl = details.photos?.length
            ? getPlacePhotoUrl(details.photos[0].photo_reference, 400, 400)
            : null;

          return {
            id: placeId,
            name: details.name || "Unknown Place",
            address: details.formatted_address || "No address available",
            rating: details.rating || "No rating",
            photoUrl: photoUrl,
          };
        } else {
          // If details is undefined, return a fallback object
          return {
            id: placeId,
            name: "Unknown Place",
            address: "No address available",
            rating: null,
            photoUrl: null,
          };
        }
      } catch (error) {
        console.error(`Error fetching details for place ID ${placeId}:`, error);
        return {
          id: placeId,
          name: "Unknown Place",
          address: "No address available",
          rating: null,
          photoUrl: null,
        };
      }
    });

    // Wait for all place details promises to resolve
    const placesDetails = await Promise.all(placeDetailsPromises);
    return placesDetails;
  } catch (error) {
    console.error("Error fetching favorite places details:", error);
    throw error;
  }
};
