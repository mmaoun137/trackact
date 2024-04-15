document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Login successful") {
            localStorage.setItem('loggedIn', true);
            localStorage.setItem('username', username);
            window.location.href = 'dashboard.html'; // Redirect to the dashboard page on successful login
        } else {
            alert(data.message); // Show error message
        }
    });
});
