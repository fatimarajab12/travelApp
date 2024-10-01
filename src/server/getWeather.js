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
        console.log('API Response:', data); // Log the API response for debugging

        // Extract the relevant weather details
        const weatherDetails = data?.data?.[data.data.length - 1];

        // Check if weather details are available
        if (!weatherDetails) {
            return { message: "Weather details not available", error: true };
        }

        // Prepare the weather data object
        const weatherData = {
            description: weatherDetails.weather?.description || "No description available",
            temp: weatherDetails.temp,
        };

        // Add additional temperature details for forecasts longer than 7 days
        if (requestedDays > 7) {
            weatherData.app_max_temp = weatherDetails.app_max_temp;
            weatherData.app_min_temp = weatherDetails.app_min_temp;
        }

        return weatherData; // Return the collected weather data

    } catch (error) {
        // Handle errors based on the response
        const errorMessage = error.response
            ? `Error: ${error.response.status} - ${error.response.data}`
            : `Error fetching weather data: ${error.message}`;
        
        return { message: errorMessage, error: true };
    }
};

// Export the getWeather function for use in other modules
module.exports = { getWeather };
