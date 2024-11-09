import React from "react";
import {
  Text,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/globalStyles";
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
      style={globalStyles.backgroundStart}
    >
      <SafeAreaView style={globalStyles.logoContainerStart}>
        <Animated.View style={[opacityClearToVisible, moveDown]}>
          <Image
            source={require("../assets/skyventures-logo.png")}
            style={globalStyles.logoStart}
          />
          <Text style={globalStyles.logoTextStart}>SkyVentures</Text>
        </Animated.View>
      </SafeAreaView>

      <SafeAreaView style={globalStyles.registerContainerStart}>
        <Animated.View style={[opacityClearToVisible, moveUp]}>
          <TouchableOpacity
            style={globalStyles.registerButtonStart}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={globalStyles.registerTextStart}>Get Started</Text>
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
