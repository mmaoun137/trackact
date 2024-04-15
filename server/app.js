require('dotenv').config();  // This line should be at the top of your file

const express = require('express');
const app = express();
const port = 3000;

// Now you can use the API key securely
console.log("TMDB API Key:", process.env.TMDB_API_KEY);

app.use(express.static('../client'));

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
