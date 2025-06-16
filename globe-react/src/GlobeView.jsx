import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Import images
import ablikimImg from './img/Ablikim.png';
import emilyImg from './img/Emily.png';
import carlosImg from './img/Carlos.png';
import barryImg from './img/Barry.png';
import tyroneImg from './img/Tyrone.png';
import eunjuImg from './img/Eunju_Kim.png';
import kikonyogoImg from './img/Kikonyogo_Kivumbi.png';

// Categories for filtering
const categories = {
  religious: { label: "Religious Persecution", icon: "⛪" },
  lgbtq: { label: "LGBTQ+ Rights", icon: "🏳️‍🌈" },
  racism: { label: "Racial Discrimination", icon: "✊" },
  political: { label: "Political Oppression", icon: "🗳️" },
  gender: { label: "Gender Rights", icon: "♀️" },
  refugee: { label: "Refugee Status", icon: "🏃" }
};

// Story data with locations and categories
const sidebarItems = [
  {
    id: 1,
    title: "Ablikim",
    description: "Zijn geloof werd verboden, zijn arbeid gestolen, zijn identiteit uitgewist , toch wist hij te ontsnappen.",
    image: ablikimImg,
    location: {
      name: "Xinjiang Village",
      coordinates: [87.6177, 43.7928], // Urumqi, Xinjiang
      country: "China"
    },
    categories: ["religious", "political"]
  },
  {
    id: 2,
    title: "Emily",
    description: "Gewapend met een stem en een masker trotseerde ze traangas en stilte — en vond vrijheid in het vertellen.",
    image: emilyImg,
    location: {
      name: "Hong Kong",
      coordinates: [114.1694, 22.3193], // Hong Kong Central
      country: "Hong Kong"
    },
    categories: ["political", "gender"]
  },
  {
    id: 3,
    title: "Carlos",
    description: "Hij groeide op tussen grenzen, van landen, culturen en verwachtingen, en vocht zich vrij met zijn blik op waardigheid.",
    image: carlosImg,
    location: {
      name: "Mexico City",
      coordinates: [-99.1332, 19.4326], // Mexico City Center
      country: "Mexico"
    },
    categories: ["refugee", "racism"]
  },
  {
    id: 4,
    title: "Barry",
    description: "Verlaten, verkracht en verguisd, maar nog altijd vechtend voor zichzelf, zijn gezin en zijn waarheid.",
    image: barryImg,
    location: {
      name: "Bujumbura",
      coordinates: [29.3618, -3.3731], // Bujumbura Center
      country: "Burundi"
    },
    categories: ["lgbtq", "political"]
  },
  {
    id: 5,
    title: "Tyrone",
    description: "Gejaagd om zijn bestaan, door staten en straten, bleef hij vechten voor een plek waar hij gewoon mocht zijn.",
    image: tyroneImg,
    location: {
      name: "Kampala",
      coordinates: [32.5825, 0.3476], // Kampala Center
      country: "Uganda"
    },
    categories: ["lgbtq", "refugee"]
  },
  {
    id: 6,
    title: "Eunju Kim",
    description: "Ze trotseerde dood, vrieskou en verraad , voor een maaltijd, een stem, en uiteindelijk een leven in vrijheid.",
    image: eunjuImg,
    location: {
      name: "Eundok",
      coordinates: [129.3274, 41.8142], // Eundok, North Hamgyong
      country: "North Korea"
    },
    categories: ["political", "gender"]
  },
  {
    id: 7,
    title: "Kikonyogo Kivumbi",
    description: "Geverfd als vijand vanwege liefde, verloor hij zijn werk, zijn veiligheid en bijna zijn leven , maar niet zijn stem.",
    image: kikonyogoImg,
    location: {
      name: "Kampala",
      coordinates: [32.5825, 0.3476], // Kampala Center
      country: "Uganda"
    },
    categories: ["lgbtq", "political"]
  }
];

export default function GlobeView() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [filteredStories, setFilteredStories] = useState(sidebarItems);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  // Filter stories based on selected country and categories
  const filterStories = (country, categories) => {
    return sidebarItems.filter(item => {
      const matchesCountry = !country || item.location.country === country;
      const matchesCategories = categories.length === 0 || 
        categories.every(cat => item.categories.includes(cat));
      return matchesCountry && matchesCategories;
    });
  };

  // Handle category selection
  const toggleCategory = (category) => {
    setSelectedCategories(prev => {
      const newCategories = prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category];
      setFilteredStories(filterStories(selectedLocation, newCategories));
      return newCategories;
    });
  };

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe',
      zoom: 2,
      center: [0, 20], // Adjusted center to better show all locations
      minZoom: 1,
      maxZoom: 15,
      dragRotate: false, // Disabled rotation to prevent coordinate distortion
      dragPan: true,
      scrollZoom: {
        speed: 0.2,
        smooth: true
      },
      renderWorldCopies: true,
      pitch: 0, // Ensure map is flat
      bearing: 0 // Ensure map is oriented north
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

sidebarItems.forEach(story => {
  const el = document.createElement('div');
  el.className = 'marker';

  // Inner element dat je visueel gaat schalen
  const inner = document.createElement('div');
  inner.style.width = '30px';
  inner.style.height = '30px';
  inner.style.backgroundImage = `url(${story.image})`;
  inner.style.backgroundSize = 'cover';
  inner.style.borderRadius = '50%';
  inner.style.border = '2px solid white';
  inner.style.cursor = 'pointer';
  inner.style.transition = 'transform 0.2s ease';

  el.appendChild(inner);

  // Create popup content
  const popupContent = document.createElement('div');
  popupContent.style.padding = '15px';
  popupContent.style.maxWidth = '300px';
  popupContent.style.backgroundColor = 'white';
  popupContent.style.borderRadius = '8px';
  popupContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

  const img = document.createElement('img');
  img.src = story.image;
  img.style.width = '100%';
  img.style.height = '200px';
  img.style.objectFit = 'cover';
  img.style.borderRadius = '4px';
  img.style.marginBottom = '10px';
  popupContent.appendChild(img);

  const title = document.createElement('h3');
  title.textContent = story.title;
  title.style.margin = '0 0 8px 0';
  title.style.color = '#333';
  title.style.fontSize = '18px';
  popupContent.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = story.description;
  desc.style.margin = '0 0 10px 0';
  desc.style.color = '#666';
  desc.style.fontSize = '14px';
  desc.style.lineHeight = '1.4';
  popupContent.appendChild(desc);

  const categoriesDiv = document.createElement('div');
  categoriesDiv.style.display = 'flex';
  categoriesDiv.style.gap = '5px';
  categoriesDiv.style.flexWrap = 'wrap';

  story.categories.forEach(cat => {
    const catSpan = document.createElement('span');
    catSpan.style.background = '#f0f0f0';
    catSpan.style.padding = '4px 8px';
    catSpan.style.borderRadius = '4px';
    catSpan.style.fontSize = '12px';
    catSpan.style.display = 'flex';
    catSpan.style.alignItems = 'center';
    catSpan.style.gap = '4px';
    catSpan.innerHTML = `${categories[cat].icon} ${categories[cat].label}`;
    categoriesDiv.appendChild(catSpan);
  });

  popupContent.appendChild(categoriesDiv);

  const marker = new mapboxgl.Marker({
    element: el,
    anchor: 'center'
  })
    .setLngLat(story.location.coordinates)
    .setPopup(new mapboxgl.Popup({
      offset: 25,
      closeButton: false,
      closeOnClick: false,
      anchor: 'top',
      className: 'custom-popup'
    }).setDOMContent(popupContent))
    .addTo(map.current);

  el.addEventListener('mouseenter', () => {
    inner.style.transform = 'scale(1.2)';
    setHoveredMarker(story.id);
    marker.getPopup().addTo(map.current);
  });

  el.addEventListener('mouseleave', () => {
    inner.style.transform = 'scale(1)';
    setHoveredMarker(null);
    marker.getPopup().remove();
  });

  el.addEventListener('click', () => {
    setSelectedLocation(story.location.country);
    setFilteredStories(filterStories(story.location.country, selectedCategories));
  });
});


      // Add single source for all boundaries
      map.current.addSource('boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add main country fills
      map.current.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'boundaries',
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
        'source': 'boundaries',
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
        'source': 'boundaries',
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
        'source': 'boundaries',
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
        'source': 'boundaries',
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
        'source': 'boundaries',
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
          setSelectedLocation(country.properties.name_en);
          setFilteredStories(sidebarItems.filter(item => 
            item.location.country === country.properties.name_en
          ));
          
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

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', display: 'flex' }}>
      <div ref={mapContainer} style={{ position: 'relative', width: '70%', height: '100%' }} />
      
      {/* Sidebar */}
      <div style={{
        width: '30%',
        height: '100%',
        backgroundColor: '#ffffff',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        padding: '30px'
      }}>
        {/* Filter Section */}
        <div style={{ 
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          transition: 'all 0.3s ease'
        }}>
          <div 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: 'pointer',
              marginBottom: isFilterOpen ? '15px' : '0'
            }}
          >
            <h3 style={{ margin: 0, color: '#333' }}>Filters</h3>
            <span style={{ fontSize: '20px' }}>{isFilterOpen ? '▼' : '▶'}</span>
          </div>
          
          {isFilterOpen && (
            <div style={{ 
              maxHeight: '300px',
              overflowY: 'auto',
              transition: 'max-height 0.3s ease'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#666' }}>Categories</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {Object.entries(categories).map(([key, { label, icon }]) => (
                    <button
                      key={key}
                      onClick={() => toggleCategory(key)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: selectedCategories.includes(key) ? '#3386c0' : '#e0e0e0',
                        color: selectedCategories.includes(key) ? 'white' : '#333',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}
                    >
                      <span>{icon}</span>
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stories List */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '30px',
          maxWidth: '90%',
          margin: '0 auto'
        }}>
          {filteredStories.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                padding: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ flex: '1', position: 'relative', marginBottom: '12px' }}>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <h3 style={{ 
                margin: '0 0 6px 0', 
                color: '#333',
                fontSize: '16px',
                lineHeight: '1.2',
                padding: '0 4px'
              }}>{item.title}</h3>
              <p style={{ 
                margin: '0 0 8px 0', 
                color: '#666', 
                fontSize: '13px',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                padding: '0 4px'
              }}>{item.description}</p>
              <div style={{ 
                display: 'flex', 
                gap: '5px',
                padding: '0 4px'
              }}>
                {item.categories.map(cat => (
                  <span key={cat} style={{
                    background: '#e0e0e0',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px'
                  }}>
                    {categories[cat].icon} {categories[cat].label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 