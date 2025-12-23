import React, { useState, useEffect, useRef } from 'react';
import './CategoriesBreakdown.css';
import { 
  categoryBreakdown, 
  coBenefitTypes,
  ukTotalBenefits,
  formatNumber 
} from '../data/ukCobenefitsData';

const CategoriesBreakdown = ({ isActive }) => {
  const [animate, setAnimate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hoveredSlice, setHoveredSlice] = useState(null);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimate(true), 300);
    }
  }, [isActive]);

  // Prepare data for donut chart
  const positiveTypes = Object.entries(ukTotalBenefits.byType)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);
  
  const totalPositive = positiveTypes.reduce((sum, [_, v]) => sum + v, 0);

  // Generate donut chart paths
  const generateDonutPath = (startAngle, endAngle, innerRadius, outerRadius) => {
    const startOuter = polarToCartesian(150, 150, outerRadius, endAngle);
    const endOuter = polarToCartesian(150, 150, outerRadius, startAngle);
    const startInner = polarToCartesian(150, 150, innerRadius, endAngle);
    const endInner = polarToCartesian(150, 150, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      'M', startOuter.x, startOuter.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, endOuter.x, endOuter.y,
      'L', endInner.x, endInner.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, startInner.x, startInner.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (cx, cy, r, angle) => {
    const rad = (angle - 90) * Math.PI / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  // Calculate slices
  let currentAngle = 0;
  const slices = positiveTypes.map(([key, value]) => {
    const typeInfo = coBenefitTypes.find(t => t.id === key);
    const percentage = (value / totalPositive) * 100;
    const angle = (percentage / 100) * 360;
    const slice = {
      key,
      value,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: typeInfo?.color || '#666',
      name: typeInfo?.name || key,
      icon: typeInfo?.icon || '📊'
    };
    currentAngle += angle;
    return slice;
  });

  // Costs (negative values)
  const negativeTypes = Object.entries(ukTotalBenefits.byType)
    .filter(([_, value]) => value < 0)
    .sort((a, b) => a[1] - b[1]);

  return (
    <div className={`categories-section ${isActive ? 'active' : ''}`}>
      <div className="categories-container">
        <div className={`categories-header ${animate ? 'animate' : ''}`}>
          <h2 className="section-title">
            <span className="title-icon">📊</span>
            Co-Benefits Categories
          </h2>
          <p className="section-subtitle">
            11 Key Impact Areas Driving Net-Zero Benefits
          </p>
        </div>

        <div className="categories-layout">
          {/* Donut Chart */}
          <div className={`donut-section ${animate ? 'animate' : ''}`}>
            <div className="donut-wrapper">
              <svg viewBox="0 0 300 300" className="donut-chart">
                <defs>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Background ring */}
                <circle 
                  cx="150" 
                  cy="150" 
                  r="100" 
                  fill="none" 
                  stroke="rgba(255,255,255,0.05)" 
                  strokeWidth="50"
                />
                
                {/* Slices */}
                {slices.map((slice, idx) => (
                  <path
                    key={slice.key}
                    d={generateDonutPath(
                      slice.startAngle, 
                      slice.endAngle, 
                      75, 
                      hoveredSlice === slice.key ? 130 : 125
                    )}
                    fill={slice.color}
                    className={`donut-slice ${animate ? 'animate' : ''}`}
                    style={{ 
                      animationDelay: `${idx * 100}ms`,
                      opacity: hoveredSlice && hoveredSlice !== slice.key ? 0.4 : 1,
                      transition: 'all 0.3s ease'
                    }}
                    filter={hoveredSlice === slice.key ? 'url(#shadow)' : 'none'}
                    onMouseEnter={() => setHoveredSlice(slice.key)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => setSelectedCategory(
                      selectedCategory === slice.key ? null : slice.key
                    )}
                  />
                ))}
                
                {/* Center text */}
                <text x="150" y="140" textAnchor="middle" fill="#fff" fontSize="14" fontWeight="400">
                  Total Benefits
                </text>
                <text x="150" y="170" textAnchor="middle" fill="#4ECDC4" fontSize="24" fontWeight="700">
                  £{(totalPositive / 1000).toFixed(1)}B
                </text>
              </svg>
              
              {/* Hover tooltip */}
              {hoveredSlice && (
                <div className="donut-tooltip">
                  <span className="tooltip-icon">
                    {slices.find(s => s.key === hoveredSlice)?.icon}
                  </span>
                  <div className="tooltip-content">
                    <div className="tooltip-name">
                      {slices.find(s => s.key === hoveredSlice)?.name}
                    </div>
                    <div className="tooltip-value">
                      £{(slices.find(s => s.key === hoveredSlice)?.value / 1000).toFixed(1)}B
                    </div>
                    <div className="tooltip-percent">
                      {slices.find(s => s.key === hoveredSlice)?.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="chart-legend">
              {slices.slice(0, 6).map((slice, idx) => (
                <div 
                  key={slice.key}
                  className={`legend-item ${hoveredSlice === slice.key ? 'active' : ''}`}
                  onMouseEnter={() => setHoveredSlice(slice.key)}
                  onMouseLeave={() => setHoveredSlice(null)}
                >
                  <span className="legend-color" style={{ background: slice.color }}></span>
                  <span className="legend-label">{slice.name}</span>
                  <span className="legend-value">{slice.percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Cards */}
          <div className={`category-cards ${animate ? 'animate' : ''}`}>
            {categoryBreakdown.slice(0, 6).map((cat, idx) => (
              <div 
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'expanded' : ''}`}
                style={{ animationDelay: `${idx * 100 + 300}ms` }}
                onClick={() => setSelectedCategory(
                  selectedCategory === cat.id ? null : cat.id
                )}
              >
                <div className="card-header">
                  <span className="card-icon">{cat.icon}</span>
                  <div className="card-info">
                    <h3 className="card-title">{cat.name}</h3>
                    <div className="card-value">£{(cat.totalBenefit / 1000).toFixed(1)}B</div>
                  </div>
                  <div className="card-trend" style={{ 
                    color: cat.trend.startsWith('+') ? '#2ECC71' : '#E74C3C' 
                  }}>
                    {cat.trend}
                  </div>
                </div>
                
                <div className="card-bar">
                  <div 
                    className="card-bar-health"
                    style={{ 
                      width: `${(cat.healthBenefit / cat.totalBenefit) * 100}%`,
                      background: '#2ECC71'
                    }}
                  />
                  <div 
                    className="card-bar-nonhealth"
                    style={{ 
                      width: `${(cat.nonHealthBenefit / cat.totalBenefit) * 100}%`,
                      background: '#9B59B6'
                    }}
                  />
                </div>
                
                {selectedCategory === cat.id && (
                  <div className="card-details">
                    <p className="card-description">{cat.description}</p>
                    <div className="card-metric">
                      <span className="metric-label">Key Impact:</span>
                      <span className="metric-value">{cat.keyMetric}</span>
                    </div>
                    <div className="card-pathways">
                      <div className="pathway-title">Benefit Pathways:</div>
                      {cat.pathways.map((pathway, pIdx) => (
                        <div key={pIdx} className="pathway-item">
                          <span className="pathway-name">{pathway.name}</span>
                          <span className="pathway-value">
                            £{(pathway.value / 1000).toFixed(1)}B
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Costs Section */}
        <div className={`costs-section ${animate ? 'animate' : ''}`}>
          <h3 className="costs-title">⚠️ Associated Costs</h3>
          <div className="costs-grid">
            {negativeTypes.map(([key, value]) => {
              const typeInfo = coBenefitTypes.find(t => t.id === key);
              return (
                <div key={key} className="cost-item">
                  <span className="cost-icon">{typeInfo?.icon || '📊'}</span>
                  <div className="cost-info">
                    <span className="cost-name">{typeInfo?.name || key}</span>
                    <span className="cost-value">-£{Math.abs(value / 1000).toFixed(1)}B</span>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="costs-note">
            Note: Some net-zero actions involve trade-offs, particularly increased travel times 
            from modal shift away from private vehicles.
          </p>
        </div>

        {/* Scroll Hint */}
        <div className={`scroll-hint ${animate ? 'animate' : ''}`}>
          <span>Explore Health Impact Analysis</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CategoriesBreakdown;
