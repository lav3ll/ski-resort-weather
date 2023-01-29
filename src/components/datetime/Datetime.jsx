import './datetime.css'
import { useState,useEffect } from 'react'

// Defining the Datetime functional component and destructuring the props to access the "reff" and "options" values
const Datetime = ({reff,options}) => {
const date = new Date();

// Setting the options for the date format using the toLocaleDateString() method
const options1 = { weekday: 'short', day: 'numeric', month: 'long', year: undefined };
const formattedDate = date.toLocaleDateString('en-US', options1);

const options2 = { hour: '2-digit', minute: '2-digit'};
const formattedTime = date.toLocaleTimeString('en-US', options2);


// Using the useEffect hook to set an interval for updating the time
useEffect(() => {
    const timer = setInterval(() => {
        
    }, 1000);

    return () => {
        clearInterval(timer);
    };
}, []);

const [weatherData,setWeatherData] = useState({})

// UseEffect hook to call the API and fetch the weather data
useEffect(() => {
    getWeatherDataFetch();
  }, []);


  // Function to make an API call to fetch the weather data
  const getWeatherDataFetch = async (ref) => {
    const response = await fetch(`https://ski-resort-forecast.p.rapidapi.com/${reff.current.value}/snowConditions?units=i`, options);
    const jsonData = await response.json();
    console.log(jsonData)
    setWeatherData(jsonData);
    
  };



  return (
    <div className="current-info">
        <div className="date-container">
        <div className="time" id="time">{formattedTime}</div>
        <div className="date" id="date">{formattedDate}</div>
                <div className="others" id="current-weather-items">
                    <div className="weather-item">
                        <div>Top Snow Depth:</div>
                        <div>{weatherData.topSnowDepth?weatherData.topSnowDepth:'N/A'}</div>
                    </div>
                    <div className="weather-item">
                        <div>Bottom Snow Depth:</div>
                        <div>{weatherData.botSnowDepth?weatherData.botSnowDepth:'N/A'}</div>
                    </div>
                    <div className="weather-item">
                        <div>Last Snowfall:</div>
                        <div>{weatherData.lastSnowfallDate? weatherData.lastSnowfallDate:'N/A'}</div>
                    </div>

                </div>
            </div>
    </div>
    
  )
}

export default Datetime