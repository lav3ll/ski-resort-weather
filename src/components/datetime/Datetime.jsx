import './datetime.css';
import { useState, useEffect } from 'react';

const Datetime = ({ reff, options }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState({});
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=i`,
          options
        );
        const jsonData = await response.json();
        setWeatherData(jsonData);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (reff.current.value) {
      fetchData();
    }
  }, [reff, options]);

  const formattedDate = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: undefined,
  });

  const formattedTime = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className='current-info'>
      <div className='date-container'>
        <div className='time' id='time'>
          {formattedTime}
        </div>
        <div className='date' id='date'>
          {formattedDate}
        </div>
        <div className='others' id='current-weather-items'>
          <div className='weather-item'>
            <div>Top Snow Depth:</div>
            <div>
              {weatherData.topSnowDepth ? weatherData.topSnowDepth : 'N/A'}
            </div>
          </div>
          <div className='weather-item'>
            <div>Bottom Snow Depth:</div>
            <div>
              {weatherData.botSnowDepth ? weatherData.botSnowDepth : 'N/A'}
            </div>
          </div>
          <div className='weather-item'>
            <div>Last Snowfall:</div>
            <div>
              {weatherData.lastSnowfallDate
                ? weatherData.lastSnowfallDate
                : 'N/A'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Datetime;
