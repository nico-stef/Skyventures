// NearbyPlaces.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import * as Location from "expo-location";
import {
  getNearbyPlaces,
  getPlacePhotoUrl,
} from "../functions/googlePlacesFunction";

const NearbyPlaces = ({ route }) => {
  const { placeType } = route.params; // Get placeType from route params
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getLastKnownPositionAsync(); // Use last known position
      if (location) {
        setLocation(location.coords);
        fetchNearbyPlaces(location.coords.latitude, location.coords.longitude);
      } else {
        // Fall back to current position if last known is unavailable
        const currentLocation = await Location.getCurrentPositionAsync();
        setLocation(currentLocation.coords);
        fetchNearbyPlaces(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude
        );
      }
    };

    fetchLocation();
  }, [placeType]);

  const [loading, setLoading] = useState(true); // Add loading state

  const fetchNearbyPlaces = async (latitude, longitude) => {
    setLoading(true); // Start loading
    try {
      const data = await getNearbyPlaces(latitude, longitude, placeType);
      setPlaces(data.results.slice(0, 10));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Show spinner while loading
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <View
              style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}
            >
              {item.photos && item.photos.length > 0 ? (
                <Image
                  source={{
                    uri: getPlacePhotoUrl(
                      item.photos[0].photo_reference,
                      24,
                      24
                    ),
                  }}
                  style={{ width: 24, height: 24, borderRadius: 8 }}
                />
              ) : (
                <Text>No photo available</Text>
              )}
              <Text style={{ fontSize: 16, fontWeight: "600" }}>
                {item.name}
              </Text>
              <Text style={{ color: "#666" }}>{item.vicinity}</Text>
              <Text>Rating: {item.rating || "N/A"}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default NearbyPlaces;
