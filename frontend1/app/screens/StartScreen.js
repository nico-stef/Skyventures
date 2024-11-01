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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function StartScreen(props) {
  const navigation = useNavigation();

  state = {
    loadingProgress: new Animated.Value(0),
  };

  Animated.timing(this.state.loadingProgress, {
    toValue: 100,
    duration: 700,
    useNativeDriver: true,
  }).start();

  const loadingProgress = this.state.loadingProgress;

  const opacityClearToVisible = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };
  const moveDown = {
    transform: [
      {
        translateY: loadingProgress.interpolate({
          inputRange: [0, 100],
          outputRange: [-350, 0],
          extrapolate: "clamp",
        }),
      },
    ],
  };

  const moveUp = {
    transform: [
      {
        translateY: loadingProgress.interpolate({
          inputRange: [0, 100],
          outputRange: [350, 0],
          extrapolate: "clamp",
        }),
      },
    ],
  };
  return (
    <LinearGradient
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 1 }}
      colors={["#004aad", "#886ae6"]}
      style={styles.background}
    >
      <SafeAreaView style={styles.logoContainer}>
        <Animated.View style={[opacityClearToVisible, moveDown]}>
          <Image
            source={require("../assets/skyventures-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>SkyVentures</Text>
        </Animated.View>
      </SafeAreaView>

      <SafeAreaView style={styles.registerContainer}>
        <Animated.View style={[opacityClearToVisible, moveUp]}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.registerText}>Get Started</Text>
          </TouchableOpacity>
          <Button
            title="I already have an account"
            color="#000"
            onPress={() => navigation.navigate("Login")}
          ></Button>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    flex: 1,
    flexDirection: "column",
    top: 180,
  },
  logo: {
    width: 240,
    height: 140,
    alignSelf: "center",
  },
  logoText: {
    fontSize: 50,
    alignSelf: "center",
    color: "lightgray",
  },
  registerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 70,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 35,
    elevation: 3,
    backgroundColor: "lightgray",
  },
  registerText: {
    fontSize: 35,
  },
});
