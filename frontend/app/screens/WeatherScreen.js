import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import { getCurrentWeather } from "../functions/weatherFunction";
import { globalStyles } from "../styles/globalStyles";
import {
  getNearbyPlaces,
  getPlacePhotoUrl,
} from "../functions/googlePlacesFunction";

const WeatherScreen = () => {
  const navigation = useNavigation();

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const [places, setPlaces] = useState([]);
    const placeTypeMapping = {
        'Rain': ['restaurant', 'cafe', 'museum', 'theater'],
        'Snow': ['restaurant', 'cafe', 'museum', 'cinema'],
        'Clear': ['park', 'beach', 'hiking'],
        'Cloudy': ['mall', 'art gallery', 'cinema'],
        'Sunny': ['park', 'zoo'],
        'Overcast': ['mall', 'restaurant', 'cafe']
    };

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
      } else {
        // Fall back to current position if last known is unavailable
        const currentLocation = await Location.getCurrentPositionAsync();
        setLocation(currentLocation.coords);
      }
    };

    fetchLocation();
  }, []);

  const getPlaceTypesForWeather = (weatherCondition) => {
    const condition = weatherCondition.toLowerCase();

    switch (condition) {
      case "moderate rain at times":
      case "light rain":
      case "moderate rain":
      case "heavy rain":
      case "heavy rain at times":
        return placeTypeMapping["Rain"];
      case "snow":
      case "light snow":
      case "heavy snow":
      case "patchy snow possible":
      case "blowing snow":
      case "blizzard":
        return placeTypeMapping["Snow"];
      case "clear":
        return placeTypeMapping["Clear"];
      case "cloudy":
      case "partly cloudy":
      case "mist":
      case "fog":
        return placeTypeMapping["Cloudy"];
      case "sunny":
        return placeTypeMapping["Sunny"];
      case "overcast":
      case "patchy rain possible":
        return placeTypeMapping["Overcast"];
      default:
        return ["restaurant", "cafe", "mall"];
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (location) {
        try {
          const response = await getCurrentWeather(
            location.latitude,
            location.longitude
          );
          setWeatherData(response.current.condition.text);
          // console.log(weatherData);

          const placeTypes = getPlaceTypesForWeather(
            response.current.condition.text
          );

          // Fetch nearby places for each recommended place type
          const recommendations = await Promise.all(
            placeTypes.map((type) =>
              getNearbyPlaces(location.latitude, location.longitude, type)
            )
          );

                    const allPlaces = recommendations
                        .map(response => response.results)  //array cu array-uri pt fiecare tip de locatie
                        .flat() //sparge array-ul de tipuri de locatii si raman doar locatiile
                        .filter((place, index, self) => //ex: parcuri se incadreaza si la parc si la outdoor marekt si
                            index === self.findIndex(p => p.place_id === place.place_id)//erau duplicate
                        )

          setPlaces(allPlaces);
        } catch (error) {
          setErrorMsg("Error retrieving weather data");
        }
      }
    };

    fetchWeather();
  }, [location]); // run this effect when location changes

  return (
    <SafeAreaView style={globalStyles.backgroundHome}>
      <View style={globalStyles.weatherConditionWeather}>
        <Text style={{ fontSize: 18, fontWeight: "bold", padding: 5 }}>
          Weather condition: {weatherData}
        </Text>
        <Text style={globalStyles.recommendationsTextWeather}>
          Recomandations based on current weather:
        </Text>
      </View>

      <FlatList
        style={globalStyles.scrollableContainerHome}
        showsVerticalScrollIndicator={false}
        data={places}
        keyExtractor={(item) => item.place_id}
        renderItem={({ item }) => (
          <View style={globalStyles.cardContainerHome}>
            {item.photos && item.photos.length > 0 ? (
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
            ) : (
              <View style={globalStyles.placeToVisitWithoutImageContainerHome}>
                <Text>No Image</Text>
              </View>
            )}
            <View style={globalStyles.cardContent}>
              <Text style={globalStyles.placeNameHome} numberOfLines={3}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14 }}>
                {item.rating ? `${item.rating}/5` : "N/A"}
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
};
export default WeatherScreen;
