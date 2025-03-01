import React, { useState } from 'react';

const SpaceObjectEditor = ({ onAddAsteroid, onAddComet }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [objectType, setObjectType] = useState('asteroid'); // asteroid or comet
  const [params, setParams] = useState({
    name: 'New Asteroid',
    size: 0.2,
    orbitRadius: 25,
    orbitSpeed: 0.001,
    rotationSpeed: 0.005,
    color: '#C0C0C0',
    irregularShape: true,
    inclination: 0.1,
    // Comet-specific parameters
    perihelion: 20,
    aphelion: 50,
    tailLength: 5,
    tailColor: '#88CCFF'
  });

  // Parameter change handler
  const handleParamChange = (param, value) => {
    setParams({...params, [param]: value});
  };

  // Add button handler
  const handleAdd = () => {
    if (objectType === 'asteroid') {
      onAddAsteroid({
        ...params,
        initialAngle: Math.random() * Math.PI * 2
      });
    } else {
      onAddComet({
        ...params,
        initialAngle: Math.random() * Math.PI * 2
      });
    }
    
    // Reset name (keep other parameters)
    setParams({
      ...params,
      name: objectType === 'asteroid' ? 'New Asteroid' : 'New Comet'
    });
  };

  return (
    <div className="space-object-editor">
      <button className="editor-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Close' : 'Add Asteroid/Comet'}
      </button>
      
      {isOpen && (
        <div className="editor-form">
          <div className="object-type-selector">
            <button 
              className={objectType === 'asteroid' ? 'active' : ''} 
              onClick={() => {
                setObjectType('asteroid');
                setParams({
                  ...params,
                  name: 'New Asteroid'
                });
              }}
            >
              Asteroid
            </button>
            <button 
              className={objectType === 'comet' ? 'active' : ''} 
              onClick={() => {
                setObjectType('comet');
                setParams({
                  ...params,
                  name: 'New Comet'
                });
              }}
            >
              Comet
            </button>
          </div>
          
          {/* Common parameters */}
          <div className="param-slider">
            <label>Name:</label>
            <input 
              type="text" 
              value={params.name} 
              onChange={(e) => handleParamChange('name', e.target.value)} 
            />
          </div>
          
          <div className="param-slider">
            <label>Size:</label>
            <input 
              type="range" 
              min="0.05" 
              max="1" 
              step="0.05" 
              value={params.size} 
              onChange={(e) => handleParamChange('size', parseFloat(e.target.value))} 
            />
            <span>{params.size}</span>
          </div>
          
          <div className="param-slider">
            <label>Orbit Radius:</label>
            <input 
              type="range" 
              min="5" 
              max="60" 
              step="1" 
              value={params.orbitRadius} 
              onChange={(e) => handleParamChange('orbitRadius', parseFloat(e.target.value))} 
            />
            <span>{params.orbitRadius}</span>
          </div>
          
          <div className="param-slider">
            <label>Orbit Speed:</label>
            <input 
              type="range" 
              min="0.0001" 
              max="0.005" 
              step="0.0001" 
              value={params.orbitSpeed} 
              onChange={(e) => handleParamChange('orbitSpeed', parseFloat(e.target.value))} 
            />
            <span>{params.orbitSpeed}</span>
          </div>
          
          <div className="param-slider">
            <label>Rotation Speed:</label>
            <input 
              type="range" 
              min="0.001" 
              max="0.05" 
              step="0.001" 
              value={params.rotationSpeed} 
              onChange={(e) => handleParamChange('rotationSpeed', parseFloat(e.target.value))} 
            />
            <span>{params.rotationSpeed}</span>
          </div>
          
          <div className="param-slider">
            <label>Color:</label>
            <input 
              type="color" 
              value={params.color} 
              onChange={(e) => handleParamChange('color', e.target.value)} 
            />
          </div>
          
          <div className="param-slider">
            <label>Inclination:</label>
            <input 
              type="range" 
              min="0" 
              max="1.57" 
              step="0.01" 
              value={params.inclination} 
              onChange={(e) => handleParamChange('inclination', parseFloat(e.target.value))} 
            />
            <span>{Math.round(params.inclination * 57.3)}°</span>
          </div>
          
          {objectType === 'asteroid' && (
            <div className="param-checkbox">
              <label>
                <input 
                  type="checkbox" 
                  checked={params.irregularShape} 
                  onChange={(e) => handleParamChange('irregularShape', e.target.checked)} 
                />
                Irregular Shape
              </label>
            </div>
          )}
          
          {/* Comet-specific parameters */}
          {objectType === 'comet' && (
            <>
              <div className="param-slider">
                <label>Perihelion (closest):</label>
                <input 
                  type="range" 
                  min="5" 
                  max={params.aphelion - 5} 
                  step="1" 
                  value={params.perihelion} 
                  onChange={(e) => handleParamChange('perihelion', parseFloat(e.target.value))} 
                />
                <span>{params.perihelion}</span>
              </div>
              
              <div className="param-slider">
                <label>Aphelion (farthest):</label>
                <input 
                  type="range" 
                  min={params.perihelion + 5} 
                  max="100" 
                  step="1" 
                  value={params.aphelion} 
                  onChange={(e) => handleParamChange('aphelion', parseFloat(e.target.value))} 
                />
                <span>{params.aphelion}</span>
              </div>
              
              <div className="param-slider">
                <label>Tail Length:</label>
                <input 
                  type="range" 
                  min="1" 
                  max="20" 
                  step="1" 
                  value={params.tailLength} 
                  onChange={(e) => handleParamChange('tailLength', parseFloat(e.target.value))} 
                />
                <span>{params.tailLength}</span>
              </div>
              
              <div className="param-slider">
                <label>Tail Color:</label>
                <input 
                  type="color" 
                  value={params.tailColor} 
                  onChange={(e) => handleParamChange('tailColor', e.target.value)} 
                />
              </div>
            </>
          )}
          
          <button className="add-button" onClick={handleAdd}>
            {objectType === 'asteroid' ? 'Add Asteroid' : 'Add Comet'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SpaceObjectEditor; 