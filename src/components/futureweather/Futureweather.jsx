import './futureweather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Otherdays from './otherdays/Otherdays';

// Main component to display future weather conditions based on a reference location
const Futureweather = ({ reff, options }) => {
  const [weather, setWeather] = useState({
    conditions: {},
    forecast: {},
    currentWeather: {},
  });

  const today = new Date().toLocaleString('default', { weekday: 'long' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!reff.current.value) {
        setError('Location is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const apiUrl = `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}`;
        const [conditionsData, forecastData] = await Promise.all([
          axios
            .get(`${apiUrl}/snowConditions?units=m`, options)
            .then((res) => res.data),
          axios
            .get(`${apiUrl}/forecast?units=m&el=bot`, options)
            .then((res) => res.data),
        ]);

        let { lat, lon } = conditionsData.basicInfo || {};
        if (!isValidLatLon(lat, lon)) {
          [lat, lon] = [lon, lat];
        }

        if (lat && lon) {
          const currentWeather = await axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.API_Key2}`
            )
            .then((res) => res.data);

          setWeather({
            conditions: conditionsData,
            forecast: forecastData,
            currentWeather,
          });
        } else {
          setError('Location details incomplete in API data.');
        }
      } catch (error) {
        setError(
          error.message ||
            'Failed to load weather data. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [reff.current.value, options]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <p className='error'>{error}</p>;
  }

  return renderWeatherComponent(weather, today);
};

function isValidLatLon(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

function renderWeatherComponent(weather, today) {
  // Ensure that we have forecast data to map over, otherwise display fallback content
  const forecastAvailable =
    weather.forecast.forecast5Day && weather.forecast.forecast5Day.length > 0;

  return (
    <div className='future-forecast'>
      <div className='today' id='current-temp'>
        {weather.currentWeather.daily &&
          weather.currentWeather.daily[0] &&
          weather.currentWeather.daily[0].weather[0] && (
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
      {forecastAvailable &&
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
