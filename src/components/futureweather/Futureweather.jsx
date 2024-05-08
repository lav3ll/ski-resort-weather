import './futureweather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';

// Component to display future weather conditions based on a reference location
const Futureweather = ({ reff, options }) => {
  // State to store different types of weather data
  const [weather, setWeather] = useState({
    conditions: {},
    forecast: {},
    currentWeather: {},
  });

  // State to store the current day of the week
  const [today, setToday] = useState(
    new Date().toLocaleString('default', { weekday: 'long' })
  );

  // States for managing loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Effect to fetch weather data when the reference or options change
  useEffect(() => {
    const fetchWeatherData = async () => {
      // Early exit if no reference value is provided
      if (!reff.current.value) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      // Initialize loading and clear previous errors
      setLoading(true);
      setError('');

      try {
        // Construct the API URL using the reference value
        const apiUrl = `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}`;

        // Parallel requests to fetch conditions and forecast data
        const [conditionsData, forecastData] = await Promise.all([
          axios
            .get(`${apiUrl}/snowConditions?units=m`, options)
            .then((res) => res.data),
          axios
            .get(`${apiUrl}/forecast?units=m&el=bot`, options)
            .then((res) => res.data),
        ]);

        // Check for latitude and longitude in the conditions data
        const { lat, lon } = conditionsData.basicInfo || {};
        if (lat && lon) {
          // Fetch detailed current weather data using coordinates
          const currentWeather = await axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${API_Key2}`
            )
            .then((res) => res.data);

          // Update the weather state with all fetched data
          setWeather({
            conditions: conditionsData,
            forecast: forecastData,
            currentWeather,
          });
        } else {
          // Handle cases where basic location info is incomplete
          setWeather({
            conditions: conditionsData,
            forecast: forecastData,
            currentWeather: {},
          });
          setError('Location details incomplete in API data.');
        }
      } catch (error) {
        // Handle errors and set error state
        console.error('Error fetching weather data:', error);
        setError(
          error.message ||
            'Failed to load weather data. Please try again later.'
        );
      } finally {
        // Ensure loading is set to false once the data fetching completes or fails
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [reff.current.value, options]); // Depend on reference value and options for re-fetching

  // Display loading indicator while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error message if any errors occurred during fetching
  if (error) {
    return <p className='error'>{error}</p>;
  }

  // Render the component with fetched weather data
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
};

export default Futureweather;
