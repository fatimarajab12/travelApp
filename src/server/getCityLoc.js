
// const axios = require("axios");
const axios = require("axios");
const getCityLoc = async (city, username) => {
    
        const response = await axios.get(`https://secure.geonames.org/searchJSON?q=${city}&maxRows=1&username=${username}`);
        const { geonames } = response.data;
            const { name, lat, lng } = geonames[0];
            return { name, lat, lng };
      
};

module.exports = { getCityLoc };
