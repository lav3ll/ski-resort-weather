import './main.css';
import { useState, useEffect } from 'react';
import Futureweather from './futureweather/Futureweather';
import Datetime from './datetime/Datetime';
import Country from './country/Country';
import { useRef } from 'react';
import SearchBtn from './search/SearchBtn';
import API_Key from '../apikey';

const Main = () => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': API_Key,
    },
  };
  const [isWeatherShown, setWeatherisShown] = useState(false);
  const inputRef = useRef(null);
  const lon = 0;
  const lat = 0;

  function handleSubmit(ref) {
    if (inputRef.current.value !== '') {
      if (setWeatherisShown(true)) {
        setWeatherisShown(false);
      } else {
        setWeatherisShown(false);
        setTimeout(() => {
          setWeatherisShown(true);
        }, 1);
      }
    } else {
      alert('Enter a ski resort');
    }
  }

  return (
    <>
      <div className='container'>
        {isWeatherShown ? <Datetime reff={inputRef} options={options} /> : null}
      </div>

      <div className='main-searchbox__container'>
        <div className='main-title'>SKI RESORT FORECAST</div>
        <form action='#' className='main-searchbox__form'>
          <input
            type='text'
            id='searchbox'
            placeholder='Enter the name of a ski resort'
            ref={inputRef}
            required
          />
          <SearchBtn
            handleSubmit={handleSubmit}
            onSubmit={handleSubmit}
            reff={inputRef}
          />
        </form>
      </div>
      {isWeatherShown ? <Country reff={inputRef} /> : null}

      {}
      {isWeatherShown ? (
        <Futureweather reff={inputRef} options={options} lat={lat} lon={lon} />
      ) : null}
    </>
  );
};

export default Main;
