// import weather from '../data/current-weather.js'
import { formatDate, formatTemp } from './utils/format-data.js'
import { weatherConditionsCodes } from './constants.js'
import { getLatLong } from './geolocation.js'
import { getCurrentWeather } from './services/weather.js'


function setCurrentCity($element, city){
  $element.textContent = city
}

function setCurrentDate($element){
  const currentDay = new Date()
  const formattedDate = formatDate(currentDay)
  $element.textContent = formattedDate
}

function setCurrentTemp($element, temp){
  $element.textContent = formatTemp(temp)
}

function solarStatus (sunriseTime, sunsetTime ){
  const currentHours = new Date().getHours()
  const sunriseHours = sunriseTime.getHours()
  const sunsetHours = sunsetTime.getHours()

  if( currentHours < sunriseHours || currentHours > sunsetHours){
    return 'night'
  }
  return 'morning'
}

function setBackground($element, conditionCode, solarStatus){
  const weatherType = weatherConditionsCodes[conditionCode]
  const size = window.matchMedia("(-webkit-min-device-pixel-ratio: 2)").matches ? '@2x' : ''
  $element.style.backgroundImage = `url("./images/${solarStatus}-${weatherType}${size}.jpg")`
}

function showCurrentWeather($app, $loading){
  $app.hidden = false
  $loading.hidden = true
}

function configCurrentWeather(weather){

  // loader
  const $app = document.querySelector('#app')
  const $loading = document.querySelector('#loading')
  showCurrentWeather($app, $loading)

  // date
  const $currentDate = document.querySelector('#current-weather-date')
  setCurrentDate($currentDate)

  // city
  const $currentWeatherCity = document.querySelector('#current-weather-city')
  const city = weather.name
  setCurrentCity($currentWeatherCity, city)

  // temp
 const $currentWeatherTemp = document.querySelector('#current-weather-temp')
 const temp = weather.main.temp
 setCurrentTemp($currentWeatherTemp, temp)
  // background
  const sunriseTime = new Date(weather.sys.sunrise * 1000)
  const sunsetTime = new Date(weather.sys.sunset * 1000)
  const conditionCode = String(weather.weather[0].id).charAt(0)
  setBackground($app, conditionCode, solarStatus(sunriseTime, sunsetTime))
}


export default async function currentWeather(){
  //GEO // API -- WEATHER //CONFIG
    const {lat, lon, isError} = await getLatLong()
    if(isError) return console.log('Upps, ha ocurrido un error ubicandote')
    // console.log(lat, lon)

  // .then((data)=>{
  //   console.log('hemos triunzadoooo', data)
  // })
  // .catch((message)=>{
  //   console.log("no se encontro permiso para la ubicacion")
  // })
  const {isError:currentWeatherError, data: weather} = await getCurrentWeather(lat, lon)
  if(currentWeatherError) return console.log('oh! ha ocurrido un error trayendo los datos del clima')
  configCurrentWeather(weather)
  console.log(weather)
}