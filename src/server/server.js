const express = require("express");
const app = express();
const cors = require("cors");
const axios = require('axios'); 


require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());
app.use(express.static('dist')); // Serve static files from 'dist'
app.use(cors());

// Import the getCityLoc function
const { getCityLoc } = require("./getCityLoc");

// Import the getWeather function

const { getWeather } = require("./getWeather");

 // Import the getCityPic function
const { getCityPic } = require("./getCityPic");


const port = 8000;

const username = process.env.USER_NAME; // Use process.env to access environment variables
const weather_key = process.env.WEATHER_KEY;
const pixabay_key = process.env.PIXABAY_KEY;

// console.log('Username:', username); // Log the username to verify
// console.log('Weather key:', weather_key);
// console.log('Pixabay key:', pixabay_key); 

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html"); // Serve the index.html file from 'dist'
});

app.post("/getCityLoc", async (req, res) => {
    console.log(req.body);  // Log the full body for debugging
    const { city } = req.body;

    // Check if city exists in the body
    if (!city) {
        return res.status(400).send({ error: "City name is required" });
    }

    try {
        const location = await getCityLoc(city, username);
        res.send(location);  // Send the location data back to the client
    } catch (error) {
        console.error("Error fetching city location:", error);
        res.status(500).send({ error: "Error fetching city location" });
    }
});


app.post("/getWeather", async (req, res) => {
        console.log("Received weather request:");
        console.log(req.body);  
        const {lat , lng ,Rdays} = req.body;
        const weather = await getWeather (lat, lng, Rdays , weather_key);
        console.log(weather);
        res.send(weather);

});
app.post("/getCityPic", async (req, res) => {
    console.log("Received city picture request:");

    // Correct destructuring of 'city_name' from req.body
    const { city_name } = req.body;
    // console.log(city_name, "server.js");  // Should log the city name sent from the client

    if (!city_name) {
        return res.status(400).send({ error: "City name is required" });
    }

    try {
        const image = await getCityPic(city_name, pixabay_key);
        res.send(image);  // Send the image object back to the client
    } catch (error) {
        console.error("Error fetching city picture:", error);
        res.status(500).send({ error: "Error fetching city picture" });
    }
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
