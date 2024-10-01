const axios = require('axios');

// Helper function to construct the Weatherbit API URL
const buildWeatherbitURL = (latitude, longitude, requestedDays, apiKey) => {
    const baseURL = 'https://api.weatherbit.io/v2.0';
    const endpoint = requestedDays > 7 
        ? `/forecast/daily?lat=${latitude}&lon=${longitude}&units=M&days=${requestedDays}&key=${apiKey}` 
        : `/current?lat=${latitude}&lon=${longitude}&units=M&key=${apiKey}`;
    
    return `${baseURL}${endpoint}`; // Return the full API URL
};

// Main function to get weather data
const getWeather = async (latitude, longitude, requestedDays, apiKey) => {
    
    // Validate the requested days
    if (requestedDays < 0) {
        return { message: "Invalid date: cannot fetch weather for the past.", error: true };
    }

    const apiURL = buildWeatherbitURL(latitude, longitude, requestedDays, apiKey); // Build the API URL

    try {
        const { data } = await axios.get(apiURL); // Make a GET request to the Weatherbit API
        console.log('API Response:', JSON.stringify(data, null, 2)); // Log the API response for debugging

        let weatherDetails;

        // Check if the data is for daily forecasts or current weather
        if (requestedDays > 7) {
            // Daily forecast
            weatherDetails = data?.data?.[data.data.length - 1]; // Last day for longer forecasts
        } else {
            // Current weather
            weatherDetails = data?.data; // For current weather, this should not be an array
        }

        // Check if weather details are available
        if (!weatherDetails) {
            return { message: "Weather details not available", error: true };
        }

        console.log('Weather Details:', weatherDetails); // Print weather details for debugging

        // Prepare the weather data object
        const weatherData = {
            description: weatherDetails.weather?.description || "No description available",
            temp: weatherDetails.temp !== undefined ? weatherDetails.temp : "N/A", // Provide default value if undefined
        };

        // Add additional temperature details for forecasts longer than 7 days
        if (requestedDays > 7) {
            weatherData.app_max_temp = weatherDetails.app_max_temp !== undefined ? weatherDetails.app_max_temp : "N/A";
            weatherData.app_min_temp = weatherDetails.app_min_temp !== undefined ? weatherDetails.app_min_temp : "N/A";
        }

        return weatherData; // Return the collected weather data

    } catch (error) {
        // Handle errors based on the response
        console.error('Error details:', error.response ? error.response.data : error.message); // Log error details
        const errorMessage = error.response
            ? `Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
            : `Error fetching weather data: ${error.message}`;
        
        return { message: errorMessage, error: true };
    }
};

// Export the getWeather function for use in other modules
module.exports = { getWeather };
