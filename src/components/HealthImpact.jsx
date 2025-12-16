import React from 'react';
import './HealthImpact.css';

const HealthImpact = ({ isActive }) => {
  return (
    <div className={`health-section ${isActive ? 'active' : ''}`}>
      <div className="health-container">
        <h2 className="section-title">Health Impact Deep Dive</h2>
        <p className="section-subtitle">Health vs Non-Health Benefits</p>
        <div className="health-placeholder">
          🚧 Health impact analysis coming soon...
        </div>
      </div>
    </div>
  );
};

export default HealthImpact;
