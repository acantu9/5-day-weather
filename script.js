const apiKey = 'c7e81f239bf65cf328d2b68e7626567f';

// Get the form element and input field
const form = document.querySelector('#search-form');
const input = document.querySelector('#city-input');

// Add an event listener to the form submission
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the city name entered by the user
    const city = input.value;

    // Construct the URL for the API call
    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

    // Make the API call using fetch()
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    // Process the response data
    console.log(data);
    })
    .catch(error => {
    console.log('Error:', error);
    });

    // Clear the input field after making the API call
    input.value = '';
});