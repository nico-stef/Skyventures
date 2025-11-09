import React, { useRef, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { StartScreenStyles } from "../styles/StartScreenStyles";

export default function StartScreen() {
  const navigation = useNavigation();

  const loadingProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

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
      style={StartScreenStyles.backgroundStart}
    >
      <SafeAreaView style={StartScreenStyles.logoContainerStart}>
        <Animated.View
          style={[
            opacityClearToVisible,
            moveDown,
            { alignItems: "center", justifyContent: "center", width: "100%" }
          ]}
        >
          <Image
            source={require("../assets/skyventures-logo.png")}
            style={StartScreenStyles.logoStart}
          />
          <Text style={StartScreenStyles.logoTextStart}>SkyVentures</Text>
        </Animated.View>
      </SafeAreaView>

      <SafeAreaView style={StartScreenStyles.registerContainerStart}>
        <Animated.View style={[opacityClearToVisible, moveUp, { width: "100%", alignItems: "center" }]}>
          <TouchableOpacity
            style={StartScreenStyles.registerButtonStart}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.8}
          >
            <Text style={StartScreenStyles.registerTextStart}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={StartScreenStyles.loginButtonStart}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={StartScreenStyles.loginTextStart}>
              I already have an account
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
}