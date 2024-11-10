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
import { globalStyles } from "../styles/globalStyles";

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
      <View style={globalStyles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
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
    <SafeAreaView style={globalStyles.backgroundPlace}>
      <TouchableOpacity
        style={globalStyles.headerContainerPlace}
        onPress={() => navigation.navigate("Home")}
      >
        <Image
          source={require("../assets/left-chevron.png")}
          style={globalStyles.backButtonPlace}
        />
      </TouchableOpacity>
      <ScrollView style={globalStyles.placeContainerPlace}>
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
        <Text style={globalStyles.titlePlace}>{placeDetails.name}</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text style={globalStyles.ratingPlace}>
            Rating: {placeDetails.rating ? `${placeDetails.rating}/5` : "N/A"}
          </Text>
          <Text style={{ fontSize: 18, bottom: 3 }}>
            {" "}
            ({placeDetails.user_ratings_total} ratings)
          </Text>
        </View>

        <Text style={globalStyles.addressPlace}>
          {placeDetails.formatted_address}
        </Text>
        <Text style={globalStyles.Place}>
          {placeDetails.formatted_phone_number || "No phone number"}
        </Text>
        {placeDetails.website ? (
          <TouchableOpacity onPress={openWebsite}>
            <Text
              style={[
                globalStyles.detailsPlace,
                { color: "blue", textDecorationLine: "underline" },
              ]}
            >
              {placeDetails.website}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={globalStyles.detailsPlace}>No website</Text>
        )}
        <Text style={globalStyles.detailsPlace}>
          {placeDetails.opening_hours?.weekday_text.join("\n") ||
            "No hours available"}
        </Text>

        <Text style={globalStyles.reviewsHeaderPlace}>User Reviews:</Text>
        {placeDetails.reviews && placeDetails.reviews.length > 0 ? (
          placeDetails.reviews
            .slice(0, displayedReviews)
            .map((review, index) => (
              <View key={index} style={globalStyles.reviewContainerPlace}>
                <Text style={globalStyles.reviewAuthorPlace}>
                  {review.author_name}
                </Text>
                <Text style={globalStyles.reviewRatingPlace}>
                  Rating: {review.rating}/5
                </Text>
                <Text style={globalStyles.reviewTextPlace}>{review.text}</Text>
              </View>
            ))
        ) : (
          <Text style={globalStyles.noReviewsTextPlace}>
            No reviews available
          </Text>
        )}

        {placeDetails.reviews &&
          displayedReviews < placeDetails.reviews.length && (
            <View style={globalStyles.loadMoreButtonContainerPlace}>
              <TouchableOpacity
                style={globalStyles.loadMoreButtonPlace}
                onPress={loadMoreReviews}
              >
                <Text style={globalStyles.loadMoreButtonTextPlace}>
                  View More Reviews
                </Text>
              </TouchableOpacity>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  );
}
