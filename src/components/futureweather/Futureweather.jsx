import './futureweather.css';
import { useState, useEffect } from 'react';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';
import axios from axios

const Futureweather = ({ reff, options }) => {
  const [weather, setWeather] = useState({
    conditions: {},
    forecast: {},
    currentWeather: {},
  });
  const [today, setToday] = useState(
    new Date().toLocaleString('default', { weekday: 'long' })
  );

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        if (!reff.current.value) return;

        const apiUrl = `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}`;
        const conditionsResponse = await fetch(
          `${apiUrl}/snowConditions?units=m`,
          options
        );
        const forecastResponse = await fetch(
          `${apiUrl}/forecast?units=m&el=bot`,
          options
        );

        const [conditionsData, forecastData] = await Promise.all([
          conditionsResponse.json(),
          forecastResponse.json(),
        ]);

        setWeather((prev) => ({
          ...prev,
          conditions: conditionsData,
          forecast: forecastData,
        }));

        // Additional call if needed, refactored to avoid unnecessary state updates
        if (conditionsData.basicInfo) {
          const { lat, lon } = conditionsData.basicInfo;
          const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lon}&lon=${lat}&appid=${API_Key2}`
          );

          console.log(weatherResponse);
          const currentWeather = await weatherResponse.json();
          setWeather((prev) => ({ ...prev, currentWeather }));
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [reff.current.value, options]);

  return (
    <div className='future-forecast'>
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
            // Optional: Add icon logic if needed
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
