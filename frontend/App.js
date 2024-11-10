import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StartScreen from "./app/screens/StartScreen";
import LoginScreen from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RegisterScreen from "./app/screens/RegisterScreen";
import HomeScreen from "./app/screens/HomeScreen";
import "react-native-get-random-values";
import WeatherScreen from "./app/screens/WeatherScreen";
import PlaceScreen from "./app/screens/PlaceScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
