import Globe from 'globe.gl';

// Initialize the globe
function initGlobe() {
  // Get DOM elements
  const container = document.getElementById('globeViz');
  const loadingDiv = document.getElementById('loading');
  const countryInfo = document.getElementById('countryInfo');

  // Verify all elements exist
  if (!container || !loadingDiv || !countryInfo) {
    console.error('Required DOM elements not found');
    return;
  }

  // Create the globe instance
  const globe = Globe()
    .globeImageUrl(null)
    .backgroundColor('#f8f6f0')
    .showAtmosphere(false)
    .width(window.innerWidth)
    .height(window.innerHeight)
    .polygonCapColor(() => '#e0e0e0')
    .polygonSideColor(() => '#e0e0e0')
    .polygonStrokeColor(() => '#404040')
    .polygonLabel(({ properties: d }) => d.ADMIN || d.name);

  // Add event handlers
  globe
    .onPolygonHover(hoverD => {
      globe
        .polygonAltitude(d => d === hoverD ? 0.06 : 0.01)
        .polygonCapColor(d => d === hoverD ? '#1976d2' : '#e0e0e0');
      
      if (hoverD) {
        countryInfo.textContent = hoverD.properties.ADMIN || hoverD.properties.name;
        countryInfo.style.display = 'block';
      } else {
        countryInfo.style.display = 'none';
      }
    })
    .onPolygonClick(clickedD => {
      if (clickedD) {
        countryInfo.textContent = clickedD.properties.ADMIN || clickedD.properties.name;
        countryInfo.style.display = 'block';
      }
    });

  // Mount the globe
  container.appendChild(globe());

  // Load country data
  fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(res => res.json())
    .then(countriesGeoJson => {
      globe.polygonsData(countriesGeoJson.features);
      loadingDiv.style.display = 'none';
    })
    .catch(error => {
      loadingDiv.textContent = 'Error loading country data. Please refresh the page.';
      console.error('Error loading GeoJSON country data:', error);
    });

  // Handle window resize
  window.addEventListener('resize', () => {
    globe.width(window.innerWidth).height(window.innerHeight);
  });
}

// Start when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
} 