import React from 'react';

const Otherdays = ({ day, am, pm, icon }) => {
  return (
    <div className='weather-forecast' id='weather-forecast'>
      <div className='weather-forecast-item'>
        <div className='day'>{day}</div>
        <img
          src={`http://openweathermap.org/img/wn/${icon}@2x.png`}
          alt='weather icon'
          className='w-icon'
        ></img>
        <div className='temp'>Night {pm}</div>
        <div className='temp'>Day {am}</div>
      </div>
    </div>
  );
};

export default Otherdays;
