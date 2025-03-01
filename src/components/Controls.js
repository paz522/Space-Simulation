import React from 'react';

const Controls = ({ 
  params, 
  updateParams, 
  simulationType, 
  setSimulationType,
  solarSystemParams,
  updateSolarSystemParams
}) => {
  const handleParticleCountChange = (e) => {
    updateParams({ particleCount: parseInt(e.target.value) });
  };

  const handleRadiusChange = (e) => {
    updateParams({ galaxyRadius: parseFloat(e.target.value) });
  };

  const handleThicknessChange = (e) => {
    updateParams({ galaxyThickness: parseFloat(e.target.value) });
  };

  const handleRotationSpeedChange = (e) => {
    updateParams({ rotationSpeed: parseFloat(e.target.value) });
  };

  const handleSolarSystemScaleChange = (e) => {
    updateSolarSystemParams({ scale: parseFloat(e.target.value) });
  };

  const handleSolarSystemPositionChange = (axis, e) => {
    const newPosition = [...solarSystemParams.position];
    const index = axis === 'x' ? 0 : axis === 'y' ? 1 : 2;
    newPosition[index] = parseFloat(e.target.value);
    updateSolarSystemParams({ position: newPosition });
  };

  return (
    <div className="controls">
      <h1>Space Simulation</h1>
      
      <div className="simulation-selector">
        <button 
          onClick={() => setSimulationType('galaxy')}
          className={simulationType === 'galaxy' ? 'active' : ''}
        >
          Focus on Galaxy
        </button>
        <button 
          onClick={() => setSimulationType('solarSystem')}
          className={simulationType === 'solarSystem' ? 'active' : ''}
        >
          Focus on Solar System
        </button>
      </div>

      <div className="galaxy-controls">
        <h2>Galaxy Settings</h2>
        <div className="slider-container">
          <label>
            Particle Count: {params.particleCount}
            <input 
              type="range" 
              min="5000" 
              max="50000" 
              step="5000" 
              value={params.particleCount} 
              onChange={handleParticleCountChange} 
            />
          </label>
        </div>
        
        <div className="slider-container">
          <label>
            Galaxy Radius: {params.galaxyRadius}
            <input 
              type="range" 
              min="5" 
              max="20" 
              step="1" 
              value={params.galaxyRadius} 
              onChange={handleRadiusChange} 
            />
          </label>
        </div>
        
        <div className="slider-container">
          <label>
            Galaxy Thickness: {params.galaxyThickness}
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.5" 
              value={params.galaxyThickness} 
              onChange={handleThicknessChange} 
            />
          </label>
        </div>
        
        <div className="slider-container">
          <label>
            Rotation Speed: {params.rotationSpeed}
            <input 
              type="range" 
              min="0.01" 
              max="0.1" 
              step="0.01" 
              value={params.rotationSpeed} 
              onChange={handleRotationSpeedChange} 
            />
          </label>
        </div>
      </div>
      
      <div className="solar-system-controls">
        <h2>Solar System Settings</h2>
        <div className="slider-container">
          <label>
            Scale: {solarSystemParams.scale}
            <input 
              type="range" 
              min="0.05" 
              max="0.5" 
              step="0.05" 
              value={solarSystemParams.scale} 
              onChange={handleSolarSystemScaleChange} 
            />
          </label>
        </div>
        
        <h3>Position in Galaxy</h3>
        <div className="slider-container">
          <label>
            X: {solarSystemParams.position[0]}
            <input 
              type="range" 
              min="-10" 
              max="10" 
              step="0.5" 
              value={solarSystemParams.position[0]} 
              onChange={(e) => handleSolarSystemPositionChange('x', e)} 
            />
          </label>
        </div>
        
        <div className="slider-container">
          <label>
            Y: {solarSystemParams.position[1]}
            <input 
              type="range" 
              min="-5" 
              max="5" 
              step="0.5" 
              value={solarSystemParams.position[1]} 
              onChange={(e) => handleSolarSystemPositionChange('y', e)} 
            />
          </label>
        </div>
        
        <div className="slider-container">
          <label>
            Z: {solarSystemParams.position[2]}
            <input 
              type="range" 
              min="-10" 
              max="10" 
              step="0.5" 
              value={solarSystemParams.position[2]} 
              onChange={(e) => handleSolarSystemPositionChange('z', e)} 
            />
          </label>
        </div>
      </div>
    </div>
  );
};

export default Controls; 