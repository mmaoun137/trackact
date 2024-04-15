document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Something went wrong with your request!');
        }
    })
    .then(data => {
        alert(data.message);
        if (data.message === "User registered successfully") {
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('username', username);
            window.location.href = 'dashboard.html'; // Redirect to the dashboard page on successful registration
        }
    })
    .catch(error => alert(error.message)); // Display any errors
});
