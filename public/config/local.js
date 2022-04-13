// Replace with your Mapbox GL token, if any
const mapboxGlAccessToken =
  'pk.eyJ1IjoiYXBhcmxhdG8iLCJhIjoiY2lzdWt3NDExMGJjeDJucWdlZjlhejg2cSJ9.Q7H91w3CryPadhz9joVezw';

const stylePresets = [
  {
    id: 'mapbox-streets-v10',
    name: 'Mapbox Streets 10',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/streets-v10',
  },
  {
    id: 'mapbox-streets-v11',
    name: 'Mapbox Streets 11',
    type: 'mapbox-gl',
    url: 'mapbox://styles/mapbox/streets-v11',
  },
  {
    id: 'google-maps-standard',
    name: 'Google Maps',
    type: 'google',
    mapId: 'ff6c2c7017ece696',
  },
];

const branchPattern = {
  pattern:
    'https://dq87dqkfyuzms.cloudfront.net/dist/{branch}/variants/{style}/style.json',
  styles: ['gaia_en', 'here_en'],
};

const googleMapsAPIKey = 'AIzaSyCqiMfrT9qcjzrhiwK8Q6oOdJDGaWAvqiQ';

const gazetteer = {
  'Navigation scenarios': [
    { 'Driver views daily itinerary': { pitch: 0, zoom: 10 } },
    { 'Navigation / route overview': { pitch: 0, zoom: 12 } },
    { 'Navigation / turn-by-turn': { pitch: 45, zoom: 15.5 } },
    { 'Navigation / moving fast': { pitch: 50, zoom: 13.5 } },
    { 'Navigation / quickly': { pitch: 50, zoom: 16.75 } },
  ],
  'Gaia English': [
    { Seattle: { zoom: 11.5, center: { lng: -122.35, lat: 47.595 } } },
    { 'loading docks': { zoom: 18, center: { lng: -122.2977, lat: 47.6615 } } },
    { 'parking icon': { zoom: 18, center: { lng: -76.9937, lat: 38.8994 } } },
  ],
};

export default {
  mapboxGlAccessToken,
  googleMapsAPIKey,
  stylePresets,
  branchPattern,
};
