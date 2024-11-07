import React, { useState } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { SearchBar } from "@rneui/themed";
export default function HomeScreen(props) {
  const navigation = useNavigation();

  const [search, setSearch] = useState("");

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

  return (
    <SafeAreaView style={styles.background}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-around",
          flex: 0.15,
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

      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        lightTheme={true}
        value={search}
        placeholderTextColor={"#000"}
        round={true}
        containerStyle={styles.searchBarContainer}
        inputContainerStyle={{ backgroundColor: "#f5f1f8" }}
        inputStyle={{ color: "#000" }}
      />

      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          paddingVertical: 10,
          paddingLeft: 10,
        }}
      >
        Select your next trip
      </Text>
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
  scrollableContainer: {
    flex: 1.5,
    alignSelf: "center",
    width: "90%",
    alignContent: "center",
    marginBottom: 15,
  },
  searchBarContainer: {
    backgroundColor: "#fff",
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
});
