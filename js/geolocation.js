
function geolocationSupport(){
 return 'geolocation' in navigator
}

const defaultOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000000
}

export function getCurrentPosition( options = defaultOptions) {
  if(!geolocationSupport()) throw new Error('No hay soporte de geolocalizacion en el navegador')

 return new Promise( (resolve, reject) => {
    navigator.geolocation.getCurrentPosition( (position) => {
      const lat = position.coords.latitude
      const lon = position.coords.longitude
      resolve(position)
  }, () =>{
      reject(new Error ('no hemos podido obtener tu ubicacion'))
  }, options)
})

}

export async function getLatLong (options = defaultOptions){
  try{
    const {coords: {latitude: lat, longitude: lon}} = await getCurrentPosition(options)
    return {lat, lon, isError: false}
  }catch{
    return { lat: null, lon: null, isError: true }
  }
}