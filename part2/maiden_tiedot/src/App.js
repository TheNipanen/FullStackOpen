import { useState, useEffect } from "react";
import axios from 'axios'

const Weather = ({country, api_key}) => {
  const [weather, setWeather] = useState({})

  useEffect(() => {
    axios
      .get(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${country.latlng[0]}&lon=${country.latlng[1]}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${api_key}`
      ).then(response => setWeather(response.data))
  }, [country, api_key])

  if (!api_key || !weather.current) {
    return <div>No weather data</div>
  }
  return (
    <>
      <h2>Weather in {country.capital.length > 0 ? country.capital[0] : country.name.common}</h2>
      <div>temperature {weather.current.temp} Celcius</div>
      <img src={`http://openweathermap.org/img/wn/${weather.current.weather[0].icon}@2x.png`} alt={'No icon'} />
      <div>wind {weather.current.wind_speed} m/s</div>
    </>
  )
}

const Country = ({country, api_key}) => {
  return (
    <>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital.length > 0 ? country.capital[0] : 'None'}</div>
      <div>area {country.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map((lName) => <li key={lName}>{lName}</li>)}
      </ul>
      <img src={country.flags.png} alt={'No flag'} />
      <Weather country={country} api_key={api_key} />
    </>
  )
}

const Countries = ({countries, index, setIndex, api_key }) => {
  if (index > -1) {
    return (
      <Country country={countries[index]} api_key={api_key} />
    )
  }
  
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }
  if (countries.length > 1) {
    return (
      <>
        {countries.map((country, i) => <div key={country.name.official}>{country.name.common}<button onClick={() => setIndex(i)}>show</button></div>)}
      </>
    )
  }
  if (countries.length === 1) {
    return (
      <Country country={countries[0]} api_key={api_key} />
    )
  }
  return <></>
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [countryIndex, setCountryIndex] = useState(-1)

  const api_key = process.env.REACT_APP_API_KEY

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  const setIndex = (i) => setCountryIndex(i)
  const handleSearchChange = (event) => {
    setCountryIndex(-1)
    setSearch(event.target.value)
  }

  return (
    <div>
      find countries<input value={search} onChange={handleSearchChange} />
      <Countries 
        countries={countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()))}
        index={countryIndex}
        setIndex={setIndex}
        api_key={api_key}
      />
    </div>
  )

}

export default App;
