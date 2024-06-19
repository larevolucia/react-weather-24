import React, { useState } from "react";
import axios from "axios";
import "./styles/Search.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faLocationDot
} from "@fortawesome/free-solid-svg-icons";
import Weather from "./Weather";

export default function Search() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState({ ready: false });
  const apiKeyWeather = "6bf5993fd6f246de7b98dc6c43d6cd79";
  const apiWeatherEndPoint = "https://api.openweathermap.org/data/2.5/weather";

  function handleResponse(response) {
    setWeatherData({
      ready: true,
      city: response.data.name,
      coordinates: response.data.coord,
      date: response.data.dt,
      icon: response.data.weather[0].icon,
      temperature: response.data.main.temp,
      description: response.data.weather[0].description,
      minTemperature: response.data.main.temp_min,
      maxTemperature: response.data.main.temp_max,
      feelsLike: response.data.main.feels_like,
      wind: response.data.wind.speed,
      humidity: response.data.main.humidity
    });
  }

  const handleSubmit = async (event) => {
    console.log(city);
    event.preventDefault();
    try {
      const apiUrl = `${apiWeatherEndPoint}?q=${city}&units=metric&appid=${apiKeyWeather}`;
      const response = await axios.get(apiUrl);
      handleResponse(response);
    } catch (error) {}
  };
  function handleCityChange(event) {
    setCity(event.target.value);
  }
  function handleLocationError(error) {
    // Error callback
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
      default:
        console.log("Couldn't get location.");
    }
  }

  const fetchWeatherByCoordinates = async (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    try {
      const apiUrl = `${apiWeatherEndPoint}?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKeyWeather}`;
      const response = await axios.get(apiUrl);
      handleResponse(response);
    } catch (error) {}
  };

  function getLocation(event) {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        fetchWeatherByCoordinates(position);
      }, handleLocationError);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  return (
    <main className="Search">
      <form
        className="search-form shadow-sm p-3 mb-3 bg-body rounded"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-3-col">
          <input
            className="form-control"
            id="input"
            type="search"
            value={city}
            placeholder="Search for a city"
            onChange={handleCityChange}
            autoComplete="off"
          />
          <button className="search-button" type="submit">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          <button className="search-button" type="button" onClick={getLocation}>
            <FontAwesomeIcon icon={faLocationDot} />
          </button>
        </div>
      </form>
      <Weather data={weatherData} />
    </main>
  );
}
