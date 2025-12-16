import React from 'react';
import './TimelineAnalysis.css';

const TimelineAnalysis = ({ isActive }) => {
  return (
    <div className={`timeline-section ${isActive ? 'active' : ''}`}>
      <div className="timeline-container">
        <h2 className="section-title">Timeline Analysis</h2>
        <p className="section-subtitle">Annual Co-Benefits Growth 2025-2050</p>
        <div className="timeline-placeholder">
          🚧 Timeline chart implementation coming soon...
        </div>
      </div>
    </div>
  );
};

export default TimelineAnalysis;
