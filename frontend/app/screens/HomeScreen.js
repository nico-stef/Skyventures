import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  Animated,
  Keyboard,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";

export default function HomeScreen(props) {
  const navigation = useNavigation();

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
    navigation.navigate("NearbyPlaces", { placeType: item.value });
  };

  const [value, setValue] = useState(null);
  const updateSearch = (search) => {
    setSearch(search);
  };
  loadingState = {
    loadingProgress: new Animated.Value(0),
  };

  Animated.timing(this.loadingState.loadingProgress, {
    toValue: 100,
    duration: 700,
    useNativeDriver: true,
  }).start();

  const loadingProgress = this.loadingState.loadingProgress;

  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of suggestions
  const ref = useRef();

  useEffect(() => {
    ref.current?.setAddressText("");
  }, []);

  return (
    <SafeAreaView style={styles.background}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          flex: 0.13,
        }}
      >
        <View style={styles.welcomeContainer}>
          <Text style={{ fontSize: 22, color: "#000" }}>Hello, User</Text>
          <Text style={{ fontSize: 16, color: "#888" }}>
            Welcome to Skyventures
          </Text>
        </View>
        <TouchableOpacity
          style={{ flex: 0.2, top: 15 }}
          onPress={() => navigation.navigate("Start")}
        >
          <Image
            source={require("../assets/exit.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          paddingVertical: 5,
          paddingBottom: 40,
          paddingLeft: 10,
        }}
      >
        Select your next trip
      </Text>
      <View style={styles.autocompleteContainer}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
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
      <ScrollView
        style={styles.scrollableContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: "50%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 20,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingLeft: 10,
            }}
          >
            <Text style={{ bottom: 20, fontSize: 16, fontWeight: "bold" }}>
              Titlu la locatie mai lung sa vedem ce se intampla
            </Text>
            <Text style={{ fontSize: 14 }}>rating 4/5</Text>
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
        <View style={styles.cardContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: "50%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 20,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingLeft: 10,
            }}
          >
            <Text style={{ bottom: 20, fontSize: 16, fontWeight: "bold" }}>
              Titlu la locatie mai lung sa vedem ce se intampla
            </Text>
            <Text style={{ fontSize: 14 }}>rating 4/5</Text>
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
        <View style={styles.cardContainer}>
          <Image
            source={require("../assets/icon.png")}
            style={{
              width: "50%",
              height: "100%",
              resizeMode: "cover",
              borderRadius: 20,
            }}
          />
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "flex-start",
              paddingLeft: 10,
            }}
          >
            <Text style={{ bottom: 20, fontSize: 16, fontWeight: "bold" }}>
              Titlu la locatie mai lung sa vedem ce se intampla
            </Text>
            <Text style={{ fontSize: 14 }}>rating 4/5</Text>
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
        <View style={styles.cardContainer} />
        <View style={styles.cardContainer} />
        <View style={styles.cardContainer} />
        <View style={styles.cardContainer} />
      </ScrollView>
      <View style={styles.menuContainer}>
        <TouchableOpacity>
          <Image
            source={require("../assets/home.png")}
            style={{ width: 40, height: 40 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
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

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  cardContainer: {
    height: 150,
    width: "100%",
    backgroundColor: "red",
    marginTop: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "black",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  dropdown: {
    margin: 10,
    height: 40,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  scrollableContainer: {
    flex: 1.5,
    alignSelf: "center",
    width: "90%",
    alignContent: "center",
    marginBottom: 15,
    marginTop: 10,
    zIndex: 0,
  },
  autocompleteContainer: {
    position: "absolute",
    width: "100%",
    top: 160,
    zIndex: 1,
  },
  menuContainer: {
    flex: 0.2,
    width: "80%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 5,
    alignSelf: "center",
    backgroundColor: "pink",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "black",
  },
  welcomeContainer: {
    flex: 1,
    width: "100%",
    padding: 10,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
