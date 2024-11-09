import { Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { getCurrentWeather } from '../functions/weatherFunction';

const WeatherScreen = () => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [weatherData, setWeatherData] = useState(null);

    useEffect(() => {
        (async () => {
            // Request location permissions
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get current location
            let currentLocation = await Location.getCurrentPositionAsync({});
            setLocation(currentLocation.coords);
        })();
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            if (location) {
                try {
                    const response = await getCurrentWeather(location.latitude, location.longitude);
                    setWeatherData(response.current.condition.text);
                } catch (error) {
                    setErrorMsg('Error retrieving weather data');
                }
            }
        };

        fetchWeather();
    }, [location]); // Run this effect when location changes

    return (
        <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            {errorMsg ? (
                <Text>{errorMsg}</Text>
            ) : (
                <View>
                    {location && (
                        <Text>
                            Latitude: {location.latitude}, Longitude: {location.longitude}
                        </Text>
                    )}
                    {weatherData && (
                        <Text>
                            Weather condition: {weatherData}
                        </Text>
                    )}
                    
                </View>
            )}
        </View>
    );
};
export default WeatherScreen;