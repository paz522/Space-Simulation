import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import GalaxySimulation from './components/GalaxySimulation';
import SolarSystemSimulation from './components/SolarSystemSimulation';
import Controls from './components/Controls';
import BackgroundStars from './components/BackgroundStars';
import CameraControls from './components/CameraControls';
import SpaceObjectEditor from './components/SpaceObjectEditor';
import SpaceObjectsList from './components/SpaceObjectsList';

function App() {
  // Galaxy simulation parameters
  const [galaxyParams, setGalaxyParams] = useState({
    particleCount: 10000,
    galaxyRadius: 10,
    galaxyThickness: 2,
    rotationSpeed: 0.05
  });

  // Solar system simulation parameters
  const [solarSystemParams, setSolarSystemParams] = useState({
    scale: 0.1,  // Set scale small to fit within the galaxy
    position: [3, 0, 5]  // Placed at a specific position within the galaxy
  });

  // State to manage user-added asteroids and comets
  const [customAsteroids, setCustomAsteroids] = useState([]);
  const [customComets, setCustomComets] = useState([]);
  
  // Handler for adding asteroids
  const handleAddAsteroid = (asteroidParams) => {
    setCustomAsteroids([...customAsteroids, {
      ...asteroidParams,
      id: Date.now(), // Unique ID
    }]);
  };
  
  // Handler for adding comets
  const handleAddComet = (cometParams) => {
    setCustomComets([...customComets, {
      ...cometParams,
      id: Date.now(),
    }]);
  };
  
  // Handler for removing asteroids
  const handleRemoveAsteroid = (id) => {
    setCustomAsteroids(customAsteroids.filter(asteroid => asteroid.id !== id));
  };
  
  // Handler for removing comets
  const handleRemoveComet = (id) => {
    setCustomComets(customComets.filter(comet => comet.id !== id));
  };

  // Display mode (both simulations are always visible, but which one to focus on)
  const [focusMode, setFocusMode] = useState('galaxy');

  const updateGalaxyParams = (newParams) => {
    setGalaxyParams(prev => ({ ...prev, ...newParams }));
  };

  const updateSolarSystemParams = (newParams) => {
    setSolarSystemParams(prev => ({ ...prev, ...newParams }));
  };

  return (
    <div className="App">
      <Controls
        params={galaxyParams}
        updateParams={updateGalaxyParams}
        simulationType={focusMode} // Use focus mode to toggle UI display
        setSimulationType={setFocusMode}
        solarSystemParams={solarSystemParams}
        updateSolarSystemParams={updateSolarSystemParams}
      />
      
      {/* Asteroid/Comet editor and list - placed outside Canvas */}
      {focusMode === 'solarSystem' && (
        <>
          <SpaceObjectEditor 
            onAddAsteroid={handleAddAsteroid}
            onAddComet={handleAddComet}
          />
          <SpaceObjectsList
            asteroids={customAsteroids}
            comets={customComets}
            onRemoveAsteroid={handleRemoveAsteroid}
            onRemoveComet={handleRemoveComet}
          />
        </>
      )}
      
      <Canvas>
        <ambientLight intensity={0.1} />
        <pointLight position={[10, 10, 10]} />
        <BackgroundStars count={5000} radius={100} />
        <CameraControls 
          focusMode={focusMode} 
          solarSystemPosition={solarSystemParams.position} 
        />

        {/* Galaxy */}
        <GalaxySimulation {...galaxyParams} />
        
        {/* Solar system placed at a specific position within the galaxy */}
        <group position={solarSystemParams.position}>
          <SolarSystemSimulation 
            scale={solarSystemParams.scale}
            customAsteroids={customAsteroids}
            customComets={customComets}
          />
        </group>
      </Canvas>
    </div>
  );
}

export default App; 