document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/popular-movies')
        .then(response => response.json())
        .then(data => {
            const movies = data.results;
            const moviesContainer = document.createElement('div');
            movies.forEach(movie => {
                const movieElement = document.createElement('p');
                movieElement.textContent = movie.title;
                moviesContainer.appendChild(movieElement);
            });
            document.body.appendChild(moviesContainer);
        })
        .catch(error => console.error('Error fetching popular movies:', error));
});
