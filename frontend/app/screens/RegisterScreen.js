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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { register } from "../functions/authFunctions";
import { registerStyles } from "../styles/RegisterStyles";

var animationDoneRegister = false;

export default function RegisterScreen(props) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  React.useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      animationDoneRegister = false;
      // clear setInterval here and go back if needed
    });

    return unsubscribe;
  }, [navigation]);

  const loadingProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (!animationDoneRegister) {
      Animated.timing(loadingProgress, {
        toValue: 100,
        duration: 700,
        useNativeDriver: true,
      }).start(() => {
        animationDoneRegister = true;
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

  const handleRegister = async () => {
    if (!form.email || !form.password || !form.username) {
      Alert.alert("Error", "Please complete all fields");
      return;
    }

    try {
      const result = await register(form.username, form.email, form.password);

      if (result.error) {
        Alert.alert("Register Failed", result.error);
      } else {
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert("Register Failed", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        colors={["#8B5CF6", "#b794f6"]}
        style={registerStyles.background}
      >
        <SafeAreaView style={registerStyles.logoContainer}>
          <Animated.View style={moveDown}>
            <Image
              source={require("../assets/skyventures-logo.png")}
              style={registerStyles.logo}
            />
            <Text style={registerStyles.createAccountText}>Create Account</Text>
          </Animated.View>
        </SafeAreaView>

        <Animated.View style={[opacityClearToVisible, registerStyles.registerContainer]}>
          <View style={registerStyles.credentialsContainer}>
            <TextInput
              inputMode="text"
              style={registerStyles.inputControl}
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="oneTimeCode"
              onChangeText={(username) => setForm({ ...form, username })}
              value={form.username}
              placeholder="Name"
              placeholderTextColor="#999"
            />
            <TextInput
              inputMode="email"
              style={registerStyles.inputControl}
              autoCorrect={false}
              autoCapitalize="none"
              textContentType="oneTimeCode"
              onChangeText={(email) => setForm({ ...form, email })}
              value={form.email}
              placeholder="Email"
              placeholderTextColor="#999"
            />
            <TextInput
              secureTextEntry
              style={registerStyles.inputControl}
              onChangeText={(password) => setForm({ ...form, password })}
              value={form.password}
              placeholder="Password"
              placeholderTextColor="#999"
            />

            <TouchableOpacity
              style={registerStyles.registerButton}
              onPress={handleRegister}
              activeOpacity={0.8}
            >
              <Text style={registerStyles.registerButtonText}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={registerStyles.loginContainer}
            onPress={() => navigation.navigate("Login")}
            activeOpacity={0.7}
          >
            <Text style={registerStyles.loginText}>
              Already have an account? Login here
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}