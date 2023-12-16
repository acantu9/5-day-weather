// Move the API key to a separate configuration file or environment variable
const apiKey = 'c7e81f239bf65cf328d2b68e7626567f';

// Get the form element and input field
const form = document.querySelector('#search-form');
const input = document.querySelector('#city-input');

// Create an array to store city data
const cityData = [];

document.addEventListener('DOMContentLoaded', function() {
    // Function to handle form submission
    const searchHistoryString = localStorage.getItem('searchHistory');

    // Function to handle form submission
    const handleFormSubmit = (event) => {
        event.preventDefault();
      
        const cityName = input.value.trim();
      
        if (cityName) {
          const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
      
          fetch(geoApiUrl)
            .then(response => response.json())
            .then(geoData => {
              const { lat, lon } = geoData[0];
      
              const weatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      
              fetch(weatherApiUrl)
                .then(response => response.json())
                .then(weatherData => {
                    console.log(weatherData);
      
                    // Update the cityData array
                    cityData.push(weatherData);

                    // Assuming the temperature in Kelvin is stored in a variable called kelvinTemp
                    let kelvinTemp = weatherData.list[0].main.temp;

                    // Convert Kelvin to Fahrenheit
                    let fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
      
                    // Update HTML elements with weather information
                    document.getElementById('cityName').innerHTML = weatherData.city.name;


                    // Set the text of an HTML element with the id "temperature" to the converted temperature
                    document.getElementById('temperature').innerHTML = "Temp: " + fahrenheitTemp.toFixed(2) + "°F";

                    //document.getElementById('temperature').innerHTML = "Temp: " + weatherData.list[0].main.temp;
                    document.getElementById('wind').innerHTML = "Wind Speed: " + weatherData.list[0].wind.speed + "mph";
                    document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.list[0].main.humidity + "%";
                })
                .catch(error => {
                  console.log('Error:', error);
                });
            })
            .catch(error => {
              console.log('Error:', error);
            });
      
          input.value = '';
        }
      };

    // Add event listener to the form submit button
    form.addEventListener('submit', handleFormSubmit);

    // Save search history to localStorage
    if (searchHistoryString) {
        // Parse the search history from string to array
        const searchHistory = JSON.parse(searchHistoryString);

        // Get the search history element
        const searchHistoryElement = document.getElementById('searchHistory');

        // Loop through the search history array and create list items
        searchHistory.forEach(cityName => {
            const listItem = document.createElement('li');
            listItem.textContent = cityName;
            searchHistoryElement.appendChild(listItem);
        });
    };
});