import { getWeeklyWeather } from './services/weather.js'
import { getLatLong } from './geolocation.js'
import { formatWeekList } from './utils/format-data.js'
import { createDOM } from './utils/dom.js'
import { createPeriodTime } from './period-time.js'
import draggable from './draggable.js'


function tabPanelTemplate(id){
  return `
   <div class="tabPanel" tabindex="0" aria-labelledby="tab-${id}">
          <div class="dayWeather" id="dayWeather-${id}">
            <ul  class="dayWeather-list" id="dayWeather-list-${id}">

            </ul>
          </div>
        </div>
  `}


function createTabPanel(id){
  const $panel = createDOM(tabPanelTemplate(id))
  if(id > 0){
    $panel.hidden = true
  }
  return $panel
}

function configWeeeklyWeather(weekList){
  const $container = document.querySelector('.tabs')
  weekList.forEach( (day, index)=>{
    const $panel = createTabPanel(index)
    $container.append($panel)
    day.forEach((weather, indexWeather)=>{
      const dayWeatherList = $panel.querySelector('.dayWeather-list')
      dayWeatherList.append(createPeriodTime(weather))
    })
  } )
}

export default async function WeeklyWeather(){
  const $container = document.querySelector('.weeklyWeather')
   const {lat, lon, isError} = await getLatLong()
    if(isError) return console.log('Upps, ha ocurrido un error ubicandote')

  const {isError:WeeklyWeatherError, data: weather} = await getWeeklyWeather(lat, lon)
  if(WeeklyWeatherError) return console.log('oh! ha ocurrido un error trayendo los datos del pronostico del clima')
  const weekList = formatWeekList(weather.list)
  configWeeeklyWeather(weekList)
  draggable($container)

}