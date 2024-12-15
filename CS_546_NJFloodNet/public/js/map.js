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
  console.log("Parsing coordinates:", coords); // Debugging
  const [lat, latDir, lon, lonDir] = coords.replace(/[°]/g, '').split(/[\s,]+/);
  return {
    latitude: latDir === 'S' ? -parseFloat(lat) : parseFloat(lat),
    longitude: lonDir === 'W' ? -parseFloat(lon) : parseFloat(lon),
  };
}

// Function to fetch sensor data from the `/sensors` endpoint
function fetchSensorData() {
  try {
    const sensorDataElement = document.getElementById("sensors-data");
    if (!sensorDataElement) {
      throw new Error("Sensor data element not found in the HTML.");
    }
    const sensors = JSON.parse(sensorDataElement.textContent);
    console.log("Fetched sensor data from HTML:", sensors); // Debugging
    return sensors;
  } catch (error) {
    console.error("Error fetching sensor data:", error);
    return [];
  }
}

// Render markers on the map for each sensor
function renderMapMarkers(map, sensorData) {
  sensorData.forEach((sensor) => {
    const { latitude, longitude } = parseCoords(sensor.coords);
    console.log("Rendering marker for:", { latitude, longitude, sensor });

      // Prepend "../public" to the image path if it's relative
      const imageUrl = sensor.image.startsWith("./")
      ? `../public${sensor.image.slice(1)}` // Replace "./" with "../public/"
      : sensor.image;

      const popup = new mapboxgl.Popup().setHTML(`
        <div style="text-align: center;">
          <h3>${sensor.sensorName}</h3>
          <p>Status: ${sensor.status}</p>
          <img src="${sensor.image}" alt="${sensor.sensorName}" style="width: 100%; height: auto; max-width: 150px; border-radius: 8px; margin: 10px 0;">
          <a href="/sensors/${sensor._id}" class="btn btn-primary" style="text-decoration: none; padding: 5px 10px; color: white; background-color: #007bff; border-radius: 4px; margin-top: 10px; display: inline-block;">View Details</a>
        </div>
      `);

    new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .setPopup(popup)
      .addTo(map);
  });
}

// Load and render the map markers when the map is loaded
map.on('load', async () => {
  const sensorData = await fetchSensorData();
  renderMapMarkers(map, sensorData);
});


