import React, { useEffect, useRef } from 'react';
import Globe from 'globe.gl';

function App() {
  const globeEl = useRef();

  useEffect(() => {
    globeEl.current.innerHTML = '';

    const globe = Globe()
      .globeImageUrl(null)
      .backgroundColor('#f8f6f0')
      .showAtmosphere(false)
      .width(window.innerWidth)
      .height(window.innerHeight)
      .polygonCapColor(() => '#e0e0e0')
      .polygonSideColor(() => '#e0e0e0')
      .polygonStrokeColor(() => '#404040')
      .polygonLabel(({ properties: d }) => d.ADMIN || d.name)
      .onPolygonHover(hoverD => {
        globe
          .polygonAltitude(d => d === hoverD ? 0.06 : 0.01)
          .polygonCapColor(d => d === hoverD ? '#1976d2' : '#e0e0e0');
        if (hoverD) {
          document.getElementById('countryInfo').textContent = hoverD.properties.ADMIN || hoverD.properties.name;
          document.getElementById('countryInfo').style.display = 'block';
        } else {
          document.getElementById('countryInfo').style.display = 'none';
        }
      })
      .onPolygonClick(clickedD => {
        if (clickedD) {
          document.getElementById('countryInfo').textContent = clickedD.properties.ADMIN || clickedD.properties.name;
          document.getElementById('countryInfo').style.display = 'block';
        }
      });

    globeEl.current.appendChild(globe());

    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(countriesGeoJson => {
        globe.polygonsData(countriesGeoJson.features);
        document.getElementById('loading').style.display = 'none';
      });

    window.addEventListener('resize', () => {
      globe.width(window.innerWidth).height(window.innerHeight);
    });

    return () => {
      globeEl.current.innerHTML = '';
    };
  }, []);

  return (
    <div>
      <div ref={globeEl} id="globeViz" style={{ width: '100vw', height: '100vh' }} />
      <div id="loading" style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        color: '#333', fontFamily: 'Arial, sans-serif', fontSize: '1.2em'
      }}>Loading...</div>
      <div id="countryInfo" style={{
        position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', padding: '10px 20px',
        borderRadius: 5, fontFamily: 'Arial, sans-serif', display: 'none', zIndex: 1000
      }}></div>
    </div>
  );
}

export default App;