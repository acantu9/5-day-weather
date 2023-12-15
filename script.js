const apiKey = 'c7e81f239bf65cf328d2b68e7626567f';

// Get the form element and input field
const form = document.querySelector('#search-form');
const input = document.querySelector('#city-input');

// Get the city name entered by the user
const city = input.value;

// Construct the URL for the API call
const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;

// Create an array to store city data
const cityData = [];

// Update the city variable each time the form is submitted
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Make the API call using fetch()
    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
    // Process the response data
    console.log(data);

    // Update the city variable and cityData array
    city = data[0].name;
    cityData.push(data[0]);
    })
    .catch(error => {
    console.log('Error:', error);
    });

    // Clear the input field after making the API call
    input.value = '';
});

// Retrieve weather data from the API
fetch(apiUrl)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    // Parse the JSON response and extract relevant information
    const cityName = data.name;
    const temperature = data.main.temp;
    const wind = data.main.wind;
    const humidity = data.main.humidity;

    // Update HTML elements with weather information
    document.getElementById('cityName').innerHTML = cityName;
    document.getElementById('temperature').innerHTML = temperature;
    document.getElementById('wind').innerHTML = temperature;
    document.getElementById('humidity').innerHTML = humidity;
})
.catch(function(error) {
    console.log('Error:', error);
});

