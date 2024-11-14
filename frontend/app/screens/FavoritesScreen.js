import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
import { getPlacePhotoUrl } from "../functions/googlePlacesFunction";
import * as SecureStore from "expo-secure-store";
import { getFavoritePlacesDetails } from "../functions/googlePlacesFunction";
import axios from "axios";

const FavoritesScreen = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    const getUserData = async () => {
      const username = await SecureStore.getItemAsync("username");
      setUsername(username);
      const userId = await SecureStore.getItemAsync("userId");
      setUserId(userId);
    };
    getUserData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (userId) {
        try {
          // Fetch the user's favorites from the backend
          const response = await axios.get(
            `http://192.168.0.103:3000/favorites/${userId}`
          );
          const favoritePlaceIds = response.data.map((fav) => fav.placeId); // Get an array of placeIds
          const favoritePlacesDetails = await getFavoritePlacesDetails(
            favoritePlaceIds
          );

          setFavorites(favoritePlacesDetails);
        } catch (err) {
          console.log("Error fetching favorites: ", err);
        }
      }
    };

    fetchFavorites();
  }, [userId]);

  return (
    <SafeAreaView style={globalStyles.backgroundHome}>
      <View style={globalStyles.weatherConditionWeather}>
        <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
          Your favorite places
        </Text>
        <Text style={globalStyles.recommendationsTextWeather}>
          Your favorite items
        </Text>
      </View>

      <FlatList
        style={globalStyles.scrollableContainerHome}
        showsVerticalScrollIndicator={false}
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={globalStyles.cardContainerHome}
            onPress={() => navigation.navigate("PlaceScreen", { place: item })}
          >
            {item.photoUrl ? (
              <Image
                source={{
                  uri: item.photoUrl,
                }}
                style={globalStyles.placeToVisitImageContainerHome}
              />
            ) : (
              <View style={globalStyles.placeToVisitWithoutImageContainerHome}>
                <Text>No Image</Text>
              </View>
            )}
            <View style={globalStyles.cardContent}>
              <TouchableOpacity>
                <Image
                  source={require("../assets/heart.png")}
                  style={{
                    position: "static",
                    left: 100,
                    bottom: "10%",
                    tintColor: "red",
                    width: 40,
                    height: 40,
                  }}
                />
              </TouchableOpacity>
              <Text style={globalStyles.placeNameHome} numberOfLines={3}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14 }}>
                {item.rating && item.rating !== "No rating"
                  ? `${item.rating}/5`
                  : "N/A"}
              </Text>
              <View style={{ top: 10, flexDirection: "row" }}>
                <Text style={{ fontSize: 14, marginRight: 10, top: 3 }}>
                  Tap to see more
                </Text>
                <Image
                  source={require("../assets/right-arrow.png")}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </View>
            </View>
          </View>
        )}
      />
      <View style={globalStyles.menuContainerHome}>
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <Image
            source={require("../assets/home.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("FavoritesScreen")}
        >
          <Image
            source={require("../assets/compass.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Image
            source={require("../assets/heart.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default FavoritesScreen;
