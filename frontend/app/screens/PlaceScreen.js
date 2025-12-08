// PlaceScreen.js
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getPlaceDetails,
  getPlacePhotoUrl,
} from "../functions/googlePlacesFunction";
import { tripsStyles } from "../styles/TripsStyles";

export default function PlaceScreen({ route }) {
  const navigation = useNavigation();
  const { place } = route.params; // Retrieve the place data passed as a parameter
  const [placeDetails, setPlaceDetails] = useState(null);
  const [displayedReviews, setDisplayedReviews] = useState(2); // Track number of reviews displayed

  useEffect(() => {
    // Fetch more details for the place
    const fetchPlaceDetails = async () => {
      try {
        const details = await getPlaceDetails(place.place_id);
        setPlaceDetails(details);
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    fetchPlaceDetails();
  }, [place.place_id]);

  if (!placeDetails) {
    return (
      <SafeAreaView style={tripsStyles.container}>
        <View style={tripsStyles.emptyContainer}>
          <Text style={tripsStyles.emptyText}>Loading place details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const openWebsite = () => {
    if (placeDetails.website) {
      Linking.openURL(placeDetails.website).catch((err) => {
        console.error("Failed to open URL:", err);
      });
    }
  };

  const loadMoreReviews = () => {
    // Load 3 more reviews each time button is pressed
    setDisplayedReviews((prevCount) => prevCount + 3);
  };

  return (
    <SafeAreaView style={tripsStyles.container}>
      <View style={tripsStyles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ marginRight: 15 }}
          >
            <Text style={{ fontSize: 24, color: 'white' }}>←</Text>
          </TouchableOpacity>
          <Text style={tripsStyles.headerTitle}>Place Details</Text>
        </View>
      </View>
      
      <ScrollView 
        style={{ flex: 1, backgroundColor: '#f5f5f5' }}
        contentContainerStyle={{ padding: 15 }}
      >
        {placeDetails.photos && placeDetails.photos.length > 0 && (
          <Image
            source={{
              uri: getPlacePhotoUrl(
                placeDetails.photos[0].photo_reference,
                900,
                600
              ),
            }}
            style={{
              width: '100%',
              height: 250,
              borderRadius: 15,
              marginBottom: 20,
            }}
          />
        )}
        
        <View style={tripsStyles.tripCard}>
          <Text style={[tripsStyles.tripDestination, { fontSize: 24, marginBottom: 15 }]}>
            {placeDetails.name}
          </Text>
          
          <View style={tripsStyles.tripStats}>
            <View style={tripsStyles.tripStat}>
              <Text style={tripsStyles.tripStatValue}>
                {placeDetails.rating ? placeDetails.rating.toFixed(1) : "N/A"}
              </Text>
              <Text style={tripsStyles.tripStatLabel}>Rating</Text>
            </View>
            <View style={tripsStyles.tripStat}>
              <Text style={tripsStyles.tripStatValue}>
                {placeDetails.user_ratings_total || 0}
              </Text>
              <Text style={tripsStyles.tripStatLabel}>Reviews</Text>
            </View>
          </View>

          <View style={{ marginTop: 20, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#eee' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>📍 Address</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 15 }}>
              {placeDetails.formatted_address}
            </Text>

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>📞 Phone</Text>
            <Text style={{ fontSize: 14, color: '#666', marginBottom: 15 }}>
              {placeDetails.formatted_phone_number || "No phone number"}
            </Text>

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>🌐 Website</Text>
            {placeDetails.website ? (
              <TouchableOpacity onPress={openWebsite}>
                <Text style={{ fontSize: 14, color: '#8B5CF6', textDecorationLine: 'underline', marginBottom: 15 }}>
                  {placeDetails.website}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{ fontSize: 14, color: '#666', marginBottom: 15 }}>No website</Text>
            )}

            <Text style={{ fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 }}>🕐 Opening Hours</Text>
            <Text style={{ fontSize: 13, color: '#666', lineHeight: 20 }}>
              {placeDetails.opening_hours?.weekday_text?.join('\n') || "No hours available"}
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 20, marginBottom: 15 }}>
          User Reviews
        </Text>
        
        {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
          <>
            {placeDetails.reviews
              .slice(0, displayedReviews)
              .map((review, index) => (
                <View key={index} style={[tripsStyles.tripCard, { marginBottom: 15 }]}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: '#333' }}>
                      {review.author_name}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#8B5CF6' }}>
                      {review.rating}/5 ⭐
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#666', lineHeight: 20 }}>
                    {review.text}
                  </Text>
                </View>
              ))}
            
            {displayedReviews < placeDetails.reviews.length && (
              <TouchableOpacity
                style={{
                  backgroundColor: '#8B5CF6',
                  padding: 15,
                  borderRadius: 10,
                  alignItems: 'center',
                  marginBottom: 20,
                }}
                onPress={loadMoreReviews}
              >
                <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                  View More Reviews
                </Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={tripsStyles.tripCard}>
            <Text style={{ fontSize: 14, color: '#999', textAlign: 'center' }}>
              No reviews available
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
