// GooglePlacesService.js
import axios from "axios";
import Constants from 'expo-constants';
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig.extra.API_URL;

export const getNearbyPlaces = async (latitude, longitude, type) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axios.get(`${API_URL}/google-places/nearby`, {
      params: {
        latitude,
        longitude,
        type,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
};

export const getPlacePhotoUrl = (
  photoReference, //code that identifies the photo. its returned in the place details response. its not the url
  maxWidth = 400,
  maxHeight = 400
) => {
  // Returns the backend URL that will proxy the request
  return `${API_URL}/google-places/photo?photoReference=${photoReference}&maxWidth=${maxWidth}&maxHeight=${maxHeight}`;
};

export const getPlaceDetails = async (placeId) => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axios.get(`${API_URL}/google-places/details/${placeId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data; // Returns the 'result' object with detailed information
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
            place_id: placeId,
            name: details.name || "Unknown Place",
            address: details.formatted_address || "No address available",
            rating: details.rating || "No rating",
            photoUrl: photoUrl,
          };
        } else {
          // If details is undefined, return a fallback object
          return {
            id: placeId,
            place_id: placeId,
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
          place_id: placeId,
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

export const searchPlaces = async (query, location = "") => {
  try {
    const token = await SecureStore.getItemAsync("token");
    const response = await axios.get(`${API_URL}/google-places/search`, {
      params: {
        query,
        location,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.data.results) {
      return response.data.results.map(place => {
        const photoUrl = place.photos?.length ? getPlacePhotoUrl(place.photos[0].photo_reference, 400, 400) : null;

        return {
          place_id: place.place_id,
          name: place.name,
          vicinity: place.formatted_address || place.vicinity,
          formatted_address: place.formatted_address,
          rating: place.rating,
          photoUrl: photoUrl,
        };
      });
    }

    return [];
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
};