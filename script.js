// API key
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
      
                const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

                const fiveDayWeatherApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
                
            fetch(weatherApiUrl)
            .then(response => response.json())
            .then(weatherData => {
                console.log(weatherData);
                console.log('weather data');
      
                // Update the cityData array
                cityData.push(weatherData);
                    
                // Retrieve the temperature in Kelvin
                let kelvinTemp = weatherData.main.temp;
                    
                // Convert Kelvin to Fahrenheit
                let fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
                    
                // Update HTML elements with weather information
                document.getElementById('cityName').innerHTML = weatherData.name;
                document.getElementById('temperature').innerHTML = "Temp: " + fahrenheitTemp.toFixed(2) + " °F";
                document.getElementById('wind').innerHTML = "Wind Speed: " + weatherData.wind.speed + " mph";
                document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.main.humidity + " %";
            });
            
            // Fetch the weather data
            fetch(fiveDayWeatherApi)
            .then(response => response.json())
            .then(fiveDayWeatherData => {
                console.log(fiveDayWeatherData);
                console.log("five day forecast data");

                // Loop through the forecast data for the next 5 days
                for (let i = 0; i < 5; i++) {
                    const forecastData = fiveDayWeatherData.list[i * 8]; // Update the index to skip 8 data points for each day
                    const date = forecastData.dt_txt;
                    const icon = forecastData.weather[0].icon;
                    const kelvinTemperature = forecastData.main.temp;
                    const fahrenheitTemperature = (kelvinTemperature - 273.15) * 9/5 + 32;
                    const windSpeed = forecastData.wind.speed;
                    const humidity = forecastData.main.humidity;
                  
                    // Create a new div element for each day's forecast
                    const forecastElement = document.createElement('div');
                    forecastElement.innerHTML = `
                      <p>${date}</p>
                      <img src="https://openweathermap.org/img/wn/${icon}.png" alt="Weather Icon">
                      <p>Temperature: ${fahrenheitTemperature} °F</p>
                      <p>Wind Speed: ${windSpeed} mph</p>
                      <p>Humidity: ${humidity} %</p>
                    `;
                  
                    // Append the forecast element to the existing forecastElement div
                    document.getElementById('forecastElement').appendChild(forecastElement);
                  }
            })
            .catch(error => {
                console.log('Error:', error);
            });
        });
            input.value = '';

            // Save the search history to localStorage
            const searchHistoryString = localStorage.getItem('searchHistory');
            const searchHistory = searchHistoryString ? JSON.parse(searchHistoryString) : [];
            searchHistory.push(cityName);
            localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        }
    };

    form.addEventListener('submit', handleFormSubmit);

    // Save search history to localStorage
    if (searchHistoryString) {
        // Parse the search history from string to array
        const searchHistory = JSON.parse(searchHistoryString);

        // Get the search history element
        const searchHistoryElement = document.getElementById('searchHistory');

        // Clear the search history element
        searchHistoryElement.innerHTML = '';

        // Loop through the search history array and create list items
        searchHistory.forEach(cityName => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = cityName;
            link.href = `/search-results.html?q=${cityName}&format=`;
            link.addEventListener('click', handleCityClick); // Add event listener to the link
            listItem.appendChild(link);
            searchHistoryElement.appendChild(listItem);
        });
    }

    // Function to handle city click event
    function handleCityClick(event) {
        event.preventDefault(); // Prevent default link behavior
        const cityName = event.target.textContent; // Get the clicked city name
        
        // Call a function to search the current and future weather data for the clicked city
        searchWeather(cityName);
    }
    
    // Function to search the current and future weather data for a city
    function searchWeather(cityName) {
        const geoApiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;
    
        fetch(geoApiUrl)
        .then(response => response.json())
        .then(geoData => {
            const { lat, lon } = geoData[0];
            
            const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            const fiveDayWeatherApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            
            fetch(weatherApiUrl)
            .then(response => response.json())
            .then(weatherData => {
                console.log(weatherData);
                
                // Update the cityData array
                cityData.push(weatherData);
                
                // Retrieve the temperature in Kelvin
                let kelvinTemp = weatherData.main.temp;
                
                // Convert Kelvin to Fahrenheit
                let fahrenheitTemp = (kelvinTemp - 273.15) * 9/5 + 32;
                
                // Update HTML elements with weather information
                document.getElementById('cityName').innerHTML = weatherData.name;
                document.getElementById('temperature').innerHTML = "Temp: " + fahrenheitTemp.toFixed(2) + " °F";
                document.getElementById('wind').innerHTML = "Wind Speed: " + weatherData.wind.speed + " mph";
                document.getElementById('humidity').innerHTML = "Humidity: " + weatherData.main.humidity + " %";
            })
            .catch(error => {
                console.log('Error:', error);
            });
        })
        .catch(error => {
            console.log('Error:', error);
        });
    }
});