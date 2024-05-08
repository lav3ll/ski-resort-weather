import './country.css';
import { useEffect, useState } from 'react';
import API_Key from '../../apikey';

const Country = ({ reff }) => {
  const [weatherData, setWeatherData] = useState({});

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_Key,
    },
  };

  useEffect(() => {
    const getWeatherDataFetch = async () => {
      try {
        const response = await fetch(
          `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=i`,
          options
        );
        const jsonData = await response.json();
        // console.log(jsonData);
        setWeatherData(jsonData.basicInfo);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    if (reff.current.value) {
      getWeatherDataFetch();
    }
  }, [reff, options]);

  return (
    <div className='place-container'>
      <div className='time-zone' id='time-zone'></div>
      <div id='country' className='country'>
        {weatherData.name}, {weatherData.region}
      </div>
    </div>
  );
};

export default Country;
