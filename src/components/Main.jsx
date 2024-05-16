import './main.css';
import { useState, useRef } from 'react';
import Futureweather from './futureweather/Futureweather';
import Datetime from './datetime/Datetime';
import Country from './country/Country';
import SearchBtn from './search/SearchBtn';

const Main = () => {
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.REACT_APP_API_Key,
    },
  };
  const [isWeatherShown, setWeatherisShown] = useState(false);
  const inputRef = useRef(null);
  const lon = 0;
  const lat = 0;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputRef.current.value !== '') {
      setWeatherisShown((prev) => !prev);
    } else {
      alert('Enter a ski resort');
    }
  };

  return (
    <>
      <div className='container'>
        {isWeatherShown && <Datetime reff={inputRef} options={options} />}
      </div>

      <div className='main-searchbox__container'>
        <div className='main-title'>SKI RESORT FORECAST</div>
        <form
          action='#'
          className='main-searchbox__form'
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            id='searchbox'
            placeholder='Enter the name of a ski resort'
            ref={inputRef}
            required
          />
          <SearchBtn />
        </form>
      </div>
      {isWeatherShown && <Country reff={inputRef} />}
      {isWeatherShown && (
        <Futureweather reff={inputRef} options={options} lat={lat} lon={lon} />
      )}
    </>
  );
};

export default Main;
