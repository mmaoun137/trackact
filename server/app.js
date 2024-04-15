require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// TMDB base URL
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

app.use(express.static('../client'));

// Route to get popular movies
app.get('/api/popular-movies', async (req, res) => {
    try {
        const response = await axios.get(`${tmdbBaseUrl}/movie/popular`, {
            params: {
                api_key: process.env.TMDB_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching data from TMDB', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
