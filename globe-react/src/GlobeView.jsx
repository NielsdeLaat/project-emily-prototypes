import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { initializeProgress, markAsVisited } from './utils/progressUtils';
import ProgressOverview from './components/ProgressOverview';
import SocialFeed from './components/SocialFeed';

// Import images
import KadirImg from './img/Kadir.png';
import emilyImg from './img/Emily.png';
import carlosImg from './img/Carlos.png';
import FabriceImg from './img/Fabrice.png';
import tyroneImg from './img/Tyrone.png';
import Sae_byeokImg from './img/Sae_byeok.png';
import MugishaImg from './img/Mugisha.png';

// Categories for filtering
const categories = {
  religious: { label: "Religieuze Vervolging", icon: "⛪" },
  lgbtq: { label: "LHBTI+ Rechten", icon: "🏳️‍🌈" },
  racism: { label: "Racisme", icon: "✊" },
  political: { label: "Politieke Onderdrukking", icon: "🗳️" },
  gender: { label: "Genderrechten", icon: "♀️" },
  refugee: { label: "Vluchteling", icon: "🏃" }
};

// Story data with locations and categories
const sidebarItems = [
  {
    id: 1,
    title: "Kadir",
    description: "Hij groeide op met gebed, familie en een diepgewortelde traditie. Wat volgde was isolatie, dwangarbeid en stilte, opgelegd in naam van heropvoeding.",
    image: KadirImg,
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
    title: "Fabrice",
    description: "Fabrice vluchtte voor zijn leven, maar vond nergens rust. Niet in Burundi, niet in Kenia. Alleen stilte, schaamte en angst die zich bleven herhalen.",
    image: FabriceImg,
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
    description: "Tyrone verliet Oeganda in de hoop op rust en veiligheid. In plaats daarvan kwam hij terecht in een nieuw land, waar het gevaar bleef.",
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
    title: "Sae-Byeok",
    description: "Gejaagd om haar bestaan, door staten en straten, bleef zij vechten voor een plek waar zij gewoon mocht zijn.",
    image: Sae_byeokImg,
    location: {
      name: "Eundok",
      coordinates: [129.3274, 41.8142], // Eundok, North Hamgyong
      country: "North Korea"
    },
    categories: ["political", "gender"]
  },
  {
    id: 7,
    title: "Mugisha",
    description: "Wat gebeurt er als je wordt uitgesloten door de samenleving die je probeert te helpen, simpelweg omdat je jezelf bent?",
    image: MugishaImg,
    location: {
      name: "Kampala",
      coordinates: [32.5825, 0.3476], // Kampala Center
      country: "Uganda"
    },
    categories: ["lgbtq", "political"]
  }
];

// Place name translations
const placeTranslations = {
  'Xinjiang Village': 'Dorp Xinjiang',
  'Hong Kong': 'Hong Kong',
  'Mexico City': 'Mexico-Stad',
  'Bujumbura': 'Bujumbura',
  'Kampala': 'Kampala',
  'Eundok': 'Eundok',
  'China': 'China',
  'Mexico': 'Mexico',
  'Burundi': 'Burundi',
  'Uganda': 'Oeganda',
  'North Korea': 'Noord-Korea',
};

// Pin SVG for locations
const PinSVG = `<span style='display:inline-flex;vertical-align:middle;color:#888;'><svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' width='16' height='16'><path fill-rule='evenodd' d='m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z' clip-rule='evenodd'/></svg></span>`;

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
  const [sidebarTab, setSidebarTab] = useState('stories'); // 'stories' or 'feed'

  const expandedStories = {
    1: {
      title: "Kadir's Verhaal",
      text: `In dit verhaal vertelt Kadir hoe zijn leven als jonge Oeigoerse man in Xinjiang abrupt veranderde toen de Chinese overheid in 2017 begon met het opsluiten van duizenden leden van zijn gemeenschap. Zijn vader werd gearresteerd vanwege zijn geloof, hijzelf werd zonder reden meegenomen en belandde in een systeem van dwangarbeid, surveillantie en ideologische herprogrammering.

Het is een verhaal over wat er gebeurt wanneer je identiteit doelbewust wordt uitgewist. Over werk dat geen werk is, lessen die geen onderwijs zijn, en leven zonder contact of vrijheid. En over hoe vluchten soms de enige manier is om opnieuw mens te mogen zijn.

Door zijn verhaal te delen, hoopt Kadir zichtbaar te maken wat voor velen onzichtbaar blijft — en aandacht te vragen voor de duizenden anderen die nog steeds gevangen zitten in stilte.`,
      age: 42
    },
    2: {
      title: "Emily's Verhaal",
      text: `Emily was een jonge student toen de protesten in Hong Kong begonnen. Traangas, waterkanonnen en politiegeweld werden haar dagelijkse realiteit. Maar ze bleef filmen, vastbesloten om de waarheid vast te leggen.

De invoering van de nationale veiligheidswet maakte haar werk steeds gevaarlijker. Vrienden werden gearresteerd, nieuwsredacties gesloten. Emily besloot haar verhalen online te delen, wetende dat dit haar in gevaar zou brengen.

Nu, vanuit het buitenland, blijft ze schrijven over Hong Kong. Haar stem is haar wapen, haar woorden haar verzet. Ze vecht voor de vrijheid om te vertellen wat er echt gebeurt in haar geliefde stad.`,
      age: 23
    },
    3: {
      title: "Carlos' Verhaal",
      text: `Carlos werd geboren in een klein dorpje in Mexico, waar zijn familie al generaties lang woonde. Als kind merkte hij al dat hij 'anders' was - zijn donkerdere huid maakte hem een doelwit van pesterijen en discriminatie.

Op zoek naar een beter leven trok zijn familie naar de stad. Maar ook daar vond Carlos geen acceptatie. Op school, op het werk, in het dagelijks leven - overal voelde hij de blik van vooroordeel.

Hij vond zijn roeping in kunst en activisme. Door zijn schilderijen en installaties vertelt hij het verhaal van uitsluiting en onrecht. Zijn werk werd zijn stem tegen racisme en ongelijkheid.

Vandaag reist Carlos door het land, geeft workshops aan jongeren en gebruikt zijn kunst om dialoog te starten over racisme en identiteit. Hij vecht voor een Mexico waar iedereen zichzelf kan zijn, ongeacht huidskleur.`,
      age: 29
    },
    4: {
      title: "Fabrice's Verhaal",
      text: `In dit verhaal vertelt Fabrice, een 23-jarige transgender man uit Burundi, over zijn leven vol bedreigingen, geweld en verlies. Nadat zijn identiteit bekend werd, werd hij achtervolgd, zijn ouders vermoord, en hijzelf meermaals mishandeld — ook onderweg naar wat hij hoopte dat een veiligere plek zou zijn.

In plaats van bescherming vond hij nieuw geweld, ook in het vluchtelingenkamp waar hij terechtkwam. Zijn kinderen overleefden ternauwernood een vergiftiging. Hij leefde maandenlang met zijn trauma's zonder te durven zeggen wie hij werkelijk was — totdat zijn gezondheid hem dwong om zijn verhaal wél te vertellen.

Fabrice's verhaal legt bloot hoe kwetsbaar het bestaan is van transgender vluchtelingen. Hoe moeilijk het is om hulp te vragen als je al zo vaak gestraft bent voor wie je bent. En hoe veerkracht soms betekent: gewoon doorgaan, ook als alles pijn doet.`,
      age: 31
    },
    5: {
      title: "Tyrone's Verhaal",
      text: `In dit verhaal deelt Tyrone hoe hij als jonge homoseksuele man in 2014 vluchtte naar Kenia — een plek die veiliger zou moeten zijn. Maar direct na aankomst werd hij mishandeld, herhaaldelijk gearresteerd en bedreigd. Niet alleen door vreemden, maar ook door de politie.

Hij vertelt hoe het is om steeds weer te moeten verhuizen, omdat zelfs je buren je niet met rust laten. En hoe het voelt als je nergens echt veilig bent — niet thuis, maar ook niet daarbuiten.

Tyrone's ervaring laat zien dat vluchten niet altijd een einde maakt aan gevaar, en dat voor veel LHBTI+ vluchtelingen veiligheid iets is waar je in stilte op hoopt, maar zelden echt vindt.`,
      age: 15
    },
    6: {
      title: "Sae-byeok's Verhaal",
      text: `Hier volgt het aangrijpende verhaal van Sae-byeok, een vrouw die opgroeide in het gesloten Noord-Korea en twee keer haar leven riskeerde om te ontsnappen aan onderdrukking, honger en stilzwijgen. Haar reis voert van de duisternis van een totalitair regime, via mensenhandel in China, naar vrijheid in Zuid-Korea.

Door dit verhaal te delen, werpen we licht op de werkelijkheid achter grenzen en propaganda — en op de kracht van menselijkheid, zelfs wanneer die systematisch wordt onderdrukt. Het is een verhaal over overleven, herinneren en het weigeren om te zwijgen.

Want elk verhaal dat wordt verteld, maakt de wereld een stukje helderder. En Sae-byeok's verhaal is niet alleen het hare — het is een stem voor duizenden anderen die nog steeds in stilte leven.`,
      age: 27
    },
    7: {
      title: "Mugisha's Verhaal",
      text: `Mugisha groeide op in Oeganda, werkte als journalist en beleidsadviseur, en zette zich in voor volksgezondheid. Maar toen hij open was over zijn seksuele geaardheid, verloor hij zijn baan, werd hij mishandeld en buitengesloten. Wat volgde was geen vlucht, maar een keuze om te blijven — en te bouwen aan iets beters.

In dit verhaal lees je hoe hij ondanks persoonlijke risico's bleef opkomen voor de rechten van gemarginaliseerde groepen. Over hoe hij zorgde voor toegang tot hiv-zorg, media trainde in respectvolle verslaggeving en zich bleef uitspreken tegen discriminatie, ook toen het niet veilig was.

Het is een verhaal over integriteit in een vijandige omgeving. Over kleine stappen die in stilte worden gezet, en toch een grote impact hebben.`,
      age: 38
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

  // Auto-collapse filters when only one story is shown
  useEffect(() => {
    if (filteredStories.length === 1 && isFilterOpen) {
      setIsFilterOpen(false);
    }
  }, [filteredStories.length, isFilterOpen]);

  // Add reset progress function
  const handleResetProgress = () => {
    if (window.confirm('Weet je zeker dat je alle vooruitgang wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
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
      bearing: 0,
      locale: {
        'NavigationControl.ZoomIn': 'Inzoomen',
        'NavigationControl.ZoomOut': 'Uitzoomen',
        'NavigationControl.ResetBearing': 'Draai naar het noorden',
      }
    });

    // Add map interaction handlers to close sidebar
    map.current.on('click', (e) => {
      // Only close sidebar if clicking on empty areas (not on countries or markers)
      const features = map.current.queryRenderedFeatures(e.point);
      const hasCountryFeature = features.some(feature => 
        feature.source === 'countries' || 
        feature.source === 'territories' ||
        feature.layer?.id?.includes('country') ||
        feature.layer?.id?.includes('territory')
      );
      
      // Don't close sidebar if clicking on a country or if there are features at click point
      if (!hasCountryFeature && features.length === 0 && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    });

    map.current.on('dragstart', () => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    });

    map.current.on('zoomstart', () => {
      if (isSidebarOpen) {
        setIsSidebarOpen(false);
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

      // Add country boundaries
      map.current.addSource('countries', {
        type: 'vector',
        url: 'mapbox://mapbox.country-boundaries-v1'
      });

      // Add country fills for highlighting
      map.current.addLayer({
        'id': 'country-fills',
        'type': 'fill',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'paint': {
          'fill-color': [
            'case',
            ['==', ['get', 'name_en'], ''],  // Default case
            '#ffffff',
            '#ffffff'
          ],
          'fill-opacity': 0.4
        }
      });

      // Add territory fills with the same style
      map.current.addLayer({
        'id': 'territory-fills',
        'type': 'fill',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'filter': [
          'any',
          ['==', ['get', 'name_en'], 'Taiwan'],
          ['==', ['get', 'name_en'], 'Hong Kong']
        ],
        'paint': {
          'fill-color': '#ffffff',
          'fill-opacity': 0.4
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
          'text-halo-width': 1.5
        }
      });

      // Add country boundaries with thinner lines
      map.current.addLayer({
        'id': 'country-boundaries',
        'type': 'line',
        'source': 'countries',
        'source-layer': 'country_boundaries',
        'layout': {},
        'paint': {
          'line-color': '#a0a0a0',
          'line-width': 0.5
        }
      }, 'country-labels');

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
        popupContent.style.fontFamily = 'system-ui, -apple-system, sans-serif';
        popupContent.style.position = 'relative';

        // Name and Age
        const title = document.createElement('h3');
        title.textContent = `${story.title}, ${expandedStories[story.id].age}`;
        title.style.margin = '0 0 8px 0';
        title.style.color = '#333';
        title.style.fontSize = '18px';
        title.style.fontWeight = '600';
        title.style.fontFamily = 'inherit';
        popupContent.appendChild(title);

        // Image container with relative positioning
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'relative';
        imgContainer.style.marginBottom = '12px';

        // Image
        const img = document.createElement('img');
        img.src = story.image;
        img.style.width = '100%';
        img.style.height = '200px';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '6px';
        img.style.display = 'block';
        
        // Apply grayscale filter if story has been visited
        if (userProgress.visitedIds.includes(story.id)) {
          img.style.filter = 'grayscale(80%) brightness(0.8)';
        }
        
        imgContainer.appendChild(img);

        // Add visited badge over image if story has been visited
        if (userProgress.visitedIds.includes(story.id)) {
          const visitedBadge = document.createElement('div');
          visitedBadge.style.position = 'absolute';
          visitedBadge.style.top = '10px';
          visitedBadge.style.right = '10px';
          visitedBadge.style.background = 'rgba(34, 197, 94, 0.9)';
          visitedBadge.style.color = 'white';
          visitedBadge.style.padding = '4px 8px';
          visitedBadge.style.borderRadius = '12px';
          visitedBadge.style.fontSize = '11px';
          visitedBadge.style.fontWeight = '500';
          visitedBadge.style.fontFamily = 'inherit';
          visitedBadge.textContent = '✅ Bekeken';
          imgContainer.appendChild(visitedBadge);
        }

        popupContent.appendChild(imgContainer);

        // Location with extra spacing and italic
        const location = document.createElement('div');
        location.style.color = '#777';
        location.style.fontSize = '13px';
        location.style.display = 'flex';
        location.style.alignItems = 'center';
        location.style.gap = '4px';
        location.style.marginBottom = '12px';
        location.style.marginTop = '8px';
        location.style.fontFamily = 'inherit';
        location.style.fontStyle = 'italic';
        // Translate place and country to Dutch
        let locName = placeTranslations[story.location.name] || story.location.name;
        let locCountry = placeTranslations[story.location.country] || story.location.country;
        // For Emily, only show 'Hong Kong'
        if (story.title === 'Emily') {
          location.innerHTML = `${PinSVG} Hong Kong`;
        } else {
          location.innerHTML = `${PinSVG} ${locName}, ${locCountry}`;
        }
        popupContent.appendChild(location);

        // Description with improved typography
        const desc = document.createElement('p');
        desc.textContent = story.description;
        desc.style.margin = '0 0 15px 0';
        desc.style.color = '#555';
        desc.style.fontSize = '14px';
        desc.style.lineHeight = '1.5';
        desc.style.padding = '0 2px';
        desc.style.fontFamily = 'inherit';
        popupContent.appendChild(desc);

        // Call-to-action button (moved above categories)
        const ctaButton = document.createElement('button');
        ctaButton.textContent = ' Lees verder';
        ctaButton.style.width = '100%';
        ctaButton.style.padding = '10px 16px';
        ctaButton.style.backgroundColor = '#3B82F6';
        ctaButton.style.color = 'white';
        ctaButton.style.border = 'none';
        ctaButton.style.borderRadius = '6px';
        ctaButton.style.fontSize = '14px';
        ctaButton.style.fontWeight = '500';
        ctaButton.style.cursor = 'pointer';
        ctaButton.style.transition = 'background-color 0.2s ease';
        ctaButton.style.marginBottom = '15px';
        ctaButton.style.fontFamily = 'inherit';
        
        // Create click handler with proper state access
        const handleMarkerClick = () => {
          // Force sidebar open
          setIsSidebarOpen(true);

          // Set location and filter stories
          setSelectedLocation(story.location.country);
          setFilteredStories(filterStories(story.location.country, selectedCategories));

          // Directly show the detailed view
          setSelectedStory(story);
          setExpandedStory(story.id);
          
          // Mark as visited and update visual state immediately
          markAsVisited(story.id, userProgress, setUserProgress);
          
          // Update marker appearance immediately
          if (userProgress.visitedIds.includes(story.id)) {
            inner.style.border = '2px solid rgba(76, 175, 80, 0.3)';
            inner.style.filter = 'grayscale(80%) brightness(0.8)';
            inner.style.boxShadow = '0 0 5px rgba(76, 175, 80, 0.2)';
          }
        };
        
        // Add click event listener to marker
        el.addEventListener('click', handleMarkerClick);
        
        // Add click handler to navigate to full story (popup button)
        ctaButton.addEventListener('click', () => {
          handleMarkerClick();
          // Close the popup
          marker.getPopup().remove();
        });

        // Hover effect with consistent color
        ctaButton.onmouseenter = () => {
          ctaButton.style.backgroundColor = '#1D4ED8';
        };
        ctaButton.onmouseleave = () => {
          ctaButton.style.backgroundColor = '#3B82F6';
        };

        popupContent.appendChild(ctaButton);

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
          catSpan.style.fontFamily = 'inherit';
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
          
          // Remove popup when leaving marker (unless hovering over popup)
          setTimeout(() => {
            if (!popupContent.matches(':hover')) {
              marker.getPopup().remove();
            }
          }, 100);
        });

        // Add popup hover events
        popupContent.addEventListener('mouseenter', () => {
          // Keep popup visible when hovering over it
        });

        popupContent.addEventListener('mouseleave', () => {
          // Remove popup when mouse leaves the popup area
          marker.getPopup().remove();
        });
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

          // Reset all fills first
          map.current.setPaintProperty('country-fills', 'fill-color', '#ffffff');
          map.current.setPaintProperty('territory-fills', 'fill-color', '#ffffff');

          // Then highlight the clicked country or territory
          if (country.properties.name_en === 'Taiwan' || country.properties.name_en === 'Hong Kong') {
            map.current.setPaintProperty('territory-fills', 'fill-color', [
              'case',
              ['==', ['get', 'name_en'], country.properties.name_en],
              '#ffd700',
              '#ffffff'
            ]);
          } else {
            map.current.setPaintProperty('country-fills', 'fill-color', [
              'case',
              ['==', ['get', 'name_en'], country.properties.name_en],
              '#ffd700',
              '#ffffff'
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

      // Add click handler for countries
      map.current.on('click', 'country-fills', (e) => {
        if (e.features.length > 0) {
          const countryName = e.features[0].properties.name_en;
          const countryStories = sidebarItems.filter(story => 
            story.location.country === countryName
          );
          
          // Always open sidebar, even for countries without stories
          setIsSidebarOpen(true);
          
          // Set location and filter stories
          setSelectedLocation(countryName);
          setFilteredStories(filterStories(countryName, selectedCategories));
          
          // Clear selected story to show list view
          setSelectedStory(null);
          setExpandedStory(null);
        }
      });

      // Add cursor pointer for countries
      map.current.on('mouseenter', 'country-fills', () => {
        map.current.getCanvas().style.cursor = 'pointer';
      });

      map.current.on('mouseleave', 'country-fills', () => {
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
    <>
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
            transition: 'width 0.3s ease-in-out',
            zIndex: 5
          }}
        />

        {/* Globe Dimming Overlay */}
        {isSidebarOpen && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 'calc(100% - 30%)',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.15)',
              backdropFilter: 'blur(2px)',
              pointerEvents: 'none',
              zIndex: 10,
              transition: 'all 0.3s ease-in-out'
            }}
          />
        )}

        {/* Profile Button */}
        <button
          className="fixed top-4 left-4 z-50 bg-white text-emily-blue w-10 h-10 rounded-full shadow-lg hover:border-emily-blue border-2 border-white transition-colors flex items-center justify-center"
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          onMouseEnter={(e) => {
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Bekijk je voortgang en ontdekkingen';
            tooltip.style.cssText = `
              position: fixed;
              top: ${e.clientY - 40}px;
              left: ${e.clientX + 10}px;
              background: rgba(0,0,0,0.8);
              color: white;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              z-index: 10000;
              pointer-events: none;
              white-space: nowrap;
            `;
            tooltip.id = 'progress-tooltip';
            document.body.appendChild(tooltip);
          }}
          onMouseLeave={() => {
            const tooltip = document.getElementById('progress-tooltip');
            if (tooltip) {
              tooltip.remove();
            }
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2563eb" style={{ width: '1.5em', height: '1.5em' }}>
            <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
          </svg>
        </button>

        {/* Profile Modal */}
        {isProfileOpen && (
          <div
            onClick={(e) => {
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
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '20px',
              maxWidth: '90vw',
              width: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}>
              {/* Close button */}
              <button
                onClick={() => setIsProfileOpen(false)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '15px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                  zIndex: 1
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                ×
              </button>
              
              <ProgressOverview
                userProgress={userProgress}
                sidebarItems={sidebarItems}
                onResetProgress={handleResetProgress}
              />
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
          {/* Tab Bar */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '50px',
            display: 'flex',
            background: '#f8f8f8',
            borderBottom: '1px solid #e5e5e5',
            zIndex: 1001
          }}>
            <button
              onClick={() => setSidebarTab('stories')}
              style={{
                flex: 1,
                border: 'none',
                background: sidebarTab === 'stories' ? '#fff' : 'transparent',
                fontWeight: sidebarTab === 'stories' ? 'bold' : 'normal',
                color: '#2563eb',
                fontSize: '16px',
                borderBottom: sidebarTab === 'stories' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.2s, border-bottom 0.2s'
              }}
            >
              Stories
            </button>
            <button
              onClick={() => setSidebarTab('feed')}
              style={{
                flex: 1,
                border: 'none',
                background: sidebarTab === 'feed' ? '#fff' : 'transparent',
                fontWeight: sidebarTab === 'feed' ? 'bold' : 'normal',
                color: '#2563eb',
                fontSize: '16px',
                borderBottom: sidebarTab === 'feed' ? '2px solid #2563eb' : '2px solid transparent',
                cursor: 'pointer',
                outline: 'none',
                transition: 'background 0.2s, border-bottom 0.2s'
              }}
            >
              Feed
            </button>
          </div>
          {/* Sidebar Content */}
          <div style={{
            flex: 1,
            backgroundColor: '#ffffff',
            boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
            overflowY: 'auto',
            padding: '30px',
            position: 'relative',
            paddingTop: '80px' // leave space for tab bar and close button
          }}>
            {/* Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                cursor: 'pointer',
                color: '#666',
                width: '30px',
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
                zIndex: 1
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              title="Sluit zijbalk"
            >
              ×
            </button>
            {sidebarTab === 'stories' ? (
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
                      className="text-emily-blue hover:text-emily-blue/80 text-sm"
                      onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                      {isFilterOpen ? 'Verberg filters' : 'Toon filters'}
                    </button>
                  </div>

                  {isFilterOpen && (
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(categories).map(([key, { label, icon }]) => (
                        <button
                          key={key}
                          className={`filter-button ${selectedCategories.includes(key) ? 'bg-emily-blue text-white' : ''
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
                  {filteredStories.length > 0 ? (
                    filteredStories.map((story) => (
                      <div key={story.id} className="story-card">
                        <div className="relative aspect-w-16 aspect-h-9 mb-4">
                          <img
                            src={story.image}
                            alt={story.title}
                            className="w-full h-full object-cover rounded cursor-pointer"
                            onClick={() => {
                              setSelectedStory(story);
                              setExpandedStory(story.id);
                              markAsVisited(story.id, userProgress, setUserProgress);
                              
                              // Force re-render to update visual state
                              setTimeout(() => {
                                setFilteredStories([...filteredStories]);
                              }, 100);
                            }}
                          />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{story.title}, {expandedStories[story.id].age}</h3>
                        
                        {/* Location */}
                        <p className="text-sm italic mb-4 flex items-center gap-1" style={{ color: '#777', fontSize: '13px', marginTop: '6px' }}>
                          <span style={{ display: 'inline-flex', verticalAlign: 'middle', color: '#888' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                              <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                            </svg>
                          </span>
                          {story.title === 'Emily'
                            ? 'Hong Kong'
                            : `${placeTranslations[story.location.name] || story.location.name}, ${placeTranslations[story.location.country] || story.location.country}`
                          }
                        </p>

                        <p className="text-gray-600 mb-4">{story.description}</p>

                        {/* Read More Button */}
                        <button
                          className="read-more-button mb-4"
                          style={{ fontSize: '16px' }}
                          onClick={() => {
                            setSelectedStory(story);
                            setExpandedStory(story.id);
                            markAsVisited(story.id, userProgress, setUserProgress);
                            
                            // Force re-render to update visual state
                            setTimeout(() => {
                              setFilteredStories([...filteredStories]);
                            }, 100);
                          }}
                        >
                          Lees meer... 
                        </button>

                        {/* Categories */}
                        <div className="flex flex-wrap gap-2">
                          {story.categories.map((cat) => (
                            <span
                              key={cat}
                              className="inline-flex items-center gap-1 text-sm px-2 py-1 bg-gray-100 rounded capitalize"
                            >
                              {categories[cat].icon} {categories[cat].label}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 px-4">
                      <div className="text-4xl mb-4">🔍</div>
                      <h3 className="text-xl font-semibold mb-2">
                        {selectedLocation 
                          ? "Geen verhalen gevonden in dit land..."
                          : selectedCategories.length > 0 
                            ? "Geen verhalen gevonden met deze combinatie van filters..."
                            : "Geen verhalen gevonden..."
                        }
                      </h3>
                      <p className="text-gray-600">
                        {selectedLocation 
                          ? "Probeer een ander land te selecteren"
                          : selectedCategories.length > 0 
                            ? "Probeer andere filters te selecteren"
                            : "Probeer andere zoek criteria"
                        }
                      </p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <SocialFeed sidebarItems={sidebarItems} />
            )}
          </div>
        </div>
      </div>
    </>
  );
} 