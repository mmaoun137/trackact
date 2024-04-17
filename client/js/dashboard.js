

// Event listener for when the document is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document loaded, initializing movie load.'); // Log when the document is ready
    loadMovies();  // Load movies for both categories when the page loads

    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
    const loginSubscribeSection = document.getElementById('loginSubscribeSection');
    const userSection = document.getElementById('userSection');
    const usernameTitle = document.getElementById('usernameTitle');

    // Setup user interface based on login status
    if (loggedIn && username) {
        if(loginSubscribeSection) loginSubscribeSection.style.display = 'none';
        if(userSection) userSection.style.display = 'block';
        if(usernameTitle) usernameTitle.textContent = username;
    } else {
        window.location.href = 'index.html'; // Redirect to index if not logged in
    }

    // Setup event listeners for user interactions
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }

    const movieSearchInput = document.getElementById('movieSearchInput');
    if (movieSearchInput) {
        movieSearchInput.addEventListener('input', handleSearchInput);
    }

    const addMovieBtn = document.getElementById('addMovieBtn');
    if (addMovieBtn) {
        addMovieBtn.addEventListener('click', promptAddMovie);
    }
});

// Logout function clears local storage and redirects user
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Handles live search input for movie suggestions
function handleSearchInput(e) {
    const query = e.target.value;
    const suggestionsBox = document.getElementById('suggestionsBox');
    if (query.length > 0) {
        fetch(`/api/search-movies?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                suggestionsBox.innerHTML = '';
                data.results.forEach(movie => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = movie.title;
                    suggestionItem.onclick = () => {
                        movieSearchInput.value = movie.title;
                        movieSearchInput.dataset.selectedMovie = JSON.stringify(movie);
                        suggestionsBox.innerHTML = '';
                    };
                    suggestionsBox.appendChild(suggestionItem);
                });
            }).catch(error => {
                console.error('Error fetching search results:', error);
            });
    } else {
        suggestionsBox.innerHTML = '';
    }
}

// Prompt user to add movie to a category
function promptAddMovie() {
    const movieData = JSON.parse(document.getElementById('movieSearchInput').dataset.selectedMovie || '{}');
    if (!movieData.title) {
        alert('Please select a movie first!');
        return;
    }
    console.log('Selected Movie:', movieData);
    const category = confirm('Add to Watched? Cancel for Watchlist.') ? 'watched' : 'watchlist';
    console.log('Selected Category:', category);
    addMovieToCategory(movieData, category);
}

// Send selected movie to server to add to a category
function addMovieToCategory(movie, category) {
    console.log('Sending movie to category:', category, movie);
    fetch(`/api/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, movie }),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Server response:', result);
        alert(result.message);
        loadMovies();  // Refresh movie lists to show the newly added movie
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Load movies for both categories when the page loads
function loadMovies() {
    ['watched', 'watchlist'].forEach(category => {
        const container = document.getElementById(`${category}Movies`);
        console.log(`Loading movies for category: ${category}`);
        fetch(`/api/movies/${category}`)
        .then(response => response.json())
        .then(movies => {
            console.log(`Movies received for ${category}:`, movies);
            container.innerHTML = '';
            // Example within loadMovies
movies.forEach(movie => {
    const movieCard = createMovieCard(movie, category); // Pass category here
    container.appendChild(movieCard);
});

        })
        .catch(error => {
            console.error(`Failed to load movies from ${category}:`, error);
        });
    });
}

// Fetch and display movie details from movie ID
// Fetch and display movie details from movie ID
function fetchMovieDetails(movieId, container) {
    console.log(`Fetching details for movie ID: ${movieId}`);
    // Use the correct endpoint from the server API to fetch movie details
    fetch(`/api/movie-details/${movieId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(movie => {  // Here it should be 'movie' not 'movies'
        console.log(`Details received for movie ID ${movieId}:`, movie);
        const card = createMovieCard(movie); // Call 'createMovieCard' with 'movie'
        container.appendChild(card);
    })
    .catch(error => {
        console.error(`Error fetching movies for movie ID ${movieId}:`, error.message);
    });
}

// Use this updated function in place of the old one in your 'dashboard.js'



// Create a movie card element for the UI
// Create a movie card element for the UI
function createMovieCard(movie, category) {
    console.log(`Creating movie card for:`, movie.title);
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <div class="delete-btn" onclick="confirmDeleteMovie(${movie.id}, '${category}')">X</div>
        <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="${movie.title}" class="movie-poster">
        <h3>${movie.title}</h3>
        
    `;
    // ... rest of your card creation code ...
    return card;
}



// Function to confirm movie deletion


// Function to delete a movie
// Delete a movie from the category list
function deleteMovie(movieId, category) {
 {
        // Correct the endpoint to include both the category and movie ID
        fetch(`/api/movies/${category}/${movieId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(result => {
            alert(result.message);
            loadMovies(); // Refresh the movie lists
        })
        .catch(error => {
            console.error('Failed to delete the movie:', error);
            alert('An error occurred while attempting to delete the movie.');
        });
    }
}

function confirmDeleteMovie(movieId, category) {
    if (confirm('Are you sure you want to delete this movie?')) {
        deleteMovie(movieId, category);
    }
}






