// In your 'client/js/dashboard.js' file

document.getElementById('movieSearchInput').addEventListener('input', function(e) {
    const query = e.target.value;
    if (query.length > 2) {  // Let's start searching after 2 characters
        // Use debounce technique here to avoid too many API calls
        fetch(`/api/search-movies?query=${encodeURIComponent(query)}`)
            .then(response => response.json())
            .then(data => {
                const suggestionsBox = document.getElementById('suggestionsBox');
                suggestionsBox.innerHTML = '';  // Clear previous suggestions
                data.results.forEach(movie => {
                    const suggestionItem = document.createElement('div');
                    suggestionItem.textContent = movie.title;
                    suggestionItem.addEventListener('click', function() {
                        document.getElementById('movieSearchInput').value = movie.title;
                        suggestionsBox.innerHTML = '';  // Clear suggestions
                        // Save the selected movie data for when "Add Movie" is clicked
                    });
                    suggestionsBox.appendChild(suggestionItem);
                });
            });
    }
});
