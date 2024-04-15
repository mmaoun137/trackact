document.getElementById('subscribeForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username, // pass the username variable here
            password: password  // pass the password variable here
        })
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
            window.location.href = '/login.html'; // Redirect to login page on successful registration
        }
    })
    .catch(error => alert(error.message)); // Display any errors
});
