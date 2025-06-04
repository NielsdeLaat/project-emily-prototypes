import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

interface StoryPin {
  id: string;
  position: [number, number, number];
  country: string;
  person: {
    name: string;
    age: number;
    description: string;
    category: string;
  };
  conversations: number;
}

interface Country {
  name: string;
  continent: string;
  position: [number, number, number];
  outline: [number, number, number][];
}

interface GlobeProps {
  selectedCategories: string[];
  onPinClick: (pin: StoryPin) => void;
  isDark: boolean;
}

const storyPins: StoryPin[] = [
  {
    id: 'hongkong',
    position: [0.65, 0.15, 0.74],
    country: 'Hong Kong',
    person: {
      name: 'Mei Ling',
      age: 22,
      description: 'Protesteerde in 2019 tegen de overheid',
      category: 'Politieke dissident'
    },
    conversations: 1247
  },
  {
    id: 'afghanistan',
    position: [0.35, 0.3, 0.88],
    country: 'Afghanistan',
    person: {
      name: 'Amara',
      age: 28,
      description: 'LGBTQ+ activist gevlucht uit Afghanistan',
      category: 'LGBTQ+ vluchteling'
    },
    conversations: 892
  },
  {
    id: 'russia',
    position: [0.45, 0.65, 0.61],
    country: 'Rusland',
    person: {
      name: 'Dimitri',
      age: 34,
      description: 'Onafhankelijke journalist in ballingschap',
      category: 'Journalisten in ballingschap'
    },
    conversations: 1523
  },
  {
    id: 'iran',
    position: [0.25, 0.25, 0.93],
    country: 'Iran',
    person: {
      name: 'Nasrin',
      age: 29,
      description: 'Voormalige politieke gevangene',
      category: 'Ex-gevangene'
    },
    conversations: 756
  }
];

const countries: Country[] = [
  // Europe
  {
    name: 'Nederland',
    continent: 'Europa',
    position: [0.12, 0.52, 0.85],
    outline: [
      [0.115, 0.54, 0.84], [0.125, 0.54, 0.84], [0.13, 0.52, 0.85], 
      [0.125, 0.50, 0.86], [0.115, 0.50, 0.86], [0.11, 0.52, 0.85]
    ]
  },
  {
    name: 'Duitsland',
    continent: 'Europa',
    position: [0.18, 0.52, 0.83],
    outline: [
      [0.15, 0.56, 0.81], [0.21, 0.56, 0.81], [0.22, 0.48, 0.87], 
      [0.14, 0.48, 0.87]
    ]
  },
  {
    name: 'Frankrijk',
    continent: 'Europa',
    position: [0.08, 0.46, 0.88],
    outline: [
      [0.05, 0.50, 0.86], [0.11, 0.50, 0.86], [0.12, 0.42, 0.91], 
      [0.04, 0.42, 0.91]
    ]
  },
  {
    name: 'Verenigd Koninkrijk',
    continent: 'Europa',
    position: [0.05, 0.55, 0.83],
    outline: [
      [0.03, 0.58, 0.81], [0.07, 0.58, 0.81], [0.08, 0.52, 0.85], 
      [0.02, 0.52, 0.85]
    ]
  },
  {
    name: 'Spanje',
    continent: 'Europa',
    position: [0.05, 0.40, 0.91],
    outline: [
      [0.00, 0.42, 0.91], [0.10, 0.42, 0.91], [0.11, 0.38, 0.93], 
      [-0.01, 0.38, 0.93]
    ]
  },
  {
    name: 'Italië',
    continent: 'Europa',
    position: [0.15, 0.42, 0.89],
    outline: [
      [0.13, 0.48, 0.87], [0.17, 0.48, 0.87], [0.16, 0.36, 0.93], 
      [0.14, 0.36, 0.93]
    ]
  },
  {
    name: 'Polen',
    continent: 'Europa',
    position: [0.22, 0.52, 0.83],
    outline: [
      [0.19, 0.55, 0.81], [0.25, 0.55, 0.81], [0.26, 0.49, 0.85], 
      [0.18, 0.49, 0.85]
    ]
  },
  {
    name: 'Rusland',
    continent: 'Europa',
    position: [0.45, 0.65, 0.61],
    outline: [
      [0.25, 0.75, 0.61], [0.85, 0.80, 0.36], [0.90, 0.50, 0.75], 
      [0.30, 0.45, 0.86]
    ]
  },

  // Asia
  {
    name: 'China',
    continent: 'Azië',
    position: [0.70, 0.35, 0.75],
    outline: [
      [0.60, 0.50, 0.80], [0.80, 0.50, 0.70], [0.85, 0.20, 0.85], 
      [0.55, 0.20, 0.90]
    ]
  },
  {
    name: 'India',
    continent: 'Azië',
    position: [0.42, 0.20, 0.89],
    outline: [
      [0.38, 0.35, 0.85], [0.46, 0.35, 0.85], [0.45, 0.05, 0.95], 
      [0.39, 0.05, 0.95]
    ]
  },
  {
    name: 'Japan',
    continent: 'Azië',
    position: [0.85, 0.35, 0.65],
    outline: [
      [0.83, 0.40, 0.60], [0.87, 0.38, 0.62], [0.88, 0.30, 0.70], 
      [0.82, 0.32, 0.68]
    ]
  },
  {
    name: 'Iran',
    continent: 'Azië',
    position: [0.25, 0.25, 0.93],
    outline: [
      [0.22, 0.30, 0.91], [0.28, 0.30, 0.91], [0.29, 0.20, 0.95], 
      [0.21, 0.20, 0.95]
    ]
  },
  {
    name: 'Afghanistan',
    continent: 'Azië',
    position: [0.35, 0.3, 0.88],
    outline: [
      [0.32, 0.35, 0.86], [0.38, 0.35, 0.86], [0.39, 0.25, 0.90], 
      [0.31, 0.25, 0.90]
    ]
  },

  // Africa
  {
    name: 'Egypte',
    continent: 'Afrika',
    position: [0.20, 0.30, 0.94],
    outline: [
      [0.18, 0.35, 0.92], [0.22, 0.35, 0.92], [0.23, 0.25, 0.96], 
      [0.17, 0.25, 0.96]
    ]
  },
  {
    name: 'Marokko',
    continent: 'Afrika',
    position: [0.02, 0.32, 0.95],
    outline: [
      [0.00, 0.36, 0.93], [0.04, 0.36, 0.93], [0.05, 0.28, 0.97], 
      [-0.01, 0.28, 0.97]
    ]
  },
  {
    name: 'Nigeria',
    continent: 'Afrika',
    position: [0.10, 0.08, 0.99],
    outline: [
      [0.07, 0.12, 0.97], [0.13, 0.12, 0.97], [0.14, 0.04, 0.99], 
      [0.06, 0.04, 0.99]
    ]
  },
  {
    name: 'Zuid-Afrika',
    continent: 'Afrika',
    position: [0.20, -0.30, 0.95],
    outline: [
      [0.15, -0.25, 0.97], [0.25, -0.25, 0.97], [0.26, -0.35, 0.93], 
      [0.14, -0.35, 0.93]
    ]
  },

  // North America
  {
    name: 'Verenigde Staten',
    continent: 'Noord-Amerika',
    position: [-0.70, 0.40, 0.71],
    outline: [
      [-0.85, 0.60, 0.60], [-0.55, 0.60, 0.60], [-0.50, 0.20, 0.84], 
      [-0.90, 0.20, 0.84]
    ]
  },
  {
    name: 'Canada',
    continent: 'Noord-Amerika',
    position: [-0.65, 0.70, 0.52],
    outline: [
      [-0.90, 0.80, 0.36], [-0.40, 0.80, 0.36], [-0.35, 0.60, 0.68], 
      [-0.95, 0.60, 0.68]
    ]
  },
  {
    name: 'Mexico',
    continent: 'Noord-Amerika',
    position: [-0.70, 0.20, 0.84],
    outline: [
      [-0.80, 0.30, 0.76], [-0.60, 0.30, 0.76], [-0.55, 0.10, 0.92], 
      [-0.85, 0.10, 0.92]
    ]
  },

  // South America
  {
    name: 'Brazilië',
    continent: 'Zuid-Amerika',
    position: [-0.35, -0.15, 0.94],
    outline: [
      [-0.50, 0.05, 0.86], [-0.20, 0.05, 0.86], [-0.15, -0.35, 0.93], 
      [-0.55, -0.35, 0.93]
    ]
  },
  {
    name: 'Argentinië',
    continent: 'Zuid-Amerika',
    position: [-0.45, -0.50, 0.75],
    outline: [
      [-0.50, -0.35, 0.79], [-0.40, -0.35, 0.79], [-0.35, -0.65, 0.71], 
      [-0.55, -0.65, 0.71]
    ]
  },

  // Oceania
  {
    name: 'Australië',
    continent: 'Oceanië',
    position: [0.75, -0.30, 0.65],
    outline: [
      [0.65, -0.20, 0.75], [0.85, -0.20, 0.55], [0.88, -0.40, 0.47], 
      [0.62, -0.40, 0.75]
    ]
  }
];

function CountryArea({ country, onHover, isHovered, isDark, selectedCategories }: { 
  country: Country; 
  onHover: (country: Country | null) => void;
  isHovered: boolean;
  isDark: boolean;
  selectedCategories: string[];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  // Use a simple cylinder geometry positioned at the country location
  // This creates a flat, clickable area without needing ConvexGeometry
  
  return (
    <group>
      <mesh
        ref={meshRef}
        position={country.position}
        onPointerOver={() => onHover(country)}
        onPointerOut={() => onHover(null)}
      >
        <cylinderGeometry args={[0.08, 0.08, 0.01, 8]} />
        <meshLambertMaterial
          color={isHovered ? 
            (isDark ? "#f1f5f9" : "#64748b") : 
            (isDark ? "#cbd5e1" : "#e2e8f0")
          }
          transparent
          opacity={isHovered ? 0.7 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
      {isHovered && (
        <Html position={country.position} distanceFactor={20}>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg px-2 py-1 shadow-md border border-gray-200/50 dark:border-gray-600/50 pointer-events-none animate-fade-in">
            <p className="text-xs font-medium text-gray-900 dark:text-white">{country.name}</p>
          </div>
        </Html>
      )}
    </group>
  );
}

function Pin({ pin, onClick, isVisible, isDark }: { 
  pin: StoryPin; 
  onClick: (pin: StoryPin) => void; 
  isVisible: boolean;
  isDark: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const pinRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (pinRef.current) {
      if (hovered) {
        // Gentle pulsing effect when hovered
        const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        pinRef.current.scale.setScalar(pulseScale);
        
        // Soft glow effect
        if (glowRef.current) {
          const glowIntensity = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
          glowRef.current.scale.setScalar(2 + glowIntensity);
        }
      } else {
        pinRef.current.scale.setScalar(1);
        if (glowRef.current) {
          glowRef.current.scale.setScalar(0);
        }
      }
    }
  });

  if (!isVisible) return null;

  return (
    <group position={pin.position}>
      {/* Soft glow effect */}
      <mesh
        ref={glowRef}
        onClick={() => onClick(pin)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.035, 16, 16]} />
        <meshBasicMaterial 
          color={isDark ? "#fbbf24" : "#f59e0b"}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Main pin */}
      <mesh
        ref={pinRef}
        onClick={() => onClick(pin)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshLambertMaterial 
          color={hovered ? (isDark ? "#fbbf24" : "#f59e0b") : (isDark ? "#ea580c" : "#dc2626")}
        />
      </mesh>
      
      {hovered && (
        <Html distanceFactor={15} position={[0, 0.08, 0]}>
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-200/50 dark:border-gray-600/50 max-w-48 animate-fade-in transition-all duration-300 ease-out">
            <h3 className="font-medium text-gray-900 dark:text-white text-xs leading-tight">{pin.person.name}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 leading-snug">{pin.person.description}</p>
            <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-gray-200/50 dark:border-gray-600/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">{pin.conversations.toLocaleString()}+ gesprekken</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GlobeComponent({ selectedCategories, onPinClick, isDark }: GlobeProps) {
  const globeRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  useEffect(() => {
    // Position camera for optimal viewing
    camera.position.set(0, 0, 2.8);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Auto-rotate the globe slowly
  useFrame(() => {
    if (globeRef.current) {
      globeRef.current.rotation.y += 0.002; // Very slow rotation
    }
  });

  const filteredPins = storyPins.filter(pin => 
    selectedCategories.length === 0 || selectedCategories.includes(pin.person.category)
  );

  const filteredCountries = countries.filter(country =>
    selectedCategories.length === 0 || 
    storyPins.some(pin => 
      pin.country === country.name && 
      selectedCategories.includes(pin.person.category)
    )
  );

  return (
    <>
      {/* Soft ambient lighting for calm atmosphere */}
      <ambientLight intensity={isDark ? 0.6 : 0.8} />
      <directionalLight position={[2, 2, 2]} intensity={isDark ? 0.3 : 0.4} />
      
      {/* Ocean base - soft deep blue */}
      <Sphere ref={globeRef} args={[1, 64, 64]}>
        <meshLambertMaterial
          color={isDark ? "#1e3a8a" : "#2563eb"}
          transparent
          opacity={0.95}
        />
      </Sphere>

      {/* Country areas with subtle outlines */}
      {(selectedCategories.length === 0 ? countries : filteredCountries).map((country) => (
        <CountryArea 
          key={country.name}
          country={country}
          onHover={setHoveredCountry}
          isHovered={hoveredCountry?.name === country.name}
          isDark={isDark}
          selectedCategories={selectedCategories}
        />
      ))}

      {/* Story pins */}
      {filteredPins.map((pin) => (
        <Pin 
          key={pin.id} 
          pin={pin} 
          onClick={onPinClick}
          isVisible={true}
          isDark={isDark}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={2.2}
        maxDistance={4}
        rotateSpeed={0.3}
        enableDamping
        dampingFactor={0.08}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
        autoRotate={false} // We handle auto-rotation manually for smoother control
      />
    </>
  );
}

export default function Globe({ selectedCategories, onPinClick, isDark }: GlobeProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ fov: 50, position: [0, 0, 2.8] }}>
        <GlobeComponent 
          selectedCategories={selectedCategories}
          onPinClick={onPinClick}
          isDark={isDark}
        />
      </Canvas>
    </div>
  );
}
