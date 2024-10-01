const axios = require('axios');

// Utility function to construct the Pixabay API URL
const buildPixabayURL = (cityName, apiKey) => {
    // Construct and return the API URL using the provided city name and API key
    return `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(cityName)}&image_type=photo`;
};

// Main function to retrieve a city picture
const getCityPic = async (cityName, apiKey) => {
    const pixabayApiUrl = buildPixabayURL(cityName, apiKey); // Build the API URL

    try {
        // Make a GET request to the Pixabay API
        const { data } = await axios.get(pixabayApiUrl);
        const imageData = data?.hits; // Safely extract hits from response data

        // Determine the image URL: use the first image found or a fallback image
        const imageUrl = (Array.isArray(imageData) && imageData.length > 0) 
            ? imageData[0].webformatURL // Return the URL of the first image
            : "https://via.placeholder.com/150?text=No+Image+Found"; // Fallback image URL
        
        // Return the image as an object
        return { image: imageUrl };

    } catch (error) {
        // Log the error message for debugging
        console.error(`Error fetching city image for "${cityName}":`, error.message);
        
        // Return a placeholder image on error
        return { image: "https://via.placeholder.com/150?text=Error+Fetching+Image" };
    }
};

// Export the getCityPic function for use in other modules
module.exports = { getCityPic };
