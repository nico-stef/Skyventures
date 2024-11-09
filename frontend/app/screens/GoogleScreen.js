import React, { useState, useRef } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { SafeAreaView, Text, StyleSheet } from "react-native";

const GooglePlacesInput = () => {
  const [showSuggestions, setShowSuggestions] = useState(false); // Control visibility of suggestions
  const ref = useRef();

  return (
    <SafeAreaView style={styles.container}>
      {/* Other content that should not be affected by the suggestions list */}
      <SafeAreaView style={styles.otherContent}>
        <Text>Some Other Content Below Search</Text>
      </SafeAreaView>

      {/* Google Places Autocomplete Component */}
      <SafeAreaView style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          ref={ref}
          placeholder="Search"
          onPress={(data, details = null) => {
            console.log(data, details);
          }}
          onChangeText={(text) => {
            setShowSuggestions(text.length > 0); // Show suggestions only if there is input
          }}
          query={{
            key: "AIzaSyBk0uay8YDjl8B6qgsADQbobRY19bmpD4M",
            language: "en",
          }}
          styles={{
            textInputContainer: {
              backgroundColor: "rgba(255, 255, 255, 1)",
            },
            textInput: {
              height: 40,
              color: "#5d5d5d",
              fontSize: 16,
            },
            listSafeAreaView: {
              position: "absolute",
              top: 40, // Adjust this based on your layout
              zIndex: 1,
              backgroundColor: "white",
              elevation: 3,
              borderRadius: 5,
              display: showSuggestions ? "flex" : "none", // Control visibility with `display`
            },
          }}
          fetchDetails={true}
        />
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  otherContent: {
    marginTop: 80,
    height: 100,
    backgroundColor: "#d3d3d3",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  autocompleteContainer: {
    position: "absolute",
    top: 20,
    left: 10,
    right: 10,
    zIndex: 1,
  },
});

export default GooglePlacesInput;
