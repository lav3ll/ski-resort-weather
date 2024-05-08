import './futureweather.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';

const Futureweather = ({ reff, options }) => {
  const [weather, setWeather] = useState({
    conditions: {},
    forecast: {},
    currentWeather: {},
  });
  const [today, setToday] = useState(
    new Date().toLocaleString('default', { weekday: 'long' })
  );
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!reff.current.value) return;

      const apiUrl = `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}`;
      try {
        const [conditionsData, forecastData] = await Promise.all([
          axios
            .get(`${apiUrl}/snowConditions?units=m`, options)
            .then((res) => res.data),
          axios
            .get(`${apiUrl}/forecast?units=m&el=bot`, options)
            .then((res) => res.data),
        ]);

        setWeather((prev) => ({
          ...prev,
          conditions: conditionsData,
          forecast: forecastData,
        }));

        if (conditionsData.basicInfo) {
          const { lat, lon } = conditionsData.basicInfo;
          const currentWeather = await axios
            .get(
              `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&appid=${API_Key2}`
            )
            .then((res) => res.data);

          setWeather((prev) => ({ ...prev, currentWeather }));
          console.log(weather);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError('Failed to load weather data. Please try again later.');
      }
    };

    fetchWeatherData();
  }, [reff.current.value, options]);

  return (
    <div className='future-forecast'>
      {error && <p className='error'>{error}</p>}
      <div className='today' id='current-temp'>
        {weather.currentWeather.daily && weather.currentWeather.daily[0] && (
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
