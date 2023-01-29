import './futureweather.css'
import { useState } from 'react';
import { useEffect } from 'react';
import Otherdays from './otherdays/Otherdays';
import API_Key2 from '../../apikey2';

const Futureweather = ({reff,options}) => {
const [weatherData,setWeatherData] = useState({});
const [weatherData2,setWeatherData2] = useState({});
const [today, setToday] = useState('')


// UseEffect hook to fetch weather data
useEffect(() => {
getWeatherDataFetch(options);
}, []);


const getWeatherDataFetch = async (options) => {
try {
  // First fetch, to get the snow conditions for the ski resort
  const response = await fetch(`https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=m`, options);
  const jsonData = await response.json();

  // Set the weatherData state to the returned data
  setWeatherData(jsonData);

  // Second fetch, to get the forecast for the ski resort
 const res = await fetch(`https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/forecast?units=m&el=bot`, options)
  const data = await res.json();

  // Set the weatherData2 state to the returned data
  setWeatherData2(data);


// Get today's date and format it to display the day of the week
  const today = new Date();
  const day = today.toLocaleString('default', { weekday: 'long' });
  const capitalizedDay = day.charAt(0).toUpperCase() + day.slice(1);
  setToday(capitalizedDay);   

  // Check if the latitude and longitude are available
  if(jsonData.basicInfo && jsonData.basicInfo.lat && jsonData.basicInfo.lon){
    const response2 = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${jsonData.basicInfo.lon}&lon=${jsonData.basicInfo.lat}&exclude=hourly,minutely&units=metric&appid=${API_Key2}`)
    const data2 = await response2.json();

    // Set the weatherData state to the returned data from OpenWeatherMap
    console.log(data2)
   setWeatherData(data2) 

   
  }
} catch (error) {
  console.log(error);
}
};

return (
<>
<div className="future-forecast">
<div className="today" id="current-temp">
  {
    weatherData && weatherData.daily? <img src={`http://openweathermap.org/img/wn/${weatherData.daily[0].weather[0].icon}@2x.png`} alt="weather icon" className="w-icon"></img>: null

  }         
            <div className="other">         
              {weatherData2.forecast5Day && weatherData2.forecast5Day[0] && 
                <div className="day">{today}</div>}
                <div className="temp">{(weatherData.daily&& weatherData.daily[0] && weatherData.daily[0].temp && weatherData.daily[0].temp.night?`Night ${weatherData.daily[0].temp.night}` :'Loading')}</div>
                <div className="temp"> {(weatherData.daily&& weatherData.daily[0] && weatherData.daily[0].temp && weatherData.daily[0].temp.night? `Day ${weatherData.daily[0].temp.day}` :'Loading')}</div>
                  </div>
                  </div>
                  {weatherData2.forecast5Day && weatherData2.forecast5Day.map((day, idx) => {
                  
                    if(weatherData && weatherData.daily){
                      return <Otherdays key={idx} day={day.dayOfWeek} am={day.am.maxTemp} pm={day.pm.minTemp} icon={weatherData.daily[idx].weather[0].icon}
                    />
                    }
                    
                    })}
                    </div>
                    </>)
}

export default Futureweather