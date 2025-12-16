import React, { useState, useEffect } from 'react';
import './OverviewDashboard.css';

const OverviewDashboard = ({ isActive }) => {
  const [animate, setAnimate] = useState(false);
  const [heroValue, setHeroValue] = useState(0);
  
  const targetValue = 2847; // Million GBP - placeholder value
  
  const metrics = [
    { icon: '💰', value: '£2.85B', label: 'Total Economic Impact', detail: '2025-2050' },
    { icon: '💚', value: '125,420', label: 'QALY Gains', detail: 'Quality-adjusted life years' },
    { icon: '🌱', value: '1.2M', label: 'CO₂ Reduction', detail: 'Tonnes annually' },
    { icon: '👥', value: '524,930', label: 'Population Affected', detail: 'Edinburgh residents' },
    { icon: '📅', value: '25 Years', label: 'Time Period', detail: '2025-2050' },
    { icon: '📍', value: '487', label: 'Small Areas', detail: 'Datazones covered' }
  ];

  useEffect(() => {
    if (isActive) {
      setAnimate(true);
      // Counter animation for hero value
      let start = 0;
      const duration = 2000;
      const increment = targetValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= targetValue) {
          setHeroValue(targetValue);
          clearInterval(timer);
        } else {
          setHeroValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isActive]);

  return (
    <div className={`overview-dashboard ${isActive ? 'active' : ''}`}>
      <div className="overview-container">
        {/* Hero Statistic */}
        <div className={`hero-stat ${animate ? 'animate' : ''}`}>
          <div className="hero-label">Total Net-Zero Co-Benefits</div>
          <div className="hero-value">
            £{heroValue.toLocaleString()}<span className="hero-unit">M</span>
          </div>
          <div className="hero-subtitle">Net Present Value (2025-2050)</div>
        </div>

        {/* Summary Text */}
        <div className={`summary-text ${animate ? 'animate' : ''}`}>
          <p>
            Edinburgh's journey to net-zero delivers substantial economic and health benefits.
            Our analysis reveals how climate action translates into cleaner air, better health,
            and improved quality of life for over half a million residents.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`metric-card ${animate ? 'animate' : ''}`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="metric-icon rotating">{metric.icon}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-detail">{metric.detail}</div>
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className={`scroll-hint ${animate ? 'animate' : ''}`}>
          Scroll to explore timeline →
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
