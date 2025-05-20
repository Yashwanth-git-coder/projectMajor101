mapboxgl.accessToken = mapTOKEN;
const map = new mapboxgl.Map({
container: 'map', // container ID
center: [77.5764, 12.8987], // starting position [lng, lat]. Note that lat must be set between -90 and 90
zoom: 9 // starting zoom
});
