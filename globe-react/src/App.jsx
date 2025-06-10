<<<<<<< HEAD
import React from 'react';
import GlobeView from './GlobeView';

function App() {
  return (
    <GlobeView />
=======
import React, { useRef, useEffect, useState } from 'react';
import Globe from 'react-globe.gl';

function App() {
  const globeEl = useRef();
  const [countries, setCountries] = useState([]);

  // Load country data
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => setCountries(data.features))
      .catch(err => console.error('Error loading country data:', err));
  }, []);

  // Initialize globe controls
  useEffect(() => {
    if (globeEl.current) {
      globeEl.current.pointOfView({ altitude: 2.2 });
      const controls = globeEl.current.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.3;
      controls.enableZoom = true;
      controls.enablePan = false;
    }
  }, [countries]);

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#f8f6f0', overflow: 'hidden' }}>
      <Globe
        ref={globeEl}
        width={window.innerWidth}
        height={window.innerHeight}
        backgroundColor="#f8f6f0"
        showAtmosphere={false}
        globeMaterial={new window.THREE.MeshPhongMaterial({ color: '#bdbdbd', flatShading: true })}
        polygonsData={countries}
        polygonCapColor={() => '#bdbdbd'}
        polygonSideColor={() => '#bdbdbd'}
        polygonStrokeColor={() => '#222'}
        polygonStrokeWidth={1.2}
        polygonLabel={() => null}
        onPolygonHover={() => {}}
        onPolygonClick={() => {}}
        polygonsTransitionDuration={0}
      />
    </div>
>>>>>>> f5055b8193c8d7887e59f6bd5801d22725b580e3
  );
}

export default App;
