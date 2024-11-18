document.addEventListener('DOMContentLoaded', () => {
    // Attach event listeners
    ['#tab2-sub1-btn', '#tab2-sub2-btn', '#tab2-sub3-btn'].forEach((selector, index) => {
        document.querySelector(selector)?.addEventListener('click', () => {
            const tags = ['acc', 'ev_acc', 'r_int'];
            setSubTab(tags[index]);
        });
    });

    // Initialize map
    initializeMap();
});

let map; // Declare map globally
let dict = { sensors: [], markers: [] };

function initializeMap() {
    fetch('./secrets.json')
        .then((response) => {
            if (!response.ok) throw new Error('Failed to load secrets.json');
            return response.json();
        })
        .then((secrets) => {
            mapboxgl.accessToken = secrets.map.accessToken;

            map = new mapboxgl.Map({
                container: 'map',
                style: secrets.map.style,
                center: [-74.02, 40.75],
                zoom: 13,
            });

            map.on('load', () => {
                map.addSource('trace', { type: 'geojson', data: '/data/sensors.geojson' });

                fetch('./data/sensors.json')
                    .then((response) => {
                        if (!response.ok) throw new Error('Failed to load sensors.json');
                        return response.json();
                    })
                    .then((data) => {
                        dict = data;
                        dict.markers = [];
                        dict.sensors.forEach(addMarker);
                    })
                    .catch((error) => console.error('Error loading sensors data:', error));
            });
        })
        .catch((error) => console.error('Error initializing map:', error));
}

function addMarker(sensor) {
    if (!map) {
        console.error('Map is not initialized');
        return;
    }

    if (!sensor.position || typeof sensor.position.lng !== 'number' || typeof sensor.position.lat !== 'number') {
        console.error(`Invalid position for sensor: ${sensor.name}`);
        return;
    }

    const element = document.createElement('div');
    element.className = 'marker';

    const marker = new mapboxgl.Marker(element)
        .setLngLat([sensor.position.lng, sensor.position.lat])
        .setPopup(addPopup(sensor))
        .addTo(map);

    dict.markers.push({ id: sensor.id, marker });
}

function addPopup(sensor) {
    const popup = new mapboxgl.Popup({ className: 'my-class' })
        .setHTML(`<div class="sensor-popup">
            <h5><b>${sensor.name}</b></h5>
            <p><b>Status:</b> ${sensor.status === 1 ? 'Active' : 'Inactive'}</p>
            <p><b>Location:</b> ${sensor.position.lat.toFixed(5)}, ${sensor.position.lng.toFixed(5)}</p>
            <div id="chart-container">
                <div id="volt-chart"></div>
                <div id="rain-chart"></div>
                <div id="dist-chart"></div>
            </div>
        </div>`);

    popup.on('open', () => {
        console.log(`Opening charts for sensor ID: ${sensor.id}`);
        setCharts(sensor.id); // Trigger chart rendering when the pop-up opens

        // Fix the aria-hidden issue
        const closeButton = popup._container?.querySelector('.mapboxgl-popup-close-button');
        if (closeButton) {
            closeButton.removeAttribute('aria-hidden');
        }
    });

    popup.on('close', () => {
        console.log(`Closing charts for sensor ID: ${sensor.id}`);
        clearCharts(); // Clear charts when the pop-up closes
    });

    return popup;
}


function updateMarkers() {
    dict.markers.forEach(({ id, marker }) => {
        const sensor = findByID(id);
        if (sensor) {
            let color, background;
            switch (sensor.status) {
                case 0:
                    color = '#DCDCDC';
                    background = '#DCDCDC';
                    break;
                case 1:
                    color = '#2b95fe';
                    background = '#004dad';
                    break;
                case 2:
                    color = '#ff4646';
                    background = '#ffabab';
                    break;
                default:
                    color = 'green';
                    background = 'lightgreen';
            }
            marker.getElement().style.setProperty('--sens-col', color);
            marker.getElement().style.setProperty('--sens-bck', background);
        }
    });
}

function findByID(id) {
    return dict.sensors.find((sensor) => sensor.id === id);
}

const charter = {
    sensorId: '',
    intervalIds: {},
    interVal: 60,
};

function clearCharts() {
    Object.values(charter.intervalIds).forEach(({ intV }) => clearInterval(intV));
    charter.intervalIds = {};
}

function setCharts(id) {
    clearCharts();
    charter.sensorId = id;

    const charts = [
        { id: 'volt-chart', min: 0, max: 5, yAxis: 'Voltage', plot: 'Scatter', interval: 0.5, key: 'voltage' },
        { id: 'rain-chart', min: 0, max: 50, yAxis: '[acc] Accumulation (mm)', plot: 'Scatter', interval: 10, key: 'acc' },
        { id: 'dist-chart', min: 300, max: 5000, yAxis: 'Distance (mm) to Ground', plot: 'Scatter', interval: 500, key: 'distance' },
    ];

    console.log(`Rendering charts for sensor ID: ${id}`);
    charts.forEach((spec) => setChart(spec));
}


function setupChart(spec) {
    const uplinks = findByID(charter.sensorId)?.uplinks || [];

    const data = uplinks.map((uplink) => ({
        x: new Date(uplink.time),
        y: parseFloat(uplink[spec.key]),
    }));

    console.log(`Chart data for '${spec.key}':`, data);

    const chart = new ej.charts.Chart({
        series: [{ type: spec.plot, dataSource: data, xName: 'x', yName: 'y', animation: { enable: false } }],
        primaryXAxis: { valueType: 'DateTime', title: 'Time', interval: 10, intervalType: 'Minutes', labelFormat: 'h:m a' },
        primaryYAxis: { minimum: spec.min, maximum: spec.max, interval: spec.interval, title: spec.yAxis },
        tooltip: { enable: true },
        width: '400',
        height: '340',
    });

    chart.appendTo(`#${spec.id}`);
    return { chart, data };
}

function setChart(spec) {
    if (charter.intervalIds[spec.id]) clearInterval(charter.intervalIds[spec.id].intV);

    const setup = setupChart(spec);
    charter.intervalIds[spec.id] = {
        chart: setup.chart,
        dataSeries: setup.data,
        intV: setInterval(() => {
            const newTime = Date.now();
            setup.data.push({ x: new Date(newTime), y: findUplinkData(charter.sensorId, spec.key, newTime, charter.interVal * 1000) });
            setup.data.shift();
            setup.chart.series[0].dataSource = setup.data;
            setup.chart.refresh();
        }, charter.interVal * 1000),
    };
}

function setSubTab(tag) {
    const labels = {
        acc: '[acc] Accumulation (mm)',
        ev_acc: '[ev_acc] Event Accumulation (mm)',
        r_int: '[r_int] RPH (mm)',
    };

    const spec = { id: 'rain-chart', min: 0, max: 50, yAxis: labels[tag], plot: 'Scatter', interval: 10, key: tag };
    setChart(spec);
}

function eventSelection(sensorId, action) {
    console.log(`Event triggered: ${action} for sensor ID: ${sensorId}`);
    
    if (action === 'open') {
        console.log(`Popup opened for sensor ${sensorId}`);
    } else if (action === 'close') {
        console.log(`Popup closed for sensor ${sensorId}`);
    }
}
