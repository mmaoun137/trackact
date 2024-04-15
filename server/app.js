require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;
const tmdbBaseUrl = 'https://api.themoviedb.org/3';

let users = {
    'mmaoun': { password: '#Ll1819#' }  // Your hardcoded credentials
};

app.use(cors());  // This enables CORS for all resources on your server

// Correctly serve the client directory using an absolute path
app.use(express.static(path.join(__dirname, '..', 'client')));

app.use(bodyParser.json());

// Login endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username].password === password) {
        res.json({ message: "Login successful", username });
    } else {
        res.status(401).json({ message: "Invalid username or password" });
    }
});

// Register endpoint
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        res.status(409).json({ message: "User already exists" });
    } else {
        users[username] = { password };
        res.json({ message: "User registered successfully", username });
    }
});

// Popular movies endpoint
app.get('/api/popular-movies', async (req, res) => {
    try {
        const response = await axios.get(`${tmdbBaseUrl}/movie/popular`, {
            params: {
                api_key: process.env.TMDB_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular movies', error });
    }
});

// Movie search endpoint
app.get('/api/search-movies', async (req, res) => {
    const query = req.query.query;
    try {
        const response = await axios.get(`${tmdbBaseUrl}/search/movie`, {
            params: {
                api_key: process.env.TMDB_API_KEY,
                query: query
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching search results', error });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
