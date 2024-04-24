import './futureweather.css';
import { useState, useEffect } from 'react';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';

const Futureweather = ({ reff, options }) => {
  const [weatherData, setWeatherData] = useState({});
  const [weatherData2, setWeatherData2] = useState({});
  const [today, setToday] = useState('');
  useEffect(() => {
    const getWeatherDataFetch = async () => {
      try {
        const response = await fetch(
          `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=m`,
          options
        );
        const jsonData = await response.json();
        setWeatherData(jsonData);

        const res = await fetch(
          `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/forecast?units=m&el=bot`,
          options
        );
        const data = await res.json();
        setWeatherData2(data);

        const today = new Date().toLocaleString('default', { weekday: 'long' });
        setToday(today);

        if (
          jsonData.basicInfo &&
          jsonData.basicInfo.lat &&
          jsonData.basicInfo.lon
        ) {
          const response2 = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${jsonData.basicInfo.lon}&lon=${jsonData.basicInfo.lat}&exclude=hourly,minutely&units=metric&appid=${API_Key2}`
          );
          const data2 = await response2.json();
          console.log(data2);
          setWeatherData(data2);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (reff.current.value) {
      getWeatherDataFetch();
    }
  }, [reff, options]);

  return (
    <div className='future-forecast'>
      <div className='today' id='current-temp'>
        {weatherData && weatherData.daily && weatherData.daily[0] && (
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.daily[0].weather[0].icon}@2x.png`}
            alt='weather icon'
            className='w-icon'
          />
        )}
        <div className='other'>
          {weatherData2.forecast5Day && weatherData2.forecast5Day[0] && (
            <>
              <div className='day'>{today}</div>
              <div className='temp'>
                {weatherData.daily &&
                weatherData.daily[0] &&
                weatherData.daily[0].temp &&
                weatherData.daily[0].temp.night
                  ? `Night ${weatherData.daily[0].temp.night}`
                  : 'Loading'}
              </div>
              <div className='temp'>
                {weatherData.daily &&
                weatherData.daily[0] &&
                weatherData.daily[0].temp &&
                weatherData.daily[0].temp.night
                  ? `Day ${weatherData.daily[0].temp.day}`
                  : 'Loading'}
              </div>
            </>
          )}
        </div>
      </div>
      {weatherData2.forecast5Day &&
        weatherData2.forecast5Day.map((day, idx) => (
          <Otherdays
            key={idx}
            day={day.dayOfWeek}
            am={day.am.maxTemp}
            pm={day.pm.minTemp}
            // icon={weatherData.daily[idx]?.weather[0]?.icon}
          />
        ))}
    </div>
  );
};

export default Futureweather;
