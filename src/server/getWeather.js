const axios = require('axios'); 

const getWeather = async (lat, lng, Rdays, key) => {
    
    if (Rdays < 0) {
        return {
            message: "Date cannot be in the past",
            error: true
        };
    }

    if (Rdays > 0 && Rdays <= 7) {
        // Request current weather data
        const { data } = await axios.get(`https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lng}&units=M&key=${key}`);
        const { weather, temp } = data.data[data.data.length - 1];
        const { description } = weather;
        return { description, temp };
    } 

    if (Rdays > 7) {
        // Request weather forecast data
        const { data } = await axios.get(`https://api.weatherbit.io/v2.0/forecast/daily?lat=${lat}&lon=${lng}&units=M&days=${Rdays}&key=${key}`);
        const { weather, temp, app_max_temp, app_min_temp } = data.data[data.data.length - 1];
        const { description } = weather;
        return { description, temp, app_max_temp, app_min_temp };
    }
};

module.exports = { getWeather };
