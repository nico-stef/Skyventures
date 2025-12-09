import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, Platform } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { getPlaceDetails } from "../../functions/googlePlacesFunction";

export default function MapTab({ items }) {
  const [markers, setMarkers] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMapData();
  }, [items]);

  const loadMapData = async () => {
    setLoading(true);
    try {
      // Filter items that have placeId
      const itemsWithPlaces = items.filter(item => item.placeId);

      if (itemsWithPlaces.length > 0) {
        // Fetch coordinates for all places
        const markerPromises = itemsWithPlaces.map(async (item) => {
          try {
            const placeDetails = await getPlaceDetails(item.placeId);
            if (placeDetails && placeDetails.geometry) {
              return {
                id: item.itineraryId,
                coordinate: {
                  latitude: placeDetails.geometry.location.lat,
                  longitude: placeDetails.geometry.location.lng,
                },
                title: item.placeName,
                description: item.notes || placeDetails.formatted_address || "",
              };
            }
            return null;
          } catch (error) {
            console.error(`Error fetching place details for ${item.placeName}:`, error);
            return null;
          }
        });

        const fetchedMarkers = await Promise.all(markerPromises);
        const validMarkers = fetchedMarkers.filter(m => m !== null);

        if (validMarkers.length > 0) {
          setMarkers(validMarkers);

          // Calculate center of all markers
          const avgLat = validMarkers.reduce((sum, m) => sum + m.coordinate.latitude, 0) / validMarkers.length;
          const avgLng = validMarkers.reduce((sum, m) => sum + m.coordinate.longitude, 0) / validMarkers.length;

          // Calculate deltas based on the spread of markers
          const latitudes = validMarkers.map(m => m.coordinate.latitude);
          const longitudes = validMarkers.map(m => m.coordinate.longitude);
          const latDelta = Math.max(...latitudes) - Math.min(...latitudes);
          const lngDelta = Math.max(...longitudes) - Math.min(...longitudes);

          setRegion({
            latitude: avgLat,
            longitude: avgLng,
            latitudeDelta: Math.max(latDelta * 1.5, 0.05), // Add padding and minimum zoom
            longitudeDelta: Math.max(lngDelta * 1.5, 0.05),
          });
        } else {
          // No valid markers, use user location
          await useUserLocation();
        }
      } else {
        // No items with places, use user location
        await useUserLocation();
      }
    } catch (error) {
      console.error("Error loading map data:", error);
      await useUserLocation();
    } finally {
      setLoading(false);
    }
  };

  const useUserLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required to show the map.");
        // Default to a generic location
        setRegion({
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    } catch (error) {
      console.error("Error getting user location:", error);
      // Default location
      setRegion({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    }
  };

  if (loading || !region) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#469fd1" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        zoomEnabled={true}
        scrollEnabled={true}
        pitchEnabled={true}
        rotateEnabled={true}
      >
        {markers.map((marker, index) => (
          <Marker
            key={`marker-${marker.id}-${index}`}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
            pinColor="#469fd1"
          />
        ))}
      </MapView>
      {markers.length === 0 && (
        <View style={styles.noMarkersContainer}>
          <Text style={styles.noMarkersText}>
            No places in itinerary yet. Add places to see them on the map!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 500,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    height: 500,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  noMarkersContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  noMarkersText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
