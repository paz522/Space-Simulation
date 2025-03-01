import React, { useMemo } from 'react';
import Planet from './Planet';
import SaturnRings from './SaturnRings';
import { loadAllPlanetTextures } from '../utils/loadPlanetTextures';
import EarthClouds from './EarthClouds';
import Asteroid from './Asteroid';
import Comet from './Comet';

const SolarSystemSimulation = ({ scale = 1, customAsteroids = [], customComets = [] }) => {
  // Load textures
  const textures = useMemo(() => loadAllPlanetTextures(), []);
  
  // Settings to make the scale more realistic
  // Note: The actual sizes and distances of celestial bodies are very large, so we adjust the scale for better visualization
  // The following is based on the actual diameters and distances of planets from the Sun, but sizes are exaggerated
  const planetData = [
    // name, size, orbit radius, orbit speed, rotation speed, color, special features
    { 
      name: 'Sun', 
      size: 3.0 * scale, 
      orbitRadius: 0, 
      orbitSpeed: 0, 
      rotationSpeed: 0.0003, 
      color: '#FDB813', 
      texture: 'sun',
      emissive: true, // The sun emits light
      special: 'sun'
    },
    { 
      name: 'Mercury', 
      size: 0.38 * scale, 
      orbitRadius: 5 * scale, 
      orbitSpeed: 0.013, 
      rotationSpeed: 0.0013, 
      color: '#B7B7B7', 
      texture: 'mercury', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.03 // Axial tilt (in radians)
    },
    { 
      name: 'Venus', 
      size: 0.95 * scale, 
      orbitRadius: 7 * scale, 
      orbitSpeed: 0.005, 
      rotationSpeed: 0.0007 * -1, // Venus rotates in the opposite direction
      color: '#E6CA9A', 
      texture: 'venus', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.001
    },
    { 
      name: 'Earth', 
      size: 1.0 * scale, 
      orbitRadius: 10 * scale, 
      orbitSpeed: 0.0033, 
      rotationSpeed: 0.0067, 
      color: '#3B8CF2', 
      texture: 'earth', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.41, // About 23.5 degrees
      special: 'earth',
      moons: [
        { 
          name: 'Moon', 
          size: 0.27 * scale, 
          orbitRadius: 1.5 * scale, 
          orbitSpeed: 0.017, 
          rotationSpeed: 0.0017, 
          color: '#CCCCCC', 
          texture: 'moon'
        }
      ]
    },
    { 
      name: 'Mars', 
      size: 0.53 * scale, 
      orbitRadius: 15 * scale, 
      orbitSpeed: 0.0027, 
      rotationSpeed: 0.006, 
      color: '#B22E1C', 
      texture: 'mars', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.44 // About 25 degrees
    },
    { 
      name: 'Jupiter', 
      size: 2.0 * scale, 
      orbitRadius: 22 * scale, 
      orbitSpeed: 0.0013, 
      rotationSpeed: 0.013, 
      color: '#B5975A', 
      texture: 'jupiter', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.05
    },
    { 
      name: 'Saturn', 
      size: 1.7 * scale, 
      orbitRadius: 30 * scale, 
      orbitSpeed: 0.0008, 
      rotationSpeed: 0.013, 
      color: '#E9D496', 
      texture: 'saturn', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.47, // About 27 degrees
      special: 'saturn',
      rings: {
        innerRadius: 2.0 * scale,
        outerRadius: 3.5 * scale,
        texture: 'saturnRings'
      }
    },
    { 
      name: 'Uranus', 
      size: 1.4 * scale, 
      orbitRadius: 38 * scale, 
      orbitSpeed: 0.0003, 
      rotationSpeed: 0.01, 
      color: '#CAEAE8', 
      texture: 'uranus', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 1.71 // About 98 degrees - Uranus rotates on its side
    },
    { 
      name: 'Neptune', 
      size: 1.4 * scale, 
      orbitRadius: 45 * scale, 
      orbitSpeed: 0.0003, 
      rotationSpeed: 0.01, 
      color: '#3D58E5', 
      texture: 'neptune', 
      initialAngle: Math.random() * Math.PI * 2,
      tilt: 0.49 // About 28 degrees
    }
  ];
  
  return (
    <>
      <group>
        {/* Render planets */}
        {planetData.map((planet, index) => (
          <group key={index}>
            <Planet
              name={planet.name}
              size={planet.size}
              orbitRadius={planet.orbitRadius}
              orbitSpeed={planet.orbitSpeed}
              rotationSpeed={planet.rotationSpeed}
              color={planet.color}
              textureMap={textures[planet.texture]}
              initialAngle={planet.initialAngle || 0}
              showOrbit={planet.orbitRadius > 0}
              tilt={planet.tilt || 0}
              emissive={planet.emissive || false}
            />
            
            {/* Saturn's rings */}
            {planet.special === 'saturn' && planet.rings && (
              <SaturnRings 
                planetRef={null}
                innerRadius={planet.rings.innerRadius}
                outerRadius={planet.rings.outerRadius}
                texture={textures[planet.rings.texture]}
                orbitRadius={planet.orbitRadius}
                orbitSpeed={planet.orbitSpeed}
                initialAngle={planet.initialAngle || 0}
                tilt={planet.tilt || 0}
              />
            )}
            
            {/* Earth's clouds */}
            {planet.special === 'earth' && (
              <EarthClouds
                size={planet.size * 1.02}
                orbitRadius={planet.orbitRadius}
                orbitSpeed={planet.orbitSpeed}
                rotationSpeed={planet.rotationSpeed * 1.2}
                textureMap={textures.earthClouds}
                initialAngle={planet.initialAngle || 0}
                tilt={planet.tilt || 0}
              />
            )}
            
            {/* Render moons */}
            {planet.moons && planet.moons.map((moon, moonIndex) => (
              <group key={`moon-${index}-${moonIndex}`} position={[0, 0, 0]}>
                <Planet
                  parentPlanet={{
                    orbitRadius: planet.orbitRadius,
                    orbitSpeed: planet.orbitSpeed,
                    initialAngle: planet.initialAngle || 0
                  }}
                  name={moon.name}
                  size={moon.size}
                  orbitRadius={moon.orbitRadius}
                  orbitSpeed={moon.orbitSpeed}
                  rotationSpeed={moon.rotationSpeed}
                  color={moon.color}
                  textureMap={textures[moon.texture]}
                  initialAngle={Math.random() * Math.PI * 2}
                  showOrbit={true}
                />
              </group>
            ))}
          </group>
        ))}
        
        {/* Render custom asteroids */}
        {customAsteroids.map(asteroid => (
          <Asteroid
            key={asteroid.id}
            name={asteroid.name}
            size={asteroid.size * scale}
            orbitRadius={asteroid.orbitRadius * scale}
            orbitSpeed={asteroid.orbitSpeed}
            rotationSpeed={asteroid.rotationSpeed}
            color={asteroid.color}
            irregularShape={asteroid.irregularShape}
            initialAngle={asteroid.initialAngle}
            inclination={asteroid.inclination}
            showOrbit={true}
          />
        ))}
        
        {/* Render custom comets */}
        {customComets.map(comet => (
          <Comet
            key={comet.id}
            name={comet.name}
            size={comet.size * scale}
            perihelion={comet.perihelion * scale}
            aphelion={comet.aphelion * scale}
            orbitSpeed={comet.orbitSpeed}
            rotationSpeed={comet.rotationSpeed}
            color={comet.color}
            tailLength={comet.tailLength * scale}
            tailColor={comet.tailColor}
            initialAngle={comet.initialAngle}
            inclination={comet.inclination}
            showOrbit={true}
          />
        ))}
        
        {/* Ambient light */}
        <ambientLight intensity={0.5} />
        
        {/* Sun light source */}
        <pointLight position={[0, 0, 0]} intensity={2.5} color="#FFFFFF" distance={100} decay={0.5} />
        
        {/* Additional light sources - to brighten everything */}
        <directionalLight position={[10, 10, 5]} intensity={0.5} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      </group>
    </>
  );
};

export default SolarSystemSimulation; 