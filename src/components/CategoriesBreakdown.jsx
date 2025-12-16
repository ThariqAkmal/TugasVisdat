import React from 'react';
import './CategoriesBreakdown.css';

const CategoriesBreakdown = ({ isActive }) => {
  return (
    <div className={`categories-section ${isActive ? 'active' : ''}`}>
      <div className="categories-container">
        <h2 className="section-title">Co-Benefits Categories</h2>
        <p className="section-subtitle">11 Key Impact Areas</p>
        <div className="categories-placeholder">
          🚧 Categories breakdown coming soon...
        </div>
      </div>
    </div>
  );
};

export default CategoriesBreakdown;
