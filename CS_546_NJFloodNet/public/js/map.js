/**
 * map.js
 *
 * Tasks:
 * 1. Render an interactive map showing sensor locations.
 * 2. Fetch sensor data from the backend and display it on the map.
 */
/**
 * Render the interactive map and display sensor data dynamically.
 */

console.log('Mapbox loaded', typeof mapboxgl)

// Add your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoidnBlbm5hY2giLCJhIjoiY200ajRlZXQ1MDh4YTJrb2J6MzI5ZTV1YiJ9.-Hy99PYYDlTMXFMMYpw1Ow'; // Replace with your actual token

// Initialize the map
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v12',
  center: [-74.0327, 40.7441],
  zoom: 9.5,
});

// Helper function to convert degrees format to numeric latitude and longitude
function parseCoords(coords) {
  const [lat, latDir, lon, lonDir] = coords
    .replace(/[°]/g, '')
    .split(/[\s,]+/);

  return {
    latitude: latDir === 'S' ? -parseFloat(lat) : parseFloat(lat),
    longitude: lonDir === 'W' ? -parseFloat(lon) : parseFloat(lon),
  };
}

// Hardcoded sensor data (FOR TESTING)
const sensorData = [
  {
    _id: "607f1f77bcf86cd799439012",
    sensorNumber: 1,
    sensorName: "Stevens-GWS",
    addedBy: "507f1f77bcf86cd799439011",
    coords: "40.7440° N, 74.0324° W",
    location: "Stevens",
    status: "Active",
    measurements: ["measurement_01", "measurement_02"],
    notes: ["notes_01", "notes_02"],
  },
  {
    _id: "607f1f77bcf86cd799439013",
    sensorNumber: 2,
    sensorName: "Hoboken-West",
    addedBy: "507f1f77bcf86cd799439012",
    coords: "40.7480° N, 74.0350° W",
    location: "Hoboken",
    status: "Inactive",
    measurements: ["measurement_03", "measurement_04"],
    notes: ["notes_03"],
  },
  {
    _id: "607f1f77bcf86cd799439014",
    sensorNumber: 3,
    sensorName: "JerseyCity-South",
    addedBy: "507f1f77bcf86cd799439013",
    coords: "40.7280° N, 74.0770° W",
    location: "Jersey City",
    status: "Maintenance Required",
    measurements: ["measurement_05"],
    notes: ["notes_04", "notes_05"],
  },
];

// Parse coordinates and add `latitude` and `longitude` fields
const formattedSensorData = sensorData.map((sensor) => {
  const { latitude, longitude } = parseCoords(sensor.coords);
  return {
    ...sensor,
    latitude,
    longitude,
  };
});

// Render markers on the map for each sensor
function renderMapMarkers(map, sensorData) {
  sensorData.forEach((sensor) => {
    const { latitude, longitude, sensorName, status } = sensor;

    const popup = new mapboxgl.Popup().setHTML(`
      <h3>${sensorName}</h3>
      <p>Status: ${status}</p>
    `);

    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);
  });
}

// Display sensor details in a popup
function showSensorPopup(sensor) {}

// Render the hardcoded sensor data when the map is loaded
map.on('load', () => {
  renderMapMarkers(map, formattedSensorData);
});


