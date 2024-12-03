// import { FaReact } from "react-icons/fa";

import { useEffect, useState } from "react";
import Forecast from "./components/Forecast";
import Inputs from "./components/Inputs";
import TempAndDetails from "./components/TempAndDetails";
import TimeAndLocation from "./components/TimeAndLocation";
import TopButtons from "./components/TopButtons";
import getFormattedWeatherData from "./services/weatherService";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// This capitalizeFirstLetter is used to show the City name/Country name in capital letter in pop-up messages.
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {

  const [query, setQuery] = useState({q:"london"});
  const [units, setUnits] = useState('metric');
  const [weather, setWeather] = useState(null);

  const getWeather = async() => {
    
    const cityName = query.q ? query.q : 'current location';
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`);

    await getFormattedWeatherData( {...query, units})
    .then(data => {
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`)
      setWeather(data);
    })
    // console.log(data);
  };

  useEffect(() => {
    getWeather();
  },[query, units]);

  const formatBackground = () => {
    if (!weather) return 'from-cyan-600 to-blue-700';
    const threshold = units === 'metric' ? 20:60
    if(weather.temp <= threshold) return 'from-cyan-600 to-blue-700';
    return "from-yellow-600 to-orange-700";
  }

  return (
    <div className={`mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-xl shadow-gray-400 from-cyan-400 to-cyan-700 ${formatBackground()}`}>
      <TopButtons setQuery= {setQuery}/>
      <Inputs setQuery={setQuery} setUnits={setUnits}/>

      {weather && (
        <>
      <TimeAndLocation weather={weather}/>
      <TempAndDetails weather={weather} units={units}/>
      <Forecast title= "3 hours step forecast" data={weather.hourly}/>
      <Forecast title= "daily forecast" data= {weather.daily}/>
        </>)}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored"/>
    </div>
  );
}

export default App;

// http://openweathermap.org/img/wn/01d@2x.png