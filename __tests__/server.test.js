// src/server/server.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8081; // Set default port to 8081

// Other middleware and routes...

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = { app, PORT }; // Exporting the app and PORT
