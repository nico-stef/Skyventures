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
import { register } from "../functions/authFunctions";
import { globalStyles } from "../styles/globalStyles";
import { Alert } from "react-native";

var animationDoneRegister = false;

export default function RegisterScreen(props) {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  navigation.addListener("state", () => {
    animationDoneRegister = false;
    //clear setInterval here and go back
  });

  state = {
    loadingProgress: new Animated.Value(0),
  };
  if (animationDoneRegister === false) {
    Animated.timing(this.state.loadingProgress, {
      toValue: 100,
      duration: 700,
      useNativeDriver: true,
    }).start(() => {
      animationDoneRegister = true;
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
        colors={["#004aad", "#886ae6"]}
        style={globalStyles.backgroundRegister}
      >
        <SafeAreaView style={globalStyles.logoContainerRegister}>
          <Animated.View style={moveDown}>
            <Image
              source={require("../assets/skyventures-logo.png")}
              style={globalStyles.logoRegister}
            />
            <Text style={globalStyles.logoTextRegister}>Create Account</Text>
          </Animated.View>
        </SafeAreaView>

        <Animated.View
          style={[
            opacityClearToVisible,
            globalStyles.registerContainterRegister,
            ,
          ]}
        >
          <View style={globalStyles.credintialsContainerRegister}>
            <TextInput
              inputMode="text"
              style={globalStyles.inputControlRegister}
              autoCapitalize="no"
              autoCorrect={false}
              textContentType="oneTimeCode"
              onChangeText={(username) => setForm({ ...form, username })}
              value={form.username}
              placeholder="Username"
            />
            <TextInput
              inputMode="email"
              style={globalStyles.inputControlRegister}
              autoCorrect={false}
              autoCapitalize="no"
              textContentType="oneTimeCode"
              onChangeText={(email) => setForm({ ...form, email })}
              value={form.email}
              placeholder="Email"
            />
            <TextInput
              secureTextEntry
              style={globalStyles.inputControlRegister}
              onChangeText={(password) => setForm({ ...form, password })}
              value={form.password}
              placeholder="Password"
            />

            <TouchableOpacity
              style={globalStyles.registerButtonRegister}
              onPress={handleRegister}
            >
              <Text style={globalStyles.registerTextRegister}>Sign up</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Already have an account? Login here"
            onPress={() => {
              navigation.navigate("Login");
            }}
            color="#000"
          ></Button>
        </Animated.View>
      </LinearGradient>
    </TouchableWithoutFeedback>
  );
}
