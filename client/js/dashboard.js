// In your 'client/js/dashboard.js' file
document.addEventListener('DOMContentLoaded', function() {
    const loggedIn = localStorage.getItem('loggedIn');
    const username = localStorage.getItem('username');
    const loginSubscribeSection = document.getElementById('loginSubscribeSection');
    const userSection = document.getElementById('userSection');
    const usernameTitle = document.getElementById('usernameTitle');

    if (loggedIn && username) {
        if(loginSubscribeSection) loginSubscribeSection.style.display = 'none';
        if(userSection) userSection.style.display = 'block';
        if(usernameTitle) usernameTitle.textContent = username;
    } else {
        window.location.href = 'index.html'; // Redirect to index if not logged in
    }

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('username');
            window.location.href = 'index.html'; // Redirect to index on logout
        });
    }

    const movieSearchInput = document.getElementById('movieSearchInput');
    if (movieSearchInput) {
        movieSearchInput.addEventListener('input', function(e) {
            const query = e.target.value;
            if (query.length > 0) { // Let's start searching after 2 characters
                fetch(`/api/search-movies?query=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        const suggestionsBox = document.getElementById('suggestionsBox');
                        suggestionsBox.innerHTML = ''; // Clear previous suggestions
                        data.results.forEach(movie => {
                            const suggestionItem = document.createElement('div');
                            suggestionItem.textContent = movie.title;
                            suggestionItem.addEventListener('click', function() {
                                movieSearchInput.value = movie.title;
                                suggestionsBox.innerHTML = ''; // Clear suggestions
                                // Save the selected movie data for when "Add Movie" is clicked
                            });
                            suggestionsBox.appendChild(suggestionItem);
                        });
                    }).catch(error => {
                        console.error('Error fetching search results:', error);
                    });
            }
        });
    }
});

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'index.html'; // Redirect to index on logout
}
