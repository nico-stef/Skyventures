// app.config.js
import 'dotenv/config';

export default ({ config }) => ({
  ...config,

  expo: {
    "name": "SkyVentures",
    "slug": "SkyVentures",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./app/assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./app/assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./app/assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./app/assets/favicon.png"
    },

    // INJECTAREA VARIABILELOR DE MEDIU
    // Aceste variabile vor fi accesibile in aplicatie prin Constants.expoConfig.extra
    extra: {
      GOOGLE_PLACES_API: process.env.GOOGLE_PLACES_API,
      WEATHER_API: process.env.WEATHER_API,
      API_URL: process.env.API_URL
    },

    "plugins": [
      "expo-secure-store"
    ]
  }
});