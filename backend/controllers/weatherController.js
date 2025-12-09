const axios = require('axios');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Get current weather by coordinates
const getCurrentWeather = async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: "Missing latitude or longitude" });
    }

    try {
        const response = await axios.get(
            "https://api.weatherapi.com/v1/current.json",
            {
                params: {
                    key: WEATHER_API_KEY,
                    q: `${latitude},${longitude}`,
                },
            }
        );

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching weather:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
};

module.exports = {
    getCurrentWeather
};
