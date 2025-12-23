import React, { useState, useEffect } from 'react';
import { regionalData } from '../data/ukCobenefitsData';

const UKMapVisualization = ({ animate }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Simplified UK regions SVG paths (stylized representation)
  const regions = {
    scotland: {
      path: 'M 120 20 L 140 30 L 155 50 L 160 80 L 150 100 L 130 110 L 110 105 L 95 90 L 90 60 L 100 40 Z',
      center: { x: 125, y: 65 },
      data: regionalData.find(r => r.region === 'Scotland')
    },
    england: {
      path: 'M 130 110 L 150 100 L 165 120 L 180 150 L 175 180 L 165 210 L 145 220 L 120 215 L 105 190 L 100 160 L 110 130 Z',
      center: { x: 140, y: 165 },
      data: regionalData.find(r => r.region === 'England')
    },
    wales: {
      path: 'M 105 160 L 100 180 L 95 195 L 105 205 L 120 200 L 115 175 L 110 160 Z',
      center: { x: 105, y: 180 },
      data: regionalData.find(r => r.region === 'Wales')
    },
    northernIreland: {
      path: 'M 60 90 L 80 85 L 90 95 L 85 110 L 70 115 L 55 105 Z',
      center: { x: 72, y: 100 },
      data: regionalData.find(r => r.region === 'Northern Ireland')
    }
  };

  return (
    <div className="uk-map-container" style={{ position: 'relative' }}>
      <svg viewBox="0 0 250 250" style={{ width: '100%', maxWidth: '400px' }}>
        <defs>
          <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {Object.entries(regions).map(([key, region], idx) => (
          <g key={key}>
            <path
              d={region.path}
              fill={hoveredRegion === key ? region.data?.color || '#4ECDC4' : 'rgba(78, 205, 196, 0.3)'}
              stroke={hoveredRegion === key ? '#fff' : 'rgba(255,255,255,0.3)'}
              strokeWidth={hoveredRegion === key ? 2 : 1}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                opacity: animate ? 1 : 0,
                transform: animate ? 'scale(1)' : 'scale(0.8)',
                transformOrigin: `${region.center.x}px ${region.center.y}px`,
                transitionDelay: `${idx * 100}ms`
              }}
              onMouseEnter={() => setHoveredRegion(key)}
              onMouseLeave={() => setHoveredRegion(null)}
              filter={hoveredRegion === key ? 'url(#mapGlow)' : 'none'}
            />
            {hoveredRegion === key && (
              <text
                x={region.center.x}
                y={region.center.y}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                fontWeight="600"
                style={{ pointerEvents: 'none' }}
              >
                {region.data?.region}
              </text>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredRegion && regions[hoveredRegion]?.data && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(78, 205, 196, 0.5)',
          borderRadius: '12px',
          padding: '1rem',
          minWidth: '180px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: '#fff',
            marginBottom: '0.5rem'
          }}>
            {regions[hoveredRegion].data.region}
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: '700', 
            color: '#4ECDC4',
            marginBottom: '0.5rem'
          }}>
            £{(regions[hoveredRegion].data.totalBenefit / 1000).toFixed(1)}B
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.6)'
          }}>
            {regions[hoveredRegion].data.smallAreas.toLocaleString()} small areas
          </div>
          <div style={{ 
            fontSize: '0.8rem', 
            color: 'rgba(255,255,255,0.6)'
          }}>
            £{regions[hoveredRegion].data.perCapita.toLocaleString()} per capita
          </div>
        </div>
      )}
    </div>
  );
};

export default UKMapVisualization;
