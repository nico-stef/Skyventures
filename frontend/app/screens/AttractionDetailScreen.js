import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import {
  getPlaceDetails,
  getPlacePhotoUrl,
} from "../functions/googlePlacesFunction";
import { globalStyles } from "../styles/globalStyles";
import { tripsStyles } from "../styles/TripsStyles";
import AddToTripModal from "./modals/AddToTripModal";
import axios from "axios";
import Constants from 'expo-constants';

const API_URL = Constants.expoConfig.extra.API_URL;

export default function AttractionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { place } = route.params;

  const [userId, setUserId] = useState("");
  const [placeDetails, setPlaceDetails] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addToTripModalVisible, setAddToTripModalVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const id = await SecureStore.getItemAsync("userId");
      setUserId(id);
    };
    getUserData();
  }, []);

  useEffect(() => {
    fetchPlaceDetails();
    if (userId) {
      checkIfFavorite();
    }
  }, [place.place_id, userId]);

  const fetchPlaceDetails = async () => {
    try {
      const details = await getPlaceDetails(place.place_id);
      setPlaceDetails(details);
    } catch (error) {
      console.error("Error fetching place details:", error);
      Alert.alert("Error", "Failed to load place details");
    } finally {
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/favorites/check/${userId}/${place.place_id}`
      );
      setIsFavorite(response.data.isFavorite);
    } catch (error) {
      console.error("Error checking favorite:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await axios.delete(`${API_URL}/favorites/${userId}/${place.place_id}`);
        setIsFavorite(false);
        Alert.alert("Success", "Removed from favorites");
      } else {
        await axios.post(`${API_URL}/favorites`, {
          userId,
          placeId: place.place_id,
        });
        setIsFavorite(true);
        Alert.alert("Success", "Added to favorites");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      Alert.alert("Error", "Failed to update favorites");
    }
  };

  const handleAddToTrip = () => {
    if (!userId) {
      Alert.alert("Error", "Please log in to add to trips");
      return;
    }
    setAddToTripModalVisible(true);
  };

  if (loading || !placeDetails) {
    return (
      <SafeAreaView style={globalStyles.backgroundPlace}>
        <View style={[globalStyles.loadingContainer, { flex: 1, justifyContent: 'center' }]}>
          <ActivityIndicator size="large" color="#886ae6" />
          <Text style={{ marginTop: 10 }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const placeDataForModal = {
    name: placeDetails.name,
    place_id: place.place_id,
    vicinity: placeDetails.vicinity,
    formatted_address: placeDetails.formatted_address,
    rating: placeDetails.rating,
    photoUrl: placeDetails.photos && placeDetails.photos.length > 0
      ? getPlacePhotoUrl(placeDetails.photos[0].photo_reference, 400, 300)
      : null,
  };

  return (
    <SafeAreaView style={globalStyles.backgroundPlace}>
      <View style={globalStyles.headerContainerPlace}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require("../assets/left-chevron.png")}
            style={globalStyles.backButtonPlace}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={globalStyles.placeContainerPlace}>
        {/* Main Photo */}
        {placeDetails.photos && placeDetails.photos.length > 0 && (
          <Image
            source={{
              uri: getPlacePhotoUrl(
                placeDetails.photos[0].photo_reference,
                900,
                600
              ),
            }}
            style={globalStyles.imagePlace}
          />
        )}

        {/* Title and Rating */}
        <Text style={globalStyles.titlePlace}>{placeDetails.name}</Text>
        
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
          <Text style={globalStyles.ratingPlace}>
            Rating: {placeDetails.rating ? `${placeDetails.rating}/5` : "N/A"}
          </Text>
          {placeDetails.user_ratings_total && (
            <Text style={{ fontSize: 16, marginLeft: 5 }}>
              ({placeDetails.user_ratings_total} ratings)
            </Text>
          )}
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginBottom: 20, gap: 10 }}>
          <TouchableOpacity
            style={[
              tripsStyles.editButton,
              { flex: 1, marginTop: 0 },
              isFavorite && { backgroundColor: '#f44336' }
            ]}
            onPress={toggleFavorite}
          >
            <Text style={tripsStyles.editButtonText}>
              {isFavorite ? '♥ Remove from Favorites' : '♡ Add to Favorites'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[tripsStyles.editButton, { flex: 1, marginTop: 0 }]}
            onPress={handleAddToTrip}
          >
            <Text style={tripsStyles.editButtonText}>+ Add to Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <View style={tripsStyles.overviewCard}>
          <Text style={tripsStyles.overviewTitle}>Location</Text>
          <Text style={tripsStyles.overviewValue}>
            {placeDetails.formatted_address || placeDetails.vicinity}
          </Text>
        </View>

        {/* Contact & Hours */}
        {(placeDetails.formatted_phone_number || placeDetails.opening_hours) && (
          <View style={tripsStyles.overviewCard}>
            <Text style={tripsStyles.overviewTitle}>Information</Text>
            
            {placeDetails.formatted_phone_number && (
              <View style={tripsStyles.overviewRow}>
                <Text style={tripsStyles.overviewLabel}>Phone</Text>
                <Text style={tripsStyles.overviewValue}>
                  {placeDetails.formatted_phone_number}
                </Text>
              </View>
            )}

            {placeDetails.opening_hours && (
              <View style={{ marginTop: 10 }}>
                <Text style={tripsStyles.overviewLabel}>Hours</Text>
                <Text
                  style={[
                    tripsStyles.overviewValue,
                    {
                      color: placeDetails.opening_hours.open_now ? '#4CAF50' : '#f44336',
                      marginTop: 5
                    }
                  ]}
                >
                  {placeDetails.opening_hours.open_now ? 'Open Now' : 'Closed'}
                </Text>
                {placeDetails.opening_hours.weekday_text && (
                  <View style={{ marginTop: 10 }}>
                    {placeDetails.opening_hours.weekday_text.map((day, index) => (
                      <Text key={index} style={{ fontSize: 14, color: '#666', marginBottom: 3 }}>
                        {day}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Website */}
        {placeDetails.website && (
          <TouchableOpacity
            style={tripsStyles.editButton}
            onPress={() => {
              if (placeDetails.website) {
                Linking.openURL(placeDetails.website).catch((err) => {
                  console.error("Failed to open URL:", err);
                });
              }
            }}
          >
            <Text style={tripsStyles.editButtonText}>Visit Website</Text>
          </TouchableOpacity>
        )}

        {/* Reviews */}
        {placeDetails.reviews && placeDetails.reviews.length > 0 && (
          <View style={tripsStyles.overviewCard}>
            <Text style={tripsStyles.overviewTitle}>Reviews</Text>
            {placeDetails.reviews.slice(0, 3).map((review, index) => (
              <View
                key={index}
                style={{
                  borderBottomWidth: index < 2 ? 1 : 0,
                  borderBottomColor: '#eee',
                  paddingBottom: 15,
                  marginBottom: 15,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontWeight: 'bold', color: '#333' }}>
                    {review.author_name}
                  </Text>
                  <Text style={{ color: '#886ae6', fontWeight: 'bold' }}>
                    {review.rating}/5
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
                  {review.text}
                </Text>
                <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>
                  {review.relative_time_description}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <AddToTripModal
        visible={addToTripModalVisible}
        onClose={() => setAddToTripModalVisible(false)}
        onSuccess={() => setAddToTripModalVisible(false)}
        userId={userId}
        placeData={placeDataForModal}
      />
    </SafeAreaView>
  );
}
