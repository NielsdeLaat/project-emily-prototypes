import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function GlobeView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);

  // Mapbox configuration
  const secondsPerRevolution = 120;
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/steviegriffindesign/clehjyzbi001k01s201eihjqn',
      projection: 'globe',
      zoom: 2.5,
      center: [1.6889271, 31.7091206]
    });

    map.current.on('style.load', () => {
      map.current.setFog({
        "range": [0.8, 8],
        "color": "rgba(118, 143, 152, 0.40)",
        "horizon-blend": 0.05,
        "high-color": "#244b5a",
        "space-color": "#0e2a33",
        "star-intensity": 0.1
      });
    });

    // Event listeners for user interaction
    map.current.on('mousedown', () => setUserInteracting(true));
    map.current.on('mouseup', () => {
      setUserInteracting(false);
      spinGlobe();
    });
    map.current.on('dragend', () => {
      setUserInteracting(false);
      spinGlobe();
    });
    map.current.on('pitchend', () => {
      setUserInteracting(false);
      spinGlobe();
    });
    map.current.on('rotateend', () => {
      setUserInteracting(false);
      spinGlobe();
    });
    map.current.on('moveend', spinGlobe);

    // Start spinning
    spinGlobe();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  const spinGlobe = () => {
    if (!map.current) return;

    const zoom = map.current.getZoom();
    if (spinEnabled && !userInteracting && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.current.getCenter();
      center.lng -= distancePerSecond;
      map.current.easeTo({ center, duration: 1000, easing: (n) => n });
    }
  };

  const toggleSpin = () => {
    setSpinEnabled(!spinEnabled);
    if (!spinEnabled) {
      spinGlobe();
    } else if (map.current) {
      map.current.stop();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div ref={mapContainer} style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }} />
      <button
        onClick={toggleSpin}
        style={{
          font: "bold 12px/20px 'Helvetica Neue', Arial, Helvetica, sans-serif",
          backgroundColor: '#3386c0',
          color: '#fff',
          position: 'absolute',
          top: 20,
          left: '50%',
          zIndex: 1,
          border: 'none',
          width: 200,
          marginLeft: -100,
          display: 'block',
          cursor: 'pointer',
          padding: '10px 20px',
          borderRadius: 3
        }}
        onMouseOver={(e) => e.target.style.backgroundColor = '#4ea0da'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#3386c0'}
      >
        {spinEnabled ? 'Pause rotation' : 'Start rotation'}
      </button>
    </div>
  );
} 