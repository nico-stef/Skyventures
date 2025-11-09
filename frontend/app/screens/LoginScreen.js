import React, { useState } from "react";
import {
  View,
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
import { globalStyles } from "../styles/globalStyles";
import { Alert } from "react-native";
import * as SecureStore from "expo-secure-store";

var animationDoneLogin = false;

export default function LoginScreen(props) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      animationDoneLogin = false;
      // clear setInterval here and go back if needed
    });

    return unsubscribe;
  }, [navigation]);

  const loadingProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!animationDoneLogin) {
      Animated.timing(loadingProgress, {
        toValue: 100,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        animationDoneLogin = true;
      });
    }
  }, [loadingProgress]);

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
        await SecureStore.setItemAsync("sessionId", result.sessionId);
        await SecureStore.setItemAsync("username", result.username);
        await SecureStore.setItemAsync("userId", result.iduser);
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
        style={globalStyles.backgroundLogin}
      >
        <SafeAreaView style={globalStyles.logoContainerLogin}>
          <Animated.View style={moveDown}>
            <Image
              source={require("../assets/skyventures-logo.png")}
              style={globalStyles.logoLogin}
            />
            <Text style={globalStyles.logoTextLogin}>Welcome Back</Text>
          </Animated.View>
        </SafeAreaView>

        <Animated.View
          style={[opacityClearToVisible, globalStyles.loginContainterLogin, ,]}
        >
          <View style={globalStyles.credintialsContainerLogin}>
            <TextInput
              inputMode="email"
              style={globalStyles.inputControlLogin}
              autoCapitalize="no"
              autoCorrect={false}
              textContentType="oneTimeCode"
              onChangeText={(email) => setForm({ ...form, email })}
              value={form.email}
              placeholder="Email"
            />
            <TextInput
              secureTextEntry
              style={globalStyles.inputControlLogin}
              onChangeText={(password) => setForm({ ...form, password })}
              value={form.password}
              placeholder="Password"
            />

            <TouchableOpacity
              style={globalStyles.loginButtonLogin}
              onPress={handleLogin}
            >
              <Text style={globalStyles.loginTextLogin}>Login</Text>
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
