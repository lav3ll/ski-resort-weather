import './country.css';
import { useEffect, useState } from 'react';

const Country = ({ reff }) => {
  const [weatherData, setWeatherData] = useState({ name: '', region: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': process.env.API_Key,
      },
    };

    const getWeatherDataFetch = async () => {
      if (!reff.current.value.trim()) {
        setError('No location specified');
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=i`,
          options
        );
        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Too many requests - please try again later');
          }
          throw new Error('Failed to fetch weather data');
        }
        const jsonData = await response.json();
        setWeatherData(jsonData.basicInfo || {});
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getWeatherDataFetch();
    // eslint-disable-next-line
  }, [reff.current.value]);

  return (
    <div className='place-container'>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <>
          <div className='time-zone' id='time-zone'>
            {/* Time zone display logic here */}
          </div>
          <div id='country' className='country'>
            {weatherData.name
              ? `${weatherData.name}, ${weatherData.region}`
              : 'No data available'}
          </div>
        </>
      )}
    </div>
  );
};

export default Country;
