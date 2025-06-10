import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export default function GlobeView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [spinEnabled, setSpinEnabled] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const animationFrameId = useRef(null);

  // Mapbox configuration
  const secondsPerRevolution = 60; // Faster rotation
  const maxSpinZoom = 5;
  const slowSpinZoom = 3;

  useEffect(() => {
    if (map.current) return; // initialize map only once

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe',
      zoom: 2.5,
      center: [1.6889271, 31.7091206],
      minZoom: 1.5,
      maxZoom: 10,
      dragRotate: true,
      dragPan: true,
      scrollZoom: {
        speed: 0.2,
        smooth: true
      }
    });

    map.current.on('style.load', () => {
      // Set fog effect
      map.current.setFog({
        "range": [0.8, 8],
        "color": "rgba(118, 143, 152, 0.40)",
        "horizon-blend": 0.05,
        "high-color": "#244b5a",
        "space-color": "#0e2a33",
        "star-intensity": 0.1
      });

      // Add main countries source
      map.current.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add territories source
      map.current.addSource('territories', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add main country fills
      map.current.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'filter': [
          'all',
          ['!=', ['get', 'name_en'], 'Taiwan'],
          ['!=', ['get', 'name_en'], 'Hong Kong']
        ],
        'paint': {
          'fill-color': '#e0e0e0',
          'fill-opacity': 1
        }
      });

      // Add territory fills
      map.current.addLayer({
        'id': 'territory-fills',
        'type': 'fill',
        'source': 'territories',
        'source-layer': 'country_boundaries',
        'filter': [
          'any',
          ['==', ['get', 'name_en'], 'Taiwan'],
          ['==', ['get', 'name_en'], 'Hong Kong']
        ],
        'paint': {
          'fill-color': '#e0e0e0',
          'fill-opacity': 1
        }
      });

      // Add main country borders
      map.current.addLayer({
        'id': 'country-borders',
        'type': 'line',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'filter': [
          'all',
          ['!=', ['get', 'name_en'], 'Taiwan'],
          ['!=', ['get', 'name_en'], 'Hong Kong']
        ],
        'paint': {
          'line-color': '#000000',
          'line-width': 1
        }
      });

      // Add territory borders
      map.current.addLayer({
        'id': 'territory-borders',
        'type': 'line',
        'source': 'territories',
        'source-layer': 'country_boundaries',
        'filter': [
          'any',
          ['==', ['get', 'name_en'], 'Taiwan'],
          ['==', ['get', 'name_en'], 'Hong Kong']
        ],
        'paint': {
          'line-color': '#000000',
          'line-width': 1
        }
      });

      // Add country labels
      map.current.addLayer({
        'id': 'country-labels',
        'type': 'symbol',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'filter': [
          'all',
          ['!=', ['get', 'name_en'], 'Taiwan'],
          ['!=', ['get', 'name_en'], 'Hong Kong']
        ],
        'layout': {
          'text-field': ['get', 'name_en'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1.5, 12,
            3, 0
          ],
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-anchor': 'center',
          'visibility': [
            'case',
            ['>=', ['zoom'], 3],
            'none',
            'visible'
          ]
        },
        'paint': {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Add territory labels
      map.current.addLayer({
        'id': 'territory-labels',
        'type': 'symbol',
        'source': 'territories',
        'source-layer': 'country_boundaries',
        'filter': [
          'any',
          ['==', ['get', 'name_en'], 'Taiwan'],
          ['==', ['get', 'name_en'], 'Hong Kong']
        ],
        'layout': {
          'text-field': ['get', 'name_en'],
          'text-size': [
            'interpolate',
            ['linear'],
            ['zoom'],
            1.5, 12,
            3, 0
          ],
          'text-allow-overlap': false,
          'text-ignore-placement': false,
          'text-anchor': 'center',
          'visibility': [
            'case',
            ['>=', ['zoom'], 3],
            'none',
            'visible'
          ]
        },
        'paint': {
          'text-color': '#000000',
          'text-halo-color': '#ffffff',
          'text-halo-width': 1
        }
      });

      // Make the map interactive for both countries and territories
      map.current.on('click', ['country-fills', 'territory-fills'], (e) => {
        if (e.features.length > 0) {
          const country = e.features[0];
          setSelectedCountry(country);
          
          // Highlight the clicked country or territory
          if (country.properties.name_en === 'Taiwan' || country.properties.name_en === 'Hong Kong') {
            map.current.setPaintProperty('territory-fills', 'fill-color', [
              'case',
              ['==', ['get', 'name_en'], country.properties.name_en],
              '#ffd700',
              '#e0e0e0'
            ]);
          } else {
            map.current.setPaintProperty('country-fills', 'fill-color', [
              'case',
              ['==', ['get', 'name_en'], country.properties.name_en],
              '#ffd700',
              '#e0e0e0'
            ]);
          }

          // Ensure interaction controls remain enabled
          map.current.scrollZoom.enable();
          map.current.dragRotate.enable();
          map.current.dragPan.enable();
          
          // Reset user interaction state
          setUserInteracting(false);
        }
      });

      // Change cursor on hover for both countries and territories
      map.current.on('mouseenter', ['country-fills', 'territory-fills'], () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', ['country-fills', 'territory-fills'], () => {
        map.current.getCanvas().style.cursor = '';
      });
    });

    // Event listeners for user interaction
    map.current.on('mousedown', () => {
      setUserInteracting(true);
      if (!spinEnabled) {
        map.current.stop();
      }
    });

    map.current.on('mouseup', () => {
      setUserInteracting(false);
      if (spinEnabled) {
        spinGlobe();
      }
    });

    map.current.on('dragend', () => {
      setUserInteracting(false);
      if (spinEnabled) {
        spinGlobe();
      }
    });

    map.current.on('pitchend', () => {
      setUserInteracting(false);
      if (spinEnabled) {
        spinGlobe();
      }
    });

    map.current.on('rotateend', () => {
      setUserInteracting(false);
      if (spinEnabled) {
        spinGlobe();
      }
    });

    map.current.on('moveend', () => {
      if (spinEnabled && !userInteracting) {
        spinGlobe();
      }
    });

    // Reset highlight and interaction state when clicking outside
    map.current.on('click', (e) => {
      if (!e.features || e.features.length === 0) {
        setSelectedCountry(null);
        map.current.setPaintProperty('country-fills', 'fill-color', '#e0e0e0');
        map.current.setPaintProperty('territory-fills', 'fill-color', '#e0e0e0');
        setUserInteracting(false);
        map.current.scrollZoom.enable();
        map.current.dragRotate.enable();
        map.current.dragPan.enable();
      }
    });

    // Start spinning
    spinGlobe();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
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
      
      // Use requestAnimationFrame for smoother animation
      const animate = () => {
        map.current.easeTo({
          center,
          duration: 1000,
          easing: (t) => t, // Linear easing for smoother motion
          essential: true
        });
        animationFrameId.current = requestAnimationFrame(animate);
      };
      
      if (!animationFrameId.current) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    } else if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  };

  const toggleSpin = () => {
    setSpinEnabled(!spinEnabled);
    if (!spinEnabled) {
      spinGlobe();
    } else if (map.current) {
      map.current.stop();
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
        animationFrameId.current = null;
      }
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
      {selectedCountry && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: 5,
          fontFamily: 'Arial, sans-serif',
          zIndex: 1
        }}>
          {selectedCountry.properties.name_en}
        </div>
      )}
    </div>
  );
} 