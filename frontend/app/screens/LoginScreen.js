import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  Keyboard,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { login } from "../functions/authFunctions";
import { decodeToken } from "../functions/authHelper";
import { loginStyles } from "../styles/LoginStyles";
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
        // Store token
        await SecureStore.setItemAsync("token", result.token);

        // Decode token to get user info
        const decoded = decodeToken(result.token);
        if (decoded) {
          await SecureStore.setItemAsync("username", decoded.username);
          await SecureStore.setItemAsync("userId", decoded.userId);
        }

        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 1 }}
          colors={["#8B5CF6", "#b794f6"]}
          style={loginStyles.background}
        >
        <SafeAreaView style={loginStyles.logoContainer}>
          <Animated.View style={moveDown}>
            <Image
              source={require("../assets/skyventures-logo.png")}
              style={loginStyles.logo}
            />
            <Text style={loginStyles.welcomeText}>Welcome Back</Text>
          </Animated.View>
        </SafeAreaView>

        <Animated.View style={[opacityClearToVisible, loginStyles.loginContainer]}>
          <View style={loginStyles.credentialsContainer}>
            <TextInput
              inputMode="email"
              style={loginStyles.inputControl}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="oneTimeCode"
              onChangeText={(email) => setForm({ ...form, email })}
              value={form.email}
              placeholder="Email"
              placeholderTextColor="#999"
            />
            <TextInput
              secureTextEntry
              style={loginStyles.inputControl}
              onChangeText={(password) => setForm({ ...form, password })}
              value={form.password}
              placeholder="Password"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={loginStyles.loginButton}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={loginStyles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={loginStyles.registerContainer}
            onPress={() => navigation.navigate("Register")}
            activeOpacity={0.7}
          >
            <Text style={loginStyles.registerText}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}