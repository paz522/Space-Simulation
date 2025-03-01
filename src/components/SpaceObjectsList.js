import React from 'react';

const SpaceObjectsList = ({ asteroids, comets, onRemoveAsteroid, onRemoveComet }) => {
  // Count of asteroids/comets to display
  const totalObjects = asteroids.length + comets.length;
  
  if (totalObjects === 0) {
    return null; // Don't show anything if there's nothing to display
  }
  
  return (
    <div className="space-objects-list">
      <h3>Asteroids/Comets List ({totalObjects})</h3>
      
      {asteroids.length > 0 && (
        <>
          <h4>Asteroids</h4>
          {asteroids.map((asteroid) => (
            <div key={asteroid.id} className="space-object-item">
              <span>{asteroid.name}</span>
              <button onClick={() => onRemoveAsteroid(asteroid.id)}>Remove</button>
            </div>
          ))}
        </>
      )}
      
      {comets.length > 0 && (
        <>
          <h4>Comets</h4>
          {comets.map((comet) => (
            <div key={comet.id} className="space-object-item">
              <span>{comet.name}</span>
              <button onClick={() => onRemoveComet(comet.id)}>Remove</button>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default SpaceObjectsList; 