require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const fs = require('fs');
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


// Endpoint to fetch movie details from TMDB
app.get('/api/movie-details/:movieId', async (req, res) => {
    const { movieId } = req.params;
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
            params: { api_key: process.env.TMDB_API_KEY }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching movie details', error });
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

app.post('/api/movies', async (req, res) => {
    console.log('Received data:', req.body);  // Debug log
    const { category, movie } = req.body;
    try {
        const message = await modifyMovieFile(category, movies => {
            movies.push(movie);
            return 'Movie added successfully';
        });
        console.log('Modify file success:', message);  // Debug log
        res.json({ message });
    } catch (error) {
        console.error('Failed to modify movie file:', error);  // Error log
        res.status(500).send('Server error');
    }
});



/**
 * Modifies a JSON file related to movie data.
 * @param {string} category The category of movies to modify ('watched' or 'watchlist').
 * @param {Function} modifyFunc The function that modifies the movie data.
 * @returns {Promise<string>} A promise that resolves with a success message.
 */

// Helper function to read movie data from file
function readMovieFile(category) {
    const filePath = path.join(__dirname, `${category}.json`);
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.log(`${filePath} not found, creating new file.`);
                    fs.writeFile(filePath, JSON.stringify([]), (writeErr) => {
                        if (writeErr) {
                            console.error('Error creating new file:', writeErr);
                            return reject(writeErr);
                        }
                        return resolve([]);
                    });
                } else {
                    console.error('Error reading file:', err);
                    return reject(err);
                }
            } else {
                resolve(JSON.parse(data));
            }
        });
    });
}

// Endpoint to get watched movies
app.get('/api/movies/watched', async (req, res) => {
    try {
        const watchedMovies = await readMovieFile('watched');
        res.json(watchedMovies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watched movies', error });
    }
});

// Endpoint to get movies in the watchlist
app.get('/api/movies/watchlist', async (req, res) => {
    try {
        const watchlistMovies = await readMovieFile('watchlist');
        res.json(watchlistMovies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching watchlist movies',error});
    }
});

function modifyMovieFile(category, modifyFunc) {
    const filePath = path.join(__dirname, `${category}.json`);

    return new Promise((resolve, reject) => {
        // First check if the file exists
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                // File does not exist, create it with an empty array
                console.log(`${filePath} does not exist, creating new file.`);
                fs.writeFile(filePath, JSON.stringify([]), (err) => {
                    if (err) {
                        console.error('Error creating new file:', err);
                        return reject(err);
                    }
                    // Proceed with the modification after creating the file
                    processFile(filePath, modifyFunc, resolve, reject);
                });
            } else {
                // File exists, proceed with processing
                processFile(filePath, modifyFunc, resolve, reject);
            }
        });
    });
}

function processFile(filePath, modifyFunc, resolve, reject) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return reject(err);
        }

        let movies = JSON.parse(data.toString() || '[]');
        const result = modifyFunc(movies);

        fs.writeFile(filePath, JSON.stringify(movies, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return reject(err);
            }
            resolve(result);
        });
    });
}




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// ... existing app.js code ...

// Endpoint to delete a movie
app.delete('/api/movies/:category/:movieId', async (req, res) => {
    const { category, movieId } = req.params;
    try {
        const message = await modifyMovieFile(category, movies => {
            const index = movies.findIndex(m => m.id == movieId);
            if (index > -1) {
                movies.splice(index, 1);
                return `Movie with ID ${movieId} deleted successfully from ${category}`;
            } else {
                return `Movie with ID ${movieId} not found in ${category}`;
            }
        });
        res.json({ message });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting movie', error });
    }
});

