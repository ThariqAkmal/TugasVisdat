import React, { useState, useEffect, useRef } from 'react';
import './TimelineAnalysis.css';
import { 
  annualTimelineData, 
  timePeriods, 
  ukTotalBenefits,
  formatNumber 
} from '../data/ukCobenefitsData';

const TimelineAnalysis = ({ isActive }) => {
  const [animate, setAnimate] = useState(false);
  const [hoveredYear, setHoveredYear] = useState(null);
  const [selectedView, setSelectedView] = useState('total'); // 'total', 'health', 'breakdown'
  const chartRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimate(true), 300);
    }
  }, [isActive]);

  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        const { width } = chartRef.current.getBoundingClientRect();
        setDimensions({ width: Math.min(width, 1000), height: 320 });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [isActive]);

  // Chart calculations
  const padding = { top: 40, right: 40, bottom: 50, left: 60 };
  const chartWidth = dimensions.width - padding.left - padding.right;
  const chartHeight = dimensions.height - padding.top - padding.bottom;

  const maxValue = Math.max(...annualTimelineData.map(d => d.total)) * 1.1;
  const minYear = Math.min(...annualTimelineData.map(d => d.year));
  const maxYear = Math.max(...annualTimelineData.map(d => d.year));

  const xScale = (year) => ((year - minYear) / (maxYear - minYear)) * chartWidth + padding.left;
  const yScale = (value) => chartHeight - (value / maxValue) * chartHeight + padding.top;

  // Generate path for area chart
  const generatePath = (data, key) => {
    const points = data.map(d => `${xScale(d.year)},${yScale(d[key])}`);
    return `M ${points.join(' L ')}`;
  };

  const generateAreaPath = (data, key) => {
    const points = data.map(d => `${xScale(d.year)},${yScale(d[key])}`);
    const baseline = `${xScale(maxYear)},${yScale(0)} ${xScale(minYear)},${yScale(0)}`;
    return `M ${points.join(' L ')} L ${baseline} Z`;
  };

  // Period highlights
  const periodHighlights = timePeriods.map(period => ({
    ...period,
    x1: xScale(period.startYear),
    x2: xScale(period.endYear),
    value: ukTotalBenefits.byTimePeriod[period.id]
  }));

  // Y-axis ticks
  const yTicks = [0, 2500, 5000, 7500, 10000];

  return (
    <div className={`timeline-section ${isActive ? 'active' : ''}`}>
      <div className="timeline-container">
        <div className={`timeline-header ${animate ? 'animate' : ''}`}>
          <h2 className="section-title">
            <span className="title-icon">📈</span>
            Timeline Analysis
          </h2>
          <p className="section-subtitle">
            Projected Co-Benefits Growth from 2025 to 2050
          </p>
        </div>

        {/* View Toggle */}
        <div className={`view-toggle ${animate ? 'animate' : ''}`}>
          <button 
            className={`toggle-btn ${selectedView === 'total' ? 'active' : ''}`}
            onClick={() => setSelectedView('total')}
          >
            Total Benefits
          </button>
          <button 
            className={`toggle-btn ${selectedView === 'health' ? 'active' : ''}`}
            onClick={() => setSelectedView('health')}
          >
            Health vs Non-Health
          </button>
        </div>

        {/* Main Chart */}
        <div className={`chart-container ${animate ? 'animate' : ''}`} ref={chartRef}>
          <svg 
            width="100%" 
            height={dimensions.height}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="totalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4ECDC4" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#4ECDC4" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="healthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="nonHealthGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.05" />
              </linearGradient>
              
              {/* Glow filter */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Period Backgrounds */}
            {periodHighlights.map((period, idx) => (
              <g key={period.id}>
                <rect
                  x={period.x1}
                  y={padding.top}
                  width={period.x2 - period.x1}
                  height={chartHeight}
                  fill={idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent'}
                />
                <text
                  x={(period.x1 + period.x2) / 2}
                  y={padding.top - 10}
                  fill="rgba(255,255,255,0.4)"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {period.label}
                </text>
              </g>
            ))}

            {/* Grid Lines */}
            {yTicks.map(tick => (
              <g key={tick}>
                <line
                  x1={padding.left}
                  y1={yScale(tick)}
                  x2={dimensions.width - padding.right}
                  y2={yScale(tick)}
                  stroke="rgba(255,255,255,0.1)"
                  strokeDasharray="4,4"
                />
                <text
                  x={padding.left - 10}
                  y={yScale(tick) + 4}
                  fill="rgba(255,255,255,0.5)"
                  fontSize="11"
                  textAnchor="end"
                >
                  £{tick >= 1000 ? `${tick/1000}B` : `${tick}M`}
                </text>
              </g>
            ))}

            {/* Area Charts */}
            {selectedView === 'total' ? (
              <g className={`chart-area ${animate ? 'animate' : ''}`}>
                <path
                  d={generateAreaPath(annualTimelineData, 'total')}
                  fill="url(#totalGradient)"
                  className="area-path"
                />
                <path
                  d={generatePath(annualTimelineData, 'total')}
                  fill="none"
                  stroke="#4ECDC4"
                  strokeWidth="3"
                  filter="url(#glow)"
                  className="line-path"
                />
              </g>
            ) : (
              <g className={`chart-area ${animate ? 'animate' : ''}`}>
                {/* Non-Health (bottom) */}
                <path
                  d={generateAreaPath(annualTimelineData, 'nonHealth')}
                  fill="url(#nonHealthGradient)"
                  className="area-path"
                />
                <path
                  d={generatePath(annualTimelineData, 'nonHealth')}
                  fill="none"
                  stroke="#9B59B6"
                  strokeWidth="2"
                  className="line-path"
                />
                
                {/* Health (on top) */}
                <path
                  d={generateAreaPath(annualTimelineData, 'health')}
                  fill="url(#healthGradient)"
                  className="area-path"
                />
                <path
                  d={generatePath(annualTimelineData, 'health')}
                  fill="none"
                  stroke="#2ECC71"
                  strokeWidth="2"
                  filter="url(#glow)"
                  className="line-path"
                />
              </g>
            )}

            {/* Data Points & Hover */}
            {annualTimelineData.map((d, idx) => (
              <g key={d.year}>
                <circle
                  cx={xScale(d.year)}
                  cy={yScale(d.total)}
                  r={hoveredYear === d.year ? 8 : 4}
                  fill={hoveredYear === d.year ? '#4ECDC4' : 'rgba(78, 205, 196, 0.8)'}
                  stroke="#fff"
                  strokeWidth="2"
                  className="data-point"
                  style={{ 
                    opacity: animate ? 1 : 0,
                    transition: `all 0.3s ease ${idx * 30}ms`
                  }}
                  onMouseEnter={() => setHoveredYear(d.year)}
                  onMouseLeave={() => setHoveredYear(null)}
                />
                
                {/* X-axis labels (every 5 years) */}
                {d.year % 5 === 0 && (
                  <text
                    x={xScale(d.year)}
                    y={dimensions.height - 15}
                    fill="rgba(255,255,255,0.6)"
                    fontSize="12"
                    textAnchor="middle"
                  >
                    {d.year}
                  </text>
                )}
              </g>
            ))}

            {/* Tooltip */}
            {hoveredYear && (
              <g className="tooltip-group">
                {(() => {
                  const data = annualTimelineData.find(d => d.year === hoveredYear);
                  const x = xScale(hoveredYear);
                  const y = yScale(data.total);
                  return (
                    <>
                      <line
                        x1={x}
                        y1={y}
                        x2={x}
                        y2={chartHeight + padding.top}
                        stroke="rgba(78, 205, 196, 0.3)"
                        strokeDasharray="4,4"
                      />
                      <rect
                        x={x - 60}
                        y={y - 65}
                        width="120"
                        height="55"
                        rx="8"
                        fill="rgba(0,0,0,0.85)"
                        stroke="rgba(78, 205, 196, 0.5)"
                      />
                      <text x={x} y={y - 45} fill="#fff" fontSize="12" fontWeight="600" textAnchor="middle">
                        {hoveredYear}
                      </text>
                      <text x={x} y={y - 28} fill="#4ECDC4" fontSize="14" fontWeight="700" textAnchor="middle">
                        £{formatNumber(data.total)}M
                      </text>
                      <text x={x - 30} y={y - 12} fill="#2ECC71" fontSize="10" textAnchor="middle">
                        Health: £{formatNumber(data.health)}M
                      </text>
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="chart-legend">
            {selectedView === 'total' ? (
              <div className="legend-item">
                <span className="legend-dot" style={{ background: '#4ECDC4' }}></span>
                <span>Total Annual Co-Benefits</span>
              </div>
            ) : (
              <>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#2ECC71' }}></span>
                  <span>Health Benefits</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ background: '#9B59B6' }}></span>
                  <span>Non-Health Benefits</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Period Summary Cards */}
        <div className={`period-cards ${animate ? 'animate' : ''}`}>
          {timePeriods.map((period, idx) => (
            <div 
              key={period.id}
              className="period-card"
              style={{ animationDelay: `${idx * 100 + 500}ms` }}
            >
              <div className="period-years">{period.label}</div>
              <div className="period-value">
                £{(ukTotalBenefits.byTimePeriod[period.id] / 1000).toFixed(1)}B
              </div>
              <div className="period-bar">
                <div 
                  className="period-bar-fill"
                  style={{ 
                    width: animate ? `${(ukTotalBenefits.byTimePeriod[period.id] / 48320) * 100}%` : '0%',
                    transitionDelay: `${idx * 100 + 800}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Key Insight */}
        <div className={`timeline-insight ${animate ? 'animate' : ''}`}>
          <div className="insight-icon">💡</div>
          <div className="insight-text">
            <strong>Peak Benefits Period:</strong> The 2040-2044 period shows maximum annual co-benefits 
            as net-zero actions reach full maturity, delivering approximately <span className="highlight">£48.3B</span> in 
            cumulative benefits during this phase.
          </div>
        </div>

        {/* Scroll Hint */}
        <div className={`scroll-hint ${animate ? 'animate' : ''}`}>
          <span>Explore Categories Breakdown</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TimelineAnalysis;
