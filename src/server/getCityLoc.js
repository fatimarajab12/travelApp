const axios = require("axios");

// Utility function to construct the GeoNames API URL
const buildGeoNamesURL = (city, username) => {
    const encodedCity = encodeURIComponent(city); // Encode the city name for URL safety
    const baseUrl = "https://secure.geonames.org/searchJSON";
    const maxRows = 1; // Set maximum rows to fetch
    return `${baseUrl}?q=${encodedCity}&maxRows=${maxRows}&username=${username}`; // Return the constructed URL
};

// Utility function to extract and structure location data from the API response
const parseLocationData = (data) => {
    if (Array.isArray(data) && data.length > 0) {
        const { name, lat, lng } = data[0]; // Destructure properties from the first element
        return { name, lat, lng }; // Return structured location data
    }
    return null; // Return null if no valid data found
};

// Main function to retrieve the location of a city
const getCityLoc = async (city, username) => {
    const url = buildGeoNamesURL(city, username); // Construct the API URL

    try {
        const response = await axios.get(url); // Fetch data from the API
        const locationData = parseLocationData(response.data.geonames); // Parse the location data

        // Return location data or an error message if city not found
        return locationData ? locationData : { message: "City not found", error: true }; 
    } catch (error) {
        // Handle errors that occur during the API request
        return { message: `Error fetching city data: ${error.message}`, error: true };
    }
};

// Export the getCityLoc function for use in other modules
module.exports = { getCityLoc };
