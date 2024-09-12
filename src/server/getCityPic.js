
//import axios 
const axios = require('axios');

const getCityPic = async (city, key) => {
   
    const { data } = await axios.get(`https://pixabay.com/api/?key=${key}&q=${city}&image_type=photo`)
 
    const image = await data.hits[0] ? await data.hits[0].webformatURL : "https://unsplash.com/photos/beige-concrete-building-near-cars-HhmCIJTLuGY"
    console.log( image ," getCityPic"); 
    if (image) {
        // now i will send an object with single property image
        return { image }
    }
}

module.exports = { getCityPic };
