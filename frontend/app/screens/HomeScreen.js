import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";
import {
  getNearbyPlaces,
  getPlacePhotoUrl,
} from "../functions/googlePlacesFunction";
import { globalStyles } from "../styles/globalStyles";
import * as SecureStore from "expo-secure-store";
import { logout } from "../functions/authFunctions";

export default function HomeScreen(props) {
  const navigation = useNavigation();

  const [placeType, setPlaceType] = useState(null); // Get placeType from route params
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);
  const [username, setUsername] = useState("");

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

  useEffect(() => {
    const getUsername = async () => {
      const username = await SecureStore.getItemAsync("username");
      setUsername(username);
    };
    getUsername();
  }, []);

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

  const [search, setSearch] = useState("");
  const data = [
    { label: "Restaurants", value: "restaurant" },
    { label: "Hotels", value: "lodging" },
    { label: "Cafes", value: "cafe" },
    { label: "Parks", value: "park" },
    { label: "Museums", value: "museum" },
    { label: "Gyms", value: "gym" },
    { label: "Hospitals", value: "hospital" },
    { label: "Shops", value: "store" },
  ];
  const handlePlaceTypeSelection = (item) => {
    setValue(item.value); // update selected value
    // Navigate to NearbyPlaces with the selected place type
    setPlaceType(item.value);
  };

  const [value, setValue] = useState(null);
  const updateSearch = (search) => {
    setSearch(search);
  };
  loadingState = {
    loadingProgress: new Animated.Value(0),
  };

  const [favorites, setFavorites] = useState({});

  // Function to toggle favorite status for each item
  const handleAddFavorites = (placeId) => {
    setFavorites((prevFavorites) => ({
      ...prevFavorites,
      [placeId]: !prevFavorites[placeId], // Toggle the favorite status
    }));
  };

  return (
    <SafeAreaView style={globalStyles.backgroundHome}>
      <View style={globalStyles.userContainerHome}>
        <View style={[globalStyles.welcomeContainerHome, { paddingTop: 30 }]}>
          <Text style={{ fontSize: 22, color: "#000" }}>Hello, {username}</Text>
          <Text style={{ fontSize: 16, color: "#888" }}>
            Welcome to Skyventures
          </Text>
        </View>
        <TouchableOpacity
          style={{ flex: 0.2, top: 15 }}
          onPress={() => logout(navigation)}
        >
          <Image
            source={require("../assets/exit.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>

      <Text style={globalStyles.selectYourTripTextHome}>
        Select your next trip
      </Text>
      <View style={globalStyles.autocompleteContainerHome}>
        <Dropdown
          style={globalStyles.dropdownHome}
          placeholderStyle={globalStyles.placeholderStyleHome}
          selectedTextStyle={globalStyles.selectedTextStyleHome}
          inputSearchStyle={globalStyles.inputSearchStyleHome}
          iconStyle={globalStyles.iconStyleHome}
          data={data}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select item"
          searchPlaceholder="Search..."
          value={value}
          onChange={handlePlaceTypeSelection}
        />
      </View>
      <FlatList
        style={globalStyles.scrollableContainerHome}
        data={places}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <View style={globalStyles.cardContainerHome}>
            {item.photos && item.photos.length > 0 ? (
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("PlaceScreen", { place: item })
                }
              >
                <Image
                  source={{
                    uri: getPlacePhotoUrl(
                      item.photos[0].photo_reference,
                      400,
                      400
                    ),
                  }}
                  style={globalStyles.placeToVisitImageContainerHome}
                />
              </TouchableWithoutFeedback>
            ) : (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("PlaceScreen", { place: item })
                }
              >
                <View
                  style={globalStyles.placeToVisitWithoutImageContainerHome}
                >
                  <Text>No Image</Text>
                </View>
              </TouchableOpacity>
            )}
            <View style={globalStyles.cardContent}>
              <TouchableOpacity
                onPress={() => handleAddFavorites(item.place_id)}
              >
                <Image
                  source={require("../assets/heart.png")}
                  style={{
                    position: "static",
                    left: 115,
                    bottom: "25%",
                    tintColor: favorites[item.place_id] ? "red" : "black",
                    width: 40,
                    height: 40,
                  }}
                />
              </TouchableOpacity>

              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("PlaceScreen", { place: item })
                }
              >
                <Text style={globalStyles.placeNameHome} numberOfLines={3}>
                  {item.name}
                </Text>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("PlaceScreen", { place: item })
                }
              >
                <Text style={{ fontSize: 14 }}>
                  {item.rating ? `${item.rating}/5` : "N/A"}
                </Text>
              </TouchableWithoutFeedback>

              <TouchableOpacity
                style={{ top: 10, flexDirection: "row" }}
                onPress={() =>
                  navigation.navigate("PlaceScreen", { place: item })
                }
              >
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
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <View style={globalStyles.menuContainerHome}>
        <TouchableOpacity>
          <Image
            source={require("../assets/home.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("WeatherScreen")}>
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
}
