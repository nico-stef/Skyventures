import React, { useState, setState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Image,
  Button,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { login } from "../functions/authFunctions";
import { Alert } from "react-native";

var animationDoneLogin = false;

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  navigation.addListener("state", () => {
    animationDoneLogin = false;
    //clear setInterval here and go back
  });

  state = {
    loadingProgress: new Animated.Value(0),
  };
  if (animationDoneLogin === false) {
    Animated.timing(this.state.loadingProgress, {
      toValue: 100,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      animationDoneLogin = true;
    });
  }

  const loadingProgress = this.state.loadingProgress;

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

  const opacityClearToVisible = {
    opacity: loadingProgress.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    }),
  };

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      const result = await login(form.email, form.password);

      if (result.error) {
        Alert.alert("Login Failed", result.error);
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={["#004aad", "#886ae6"]}
        style={styles.background}
      >
        <SafeAreaView style={styles.logoContainer}>
          <Animated.View style={moveDown}>
            <Image
              source={require("../assets/skyventures-logo.png")}
              style={styles.logo}
            />
            <Text style={styles.logoText}>Welcome Back</Text>
          </Animated.View>
        </SafeAreaView>

        <Animated.View
          style={[opacityClearToVisible, styles.loginContainter, ,]}
        >
          <View style={styles.credintialsContainer}>
            <TextInput
              inputMode="email"
              style={styles.inputControl}
              autoCapitalize="no"
              autoCorrect={false}
              textContentType="oneTimeCode"
              onChangeText={(email) => setForm({ ...form, email })}
              value={form.email}
              placeholder="Email"
            />
            <TextInput
              secureTextEntry
              style={styles.inputControl}
              onChangeText={(password) => setForm({ ...form, password })}
              value={form.password}
              placeholder="Password"
            />

            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Don't have an account? Register here"
            onPress={() => navigation.navigate("Register")}
            color="#000"
          ></Button>
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
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
  credintialsContainer: {
    height: 220,
    width: "100%",
    justifyContent: "space-around",
    bottom: 25,
  },
  loginContainter: {
    flex: 1,
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    flex: 0.5,
    flexDirection: "column",
    top: 90,
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

  loginButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 250,
    height: 70,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 35,
    elevation: 3,
    backgroundColor: "lightgray",
    alignSelf: "center",
    top: 10,
  },
  loginText: {
    fontSize: 35,
  },
  inputControl: {
    height: 50,
    width: 250,
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "white",
    alignSelf: "center",
    fontSize: 20,
  },
});
