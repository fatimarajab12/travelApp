const express = require("express");
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config(); // Load environment variables from .env file

app.use(express.json());
app.use(express.static("dist")); // Serve static files from 'dist'
app.use(cors());

// Import functions
const { getCityLoc } = require("./getCityLoc");
const { getWeather } = require("./getWeather");
const { getCityPic } = require("./getCityPic");

const port = 8000;

const username = process.env.USER_NAME; 
const weather_key = process.env.WEATHER_KEY;
const pixabay_key = process.env.PIXABAY_KEY;

// Serve the index.html file
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/dist/index.html");
});

// Get city location
app.post("/getCityLoc", async (req, res) => {
    const { city } = req.body;

    if (!city) {
        return res.status(400).send({ error: "City name is required" });
    }

    try {
        const location = await getCityLoc(city, username);
        res.send(location);
    } catch (error) {
        console.error("Error fetching city location:", error);
        res.status(500).send({ error: "Error fetching city location" });
    }
});

// Get weather data
app.post("/getWeather", async (req, res) => {
    const { lat, lng, Rdays } = req.body;

    try {
        const weather = await getWeather(lat, lng, Rdays, weather_key);
        res.send(weather);
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send({ error: "Error fetching weather data" });
    }
});

// Get city picture
app.post("/getCityPic", async (req, res) => {
    const { city_name } = req.body;

    if (!city_name) {
        return res.status(400).send({ error: "City name is required" });
    }

    try {
        const image = await getCityPic(city_name, pixabay_key);
        res.send(image);
    } catch (error) {
        console.error("Error fetching city picture:", error);
        res.status(500).send({ error: "Error fetching city picture" });
    }
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
