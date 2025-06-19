import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initializeProgress, markAsVisited } from './utils/progressUtils';
import ProgressOverview from './components/ProgressOverview';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(() => initializeProgress());
  const [expandedStory, setExpandedStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);

  // Mock data for expanded content
  const mockExpandedContent = {
    text: "Hier volgt een uitgebreid verhaal over de ervaringen en uitdagingen die deze persoon heeft doorgemaakt. Het verhaal gaat dieper in op de persoonlijke reis, de obstakels die overwonnen zijn, en de hoop voor de toekomst. Door deze verhalen te delen, creëren we begrip en verbinding tussen verschillende culturen en ervaringen.\n\nDe impact van deze gebeurtenissen reikt verder dan alleen het persoonlijke verhaal. Het laat zien hoe maatschappelijke structuren en systemen mensen kunnen beïnvloeden, maar ook hoe veerkracht en vastberadenheid kunnen leiden tot positieve verandering.\n\nDoor het delen van deze verhalen hopen we anderen te inspireren en bewustwording te creëren over belangrijke maatschappelijke kwesties. Elk verhaal is een stap richting meer begrip en empathie in onze samenleving.",
    age: {
      1: 42,
      2: 23,
      3: 29,
      4: 31,
      5: 15,
      6: 27,
      7: 38
    }
  };

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

  // Add reset progress function
  const handleResetProgress = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('userProgress');
      setUserProgress({ visitedIds: [] });
      
      // Reset marker appearances
      const markers = document.querySelectorAll('.marker');
      markers.forEach(marker => {
        const inner = marker.querySelector('div');
        if (inner) {
          inner.style.border = '2px solid white';
          inner.style.filter = 'none';
          inner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }
      });
    }
  };

  useEffect(() => {
    if (map.current) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoic3RldmllZ3JpZmZpbmRlc2lnbiIsImEiOiJja24waTQzeHYwbndvMnZtbnFrYXV3ZjdjIn0.zhhJzykz0VYq7RQWBJxh7A';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      projection: 'globe',
      zoom: 2,
      center: [0, 20],
      minZoom: 1,
      maxZoom: 15,
      dragRotate: false,
      dragPan: true,
      scrollZoom: {
        speed: 0.2,
        smooth: true
      },
      renderWorldCopies: true,
      pitch: 0,
      bearing: 0
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

      // Add country boundaries with thinner lines
      map.current.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      map.current.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'paint': {
          'fill-color': '#e0e0e0',
          'fill-opacity': 0.4
        }
      });

      map.current.addLayer({
        'id': 'country-borders',
        'type': 'line',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'paint': {
          'line-color': '#000000',
          'line-width': 0.5  // Thin lines but in black
        }
      });

      // Add territory boundaries with thinner lines
      map.current.addSource('territories', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      map.current.addLayer({
        'id': 'territory-fills',
        'type': 'fill',
        'source': 'territories',
        'source-layer': 'country_boundaries',
        'filter': ['==', 'mapbox:is_territory', true],
        'paint': {
          'fill-color': '#e0e0e0',
          'fill-opacity': 0.4
        }
      });

      map.current.addLayer({
        'id': 'territory-borders',
        'type': 'line',
        'source': 'territories',
        'source-layer': 'country_boundaries',
        'filter': ['==', 'mapbox:is_territory', true],
        'paint': {
          'line-color': '#000000',
          'line-width': 0.5  // Thin lines but in black
        }
      });

      sidebarItems.forEach(story => {
        const el = document.createElement('div');
        el.className = 'marker';

        const inner = document.createElement('div');
        inner.style.width = '30px';
        inner.style.height = '30px';
        inner.style.backgroundImage = `url(${story.image})`;
        inner.style.backgroundSize = 'cover';
        inner.style.borderRadius = '50%';
        inner.style.cursor = 'pointer';
        inner.style.transition = 'all 0.3s ease';
        
        // Add visited state visual indicator
        if (userProgress.visitedIds.includes(story.id)) {
          inner.style.border = '2px solid rgba(76, 175, 80, 0.3)';
          inner.style.filter = 'grayscale(80%) brightness(0.8)';
          inner.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.2)';
        } else {
          inner.style.border = '2px solid white';
          inner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        }

        el.appendChild(inner);

        // Create popup content with more information
        const popupContent = document.createElement('div');
        popupContent.style.padding = '15px';
        popupContent.style.maxWidth = '300px';
        popupContent.style.backgroundColor = 'white';
        popupContent.style.borderRadius = '8px';
        popupContent.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';

        // Name and Age
        const title = document.createElement('h3');
        title.textContent = `${story.title}, ${mockExpandedContent.age[story.id]}`;
        title.style.margin = '0 0 8px 0';
        title.style.color = '#333';
        title.style.fontSize = '18px';
        popupContent.appendChild(title);

        // Image
        const img = document.createElement('img');
        img.src = story.image;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '4px';
        img.style.marginBottom = '10px';
        popupContent.appendChild(img);

        // Location
        const location = document.createElement('div');
        location.style.color = '#666';
        location.style.fontSize = '13px';
        location.style.display = 'flex';
        location.style.alignItems = 'center';
        location.style.gap = '4px';
        location.style.marginBottom = '10px';
        location.innerHTML = `<span>📍</span> ${story.location.name}, ${story.location.country}`;
        popupContent.appendChild(location);

        // Description
        const desc = document.createElement('p');
        desc.textContent = story.description;
        desc.style.margin = '0 0 10px 0';
        desc.style.color = '#666';
        desc.style.fontSize = '14px';
        desc.style.lineHeight = '1.4';
        popupContent.appendChild(desc);
        
        // Categories
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

        // Create click handler with proper state access
        const handleMarkerClick = () => {
          // Force sidebar open
          setIsSidebarOpen(true);
          
          // Set location and filter stories
          setSelectedLocation(story.location.country);
          setFilteredStories(filterStories(story.location.country, selectedCategories));
          
          // Directly show the detailed view
          setSelectedStory(story);
        };

        // Add click event listener
        el.addEventListener('click', handleMarkerClick);

        // Add hover events
        el.addEventListener('mouseenter', () => {
          if (userProgress.visitedIds.includes(story.id)) {
            inner.style.transform = 'scale(1.1)';
            inner.style.filter = 'grayscale(50%) brightness(0.9)';
          } else {
            inner.style.transform = 'scale(1.2)';
            inner.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
          }
          setHoveredMarker(story.id);
          marker.getPopup().addTo(map.current);
        });

        el.addEventListener('mouseleave', () => {
          if (userProgress.visitedIds.includes(story.id)) {
            inner.style.transform = 'scale(1)';
            inner.style.filter = 'grayscale(80%) brightness(0.8)';
          } else {
            inner.style.transform = 'scale(1)';
            inner.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
          }
          setHoveredMarker(null);
          marker.getPopup().remove();
        });
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

  // Add effect to handle map resize when sidebar toggles
  useEffect(() => {
    if (map.current) {
      // Add a small delay to ensure the container has finished transitioning
      setTimeout(() => {
        map.current.resize();
      }, 300);
    }
  }, [isSidebarOpen]);

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      margin: 0, 
      padding: 0, 
      overflow: 'hidden' 
    }}>
      {/* Map Container */}
      <div 
        ref={mapContainer} 
        style={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          width: isSidebarOpen ? 'calc(100% - 30%)' : '100%',
          height: '100%',
          transition: 'width 0.3s ease-in-out'
        }} 
      />

      {/* Profile Button */}
      <button
        className="fixed top-4 left-4 z-50 bg-white text-emily-blue w-10 h-10 rounded-full shadow-lg hover:border-emily-blue border-2 border-white transition-colors flex items-center justify-center"
        onClick={() => setIsProfileOpen(!isProfileOpen)}
      >
        🥇
      </button>

      {/* Profile Modal */}
      {isProfileOpen && (
        <div
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              setIsProfileOpen(false);
            }
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '12px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <ProgressOverview userProgress={userProgress} sidebarItems={sidebarItems} />
          </div>
        </div>
      )}
      
      {/* Sidebar Container with Integrated Tab */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: isSidebarOpen ? '0' : '-30%',
        height: '100%',
        width: '30%',
        display: 'flex',
        transition: 'right 0.3s ease-in-out',
        zIndex: 999
      }}>
        {/* Tab Button */}
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            position: 'absolute',
            left: '-40px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '40px',
            height: '100px',
            backgroundColor: '#ffffff',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
            borderRadius: '8px 0 0 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <div style={{
            transform: `rotate(${isSidebarOpen ? 0 : 180}deg)`,
            transition: 'transform 0.3s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '8px'
          }}>
            <span style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              transform: 'rotate(180deg)',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#666'
            }}>
              Stories
            </span>
            <span style={{ fontSize: '12px' }}>
              {isSidebarOpen ? '▶' : '◀'}
            </span>
          </div>
        </div>

        {/* Sidebar Content */}
        <div style={{
          flex: 1,
          backgroundColor: '#ffffff',
          boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
          overflowY: 'auto',
          padding: '30px'
        }}>
          {selectedStory ? (
            // Expanded Story View
            <div className="story-card">
              {/* Back Button - Moved to top of expanded story */}
              <button
                className="button-base mb-4"
                onClick={() => {
                  setSelectedStory(null);
                  setExpandedStory(null);
                }}
              >
                ← Terug naar overzicht
              </button>

              <div className="relative aspect-w-16 aspect-h-9 mb-4">
                <img
                  src={selectedStory.image}
                  alt={selectedStory.title}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              <h2 className="text-xl font-semibold mb-4">{selectedStory.title}</h2>
              
              <div className="prose max-w-none mb-6">
                {mockExpandedContent.text.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Categories in expanded view */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedStory.categories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 rounded"
                  >
                    {categories[cat].icon} {categories[cat].label}
                  </span>
                ))}
              </div>

              {/* Chat Button - Now in Emily Blue */}
              <button
                className="button-base w-full"
                onClick={() => {
                  // Handle chat functionality
                  markAsVisited(selectedStory.id, userProgress, setUserProgress);
                }}
              >
                Chat met {selectedStory.title}
              </button>

              {/* Filter Section - Moved under expanded story */}
              <div className="filter-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    className="text-emily-blue hover:text-emily-blue/80"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    {isFilterOpen ? '▼' : '▶'}
                  </button>
                </div>

                {isFilterOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(categories).map(([key, { label, icon }]) => (
                      <button
                        key={key}
                        className={`filter-button ${
                          selectedCategories.includes(key) ? 'bg-emily-blue text-white' : ''
                        }`}
                        onClick={() => toggleCategory(key)}
                      >
                        <span className="mr-2">{icon}</span>
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            // Stories List View
            <>
              {/* Location Header with Back Option */}
              {selectedLocation && (
                <div style={{
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <button
                    onClick={() => {
                      setSelectedLocation(null);
                      setFilteredStories(sidebarItems);
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#666',
                      padding: '8px 0'
                    }}
                  >
                    <span>←</span>
                    <span>Alle verhalen</span>
                  </button>
                  <span style={{ color: '#666' }}>|</span>
                  <span style={{ color: '#333', fontWeight: 'bold' }}>{selectedLocation}</span>
                </div>
              )}

              {/* Filter Section */}
              <div className="filter-section">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Filters</h3>
                  <button
                    className="text-emily-blue hover:text-emily-blue/80"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    {isFilterOpen ? '▼' : '▶'}
                  </button>
                </div>
                
                {isFilterOpen && (
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(categories).map(([key, { label, icon }]) => (
                      <button
                        key={key}
                        className={`filter-button ${
                          selectedCategories.includes(key) ? 'bg-emily-blue text-white' : ''
                        }`}
                        onClick={() => toggleCategory(key)}
                      >
                        <span className="mr-2">{icon}</span>
                        {label}
                      </button>
                    ))}
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
                {filteredStories.map((story) => (
                  <div key={story.id} className="story-card">
                    <div className="relative aspect-w-16 aspect-h-9 mb-4">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                    <p className="text-gray-600 mb-4">{story.description}</p>
                    
                    {/* Read More Button - Moved above categories */}
                    <button
                      className="read-more-button mb-4"
                      onClick={() => {
                        setSelectedStory(story);
                        setExpandedStory(story.id);
                        markAsVisited(story.id, userProgress, setUserProgress);
                      }}
                    >
                      Lees meer...
                    </button>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-2">
                      {story.categories.map((cat) => (
                        <span
                          key={cat}
                          className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 rounded"
                        >
                          {categories[cat].icon} {categories[cat].label}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 