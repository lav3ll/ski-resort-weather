import './futureweather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';

// Main component to display future weather conditions based on a reference location
const Futureweather = ({ reff, options }) => {
  // State for storing detailed weather data
  const [weather, setWeather] = useState({
    conditions: {},
    forecast: {},
    currentWeather: {},
  });

  // State for the current weekday
  const [today, setToday] = useState(
    new Date().toLocaleString('default', { weekday: 'long' })
  );

  // State for loading and error management
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      // Verify that a reference location is provided
      if (!reff.current.value) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        // Construct the API URL with the location reference
        const apiUrl = `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}`;

        // Perform parallel API requests for conditions and forecast data
        const [conditionsData, forecastData] = await Promise.all([
          axios
            .get(`${apiUrl}/snowConditions?units=m`, options)
            .then((res) => res.data),
          axios
            .get(`${apiUrl}/forecast?units=m&el=bot`, options)
            .then((res) => res.data),
        ]);

        let { lat, lon } = conditionsData.basicInfo || {};

        // Check and correct latitude and longitude values if necessary
        if (!isValidLatLon(lat, lon)) {
          [lat, lon] = [lon, lat]; // Swap latitude and longitude if they are reversed
        }

        if (lat && lon) {
          // Fetch current weather details using valid lat and lon
          const currentWeather = await axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_Key2}`
            )
            .then((res) => res.data);

          // Update the state with the new weather data
          setWeather({
            conditions: conditionsData,
            forecast: forecastData,
            currentWeather,
          });
          console.log(weather);
        } else {
          // Set an error if the location details are incomplete
          setError('Location details incomplete in API data.');
        }
      } catch (error) {
        // Handle API or network errors
        setError(
          error.message ||
            'Failed to load weather data. Please try again later.'
        );
      } finally {
        // Ensure the loading state is updated regardless of the outcome
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [reff.current.value, options]);

  // Display a loading indicator while the data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display an error message if there was a problem fetching the data
  if (error) {
    return <p className='error'>{error}</p>;
  }

  // Render the weather information once it is available
  return renderWeatherComponent(weather, today);
};

// Function to validate latitude and longitude values
function isValidLatLon(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// Function to render the weather component using fetched data
function renderWeatherComponent(weather, today) {
  return (
    <div className='future-forecast'>
      <div className='today' id='current-temp'>
        {weather.currentWeather.daily &&
          weather.currentWeather.daily[0] &&
          weather.currentWeather.daily[0].weather[0] &&
          weather.currentWeather.daily[0].weather[0].icon && (
            <img
              src={`https://openweathermap.org/img/wn/${weather.currentWeather.daily[0].weather[0].icon}@2x.png`}
              alt='weather icon'
              className='w-icon'
            />
          )}
        <div className='other'>
          {weather.forecast.forecast5Day &&
            weather.forecast.forecast5Day[0] && (
              <>
                <div className='day'>{today}</div>
                <div className='temp'>
                  {weather.currentWeather.daily &&
                  weather.currentWeather.daily[0] &&
                  weather.currentWeather.daily[0].temp &&
                  weather.currentWeather.daily[0].temp.night
                    ? `Night ${weather.currentWeather.daily[0].temp.night}`
                    : 'Loading'}
                </div>
                <div className='temp'>
                  {weather.currentWeather.daily &&
                  weather.currentWeather.daily[0] &&
                  weather.currentWeather.daily[0].temp &&
                  weather.currentWeather.daily[0].temp.day
                    ? `Day ${weather.currentWeather.daily[0].temp.day}`
                    : 'Loading'}
                </div>
              </>
            )}
        </div>
      </div>
      {weather.forecast.forecast5Day &&
        weather.forecast.forecast5Day.map((day, idx) => (
          <Otherdays
            key={idx}
            day={day.dayOfWeek}
            am={day.am.maxTemp}
            pm={day.pm.minTemp}
            icon={
              weather.currentWeather.daily &&
              weather.currentWeather.daily[idx]?.weather[0]?.icon
            }
          />
        ))}
    </div>
  );
}

export default Futureweather;
