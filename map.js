  
//esto se llama baseLayers 
const ignurl = 'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png';
const attrign ="<a href='http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2' target='_blank'>Instituto Geográfico Nacional</a> + <a href='http://www.osm.org/copyright' target='_blank'>OpenStreetMap</a>";


// examples
const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

const	mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

const grayscale   = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

const	streets  = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

const ign = L.tileLayer(ignurl,{attribution: attrign});

var map = L.map('map', {
  center: [-40, -50],
  zoom: 4,
  layers: [ign],

});

var baseLayers = {
  "Grayscale": grayscale,
  "Streets": streets,
  "IGN": ign,

};


L.control.layers(baseLayers).addTo(map);



//creo icono
let iconMarker = L.icon({
 iconUrl: 'icon1.png',
 iconSize: [40,-50],
 iconAnchor: [15,30]
})

let iconSpace = L.icon({
 iconUrl: 'space.png',
 iconSize: [40,-50],
 iconAnchor: [15,30]
})


map.doubleClickZoom.disable() // para que no haga zoom cuando hago dblclikc
map.on('dblclick', e => {
let latLng = map.mouseEventToLatLng(e.originalEvent);

L.marker([latLng.lat, latLng.lng], { icon: iconMarker }).addTo(map)
  

console.log(latLng) // data long lat
})


navigator.geolocation.getCurrentPosition(
(pos) => {
  const { coords } = pos
  const { latitude, longitude } = coords
  console.log(coords);
  L.marker([latitude, longitude]).addTo(map)
  .bindPopup('Usted esta aqui')
  .openPopup();

  setTimeout(() => {
    map.panTo(new L.LatLng(latitude, longitude))
  }, 5000)
},
(error) => {
  console.log(error)
},
{
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
})

let marker = null
const updateMap = () => {
const urlISSGeoLocation = 'http://api.open-notify.org/iss-now.json'
fetch(urlISSGeoLocation)
  .then(res => res.json())
  .then(data => {
    if (marker) {
      map.removeLayer(marker)
    }
    const {
      latitude,
      longitude
    } = data.iss_position
    console.log(latitude, longitude)
    marker = L.marker([latitude, longitude], {
      icon: iconSpace
    }).addTo(map)
  })

setTimeout(updateMap, 3000)
}

updateMap()




