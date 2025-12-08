import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StartScreen from "./app/screens/StartScreen";
import LoginScreen from "./app/screens/LoginScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import RegisterScreen from "./app/screens/RegisterScreen";
import HomeScreen from "./app/screens/HomeScreen";
import "react-native-get-random-values";
import WeatherScreen from "./app/screens/WeatherScreen";
import PlaceScreen from "./app/screens/PlaceScreen";
import FavoritesScreen from "./app/screens/FavoritesScreen";
import TripsScreen from "./app/screens/TripsScreen";
import TripDetailScreen from "./app/screens/TripDetailScreen";
import AttractionDetailScreen from "./app/screens/AttractionDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator for authenticated users
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#886ae6',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 90,
          paddingBottom: 15,
          borderTopColor: '#d0d0d0',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          backgroundColor: '#ffffff',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginTop: 4,
          marginBottom: 0,
        },
        tabBarIconStyle: {
          marginTop: 10,
          marginBottom: 0,
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 28, color, marginBottom: 4 }}>🔍</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="TripsTab" 
        component={TripsScreen}
        options={{
          tabBarLabel: 'My Trips',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 28, color, marginBottom: 4 }}>✈️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="WeatherTab" 
        component={WeatherScreen}
        options={{
          tabBarLabel: 'Weather',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 28, color, marginBottom: 4 }}>🌤️</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="FavoritesTab" 
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: 28, color, marginBottom: 4 }}>♥</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

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
        <Stack.Screen name="Home" component={MainTabs} />
        <Stack.Screen name="WeatherScreen" component={WeatherScreen} />
        <Stack.Screen name="PlaceScreen" component={PlaceScreen} />
        <Stack.Screen name="TripDetail" component={TripDetailScreen} />
        <Stack.Screen name="AttractionDetail" component={AttractionDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
