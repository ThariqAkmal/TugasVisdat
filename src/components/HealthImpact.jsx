import React, { useState, useEffect } from 'react';
import './HealthImpact.css';
import { 
  healthNonHealthData, 
  edinburghData,
  edinburghTrafficData,
  formatNumber 
} from '../data/ukCobenefitsData';

const HealthImpact = ({ isActive }) => {
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState('comparison');
  const [hoveredPath, setHoveredPath] = useState(null);

  useEffect(() => {
    if (isActive) {
      setTimeout(() => setAnimate(true), 300);
    }
  }, [isActive]);

  const { health, nonHealth } = healthNonHealthData;
  const totalBenefits = health.total + nonHealth.total;

  // Animated counter hook
  const AnimatedValue = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!animate) return;
      let start = 0;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          setDisplayValue(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }, [animate, value, duration]);

    return <span>{prefix}{formatNumber(Math.round(displayValue))}{suffix}</span>;
  };

  // Generate wave path for organic shapes
  const generateWavePath = (percentage, isHealth) => {
    const width = 200;
    const height = percentage * 2;
    const yOffset = isHealth ? 200 - height : 200;
    return `M 0 ${yOffset + height} 
            Q 50 ${yOffset + height - 10} 100 ${yOffset + height} 
            T 200 ${yOffset + height} 
            L 200 ${yOffset} 
            Q 150 ${yOffset + 10} 100 ${yOffset} 
            T 0 ${yOffset} Z`;
  };

  return (
    <div className={`health-section ${isActive ? 'active' : ''}`}>
      <div className="health-container">
        <div className={`health-header ${animate ? 'animate' : ''}`}>
          <h2 className="section-title">
            <span className="title-icon">💚</span>
            Health Impact Analysis
          </h2>
          <p className="section-subtitle">
            Understanding the Health vs Non-Health Benefits Distribution
          </p>
        </div>

        {/* Tab Navigation */}
        <div className={`tab-navigation ${animate ? 'animate' : ''}`}>
          <button 
            className={`tab-btn ${activeTab === 'comparison' ? 'active' : ''}`}
            onClick={() => setActiveTab('comparison')}
          >
            Health vs Non-Health
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pathways' ? 'active' : ''}`}
            onClick={() => setActiveTab('pathways')}
          >
            Damage Pathways
          </button>
          <button 
            className={`tab-btn ${activeTab === 'edinburgh' ? 'active' : ''}`}
            onClick={() => setActiveTab('edinburgh')}
          >
            Edinburgh Focus
          </button>
        </div>

        {/* Health vs Non-Health Comparison */}
        {activeTab === 'comparison' && (
          <div className={`comparison-view ${animate ? 'animate' : ''}`}>
            <div className="comparison-cards">
              {/* Health Card */}
              <div className="comparison-card health-card">
                <div className="card-glow health-glow"></div>
                <div className="card-icon">💚</div>
                <h3>Health Benefits</h3>
                <div className="card-value">
                  <AnimatedValue value={health.total} prefix="£" suffix="M" />
                </div>
                <div className="card-percentage">{health.percentage.toFixed(1)}% of total</div>
                
                <div className="card-breakdown">
                  {health.categories.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="breakdown-item" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="breakdown-header">
                        <span className="breakdown-name">{cat.name}</span>
                        <span className="breakdown-value">£{(cat.value / 1000).toFixed(1)}B</span>
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill"
                          style={{ 
                            width: animate ? `${(cat.value / health.total) * 100}%` : '0%',
                            background: cat.color,
                            transitionDelay: `${idx * 100 + 500}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visual Separator */}
              <div className="comparison-visual">
                <svg viewBox="0 0 200 200" className="wave-chart">
                  <defs>
                    <linearGradient id="healthWaveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#2ECC71" stopOpacity="0.3" />
                    </linearGradient>
                    <linearGradient id="nonHealthWaveGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                      <stop offset="0%" stopColor="#9B59B6" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#9B59B6" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                  
                  {/* Health portion (bottom) */}
                  <rect 
                    x="0" y={200 - health.percentage * 2} 
                    width="200" height={health.percentage * 2}
                    fill="url(#healthWaveGrad)"
                    className={`wave-fill ${animate ? 'animate' : ''}`}
                  />
                  
                  {/* Non-Health portion (top) */}
                  <rect 
                    x="0" y="0" 
                    width="200" height={nonHealth.percentage * 2}
                    fill="url(#nonHealthWaveGrad)"
                    className={`wave-fill ${animate ? 'animate' : ''}`}
                  />
                  
                  {/* Divider line */}
                  <line 
                    x1="0" y1={nonHealth.percentage * 2} 
                    x2="200" y2={nonHealth.percentage * 2}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  />
                  
                  {/* Labels */}
                  <text x="100" y={nonHealth.percentage} fill="#fff" fontSize="14" fontWeight="600" textAnchor="middle">
                    Non-Health
                  </text>
                  <text x="100" y={nonHealth.percentage + 20} fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">
                    {nonHealth.percentage.toFixed(1)}%
                  </text>
                  
                  <text x="100" y={200 - health.percentage + 40} fill="#fff" fontSize="14" fontWeight="600" textAnchor="middle">
                    Health
                  </text>
                  <text x="100" y={200 - health.percentage + 60} fill="rgba(255,255,255,0.7)" fontSize="12" textAnchor="middle">
                    {health.percentage.toFixed(1)}%
                  </text>
                </svg>
                
                <div className="total-indicator">
                  <div className="total-label">Total Benefits</div>
                  <div className="total-value">£{(totalBenefits / 1000).toFixed(1)}B</div>
                </div>
              </div>

              {/* Non-Health Card */}
              <div className="comparison-card nonhealth-card">
                <div className="card-glow nonhealth-glow"></div>
                <div className="card-icon">🏛️</div>
                <h3>Non-Health Benefits</h3>
                <div className="card-value">
                  <AnimatedValue value={nonHealth.total} prefix="£" suffix="M" />
                </div>
                <div className="card-percentage">{nonHealth.percentage.toFixed(1)}% of total</div>
                
                <div className="card-breakdown">
                  {nonHealth.categories.slice(0, 5).map((cat, idx) => (
                    <div key={idx} className="breakdown-item" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="breakdown-header">
                        <span className="breakdown-name">{cat.name}</span>
                        <span className="breakdown-value">£{(cat.value / 1000).toFixed(1)}B</span>
                      </div>
                      <div className="breakdown-bar">
                        <div 
                          className="breakdown-fill"
                          style={{ 
                            width: animate ? `${(cat.value / nonHealth.total) * 100}%` : '0%',
                            background: cat.color,
                            transitionDelay: `${idx * 100 + 500}ms`
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Damage Pathways View */}
        {activeTab === 'pathways' && (
          <div className={`pathways-view ${animate ? 'animate' : ''}`}>
            <div className="pathways-grid">
              {/* Health Pathways */}
              <div className="pathways-column">
                <h3 className="pathways-title">
                  <span className="pathway-dot health"></span>
                  Health Benefit Pathways
                </h3>
                {health.pathways.map((pathway, idx) => (
                  <div 
                    key={idx}
                    className={`pathway-card ${hoveredPath === `h-${idx}` ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredPath(`h-${idx}`)}
                    onMouseLeave={() => setHoveredPath(null)}
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="pathway-header">
                      <span className="pathway-name">{pathway.name}</span>
                      <span className="pathway-percentage">{pathway.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="pathway-value">£{(pathway.value / 1000).toFixed(1)}B</div>
                    <div className="pathway-bar">
                      <div 
                        className="pathway-fill"
                        style={{ 
                          width: animate ? `${pathway.percentage}%` : '0%',
                          background: 'linear-gradient(90deg, #2ECC71, #27AE60)',
                          transitionDelay: `${idx * 150 + 400}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Non-Health Pathways */}
              <div className="pathways-column">
                <h3 className="pathways-title">
                  <span className="pathway-dot nonhealth"></span>
                  Non-Health Benefit Pathways
                </h3>
                {nonHealth.pathways.map((pathway, idx) => (
                  <div 
                    key={idx}
                    className={`pathway-card ${hoveredPath === `n-${idx}` ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredPath(`n-${idx}`)}
                    onMouseLeave={() => setHoveredPath(null)}
                    style={{ animationDelay: `${idx * 150 + 200}ms` }}
                  >
                    <div className="pathway-header">
                      <span className="pathway-name">{pathway.name}</span>
                      <span className="pathway-percentage">{pathway.percentage.toFixed(1)}%</span>
                    </div>
                    <div className="pathway-value">£{(pathway.value / 1000).toFixed(1)}B</div>
                    <div className="pathway-bar">
                      <div 
                        className="pathway-fill"
                        style={{ 
                          width: animate ? `${pathway.percentage}%` : '0%',
                          background: 'linear-gradient(90deg, #9B59B6, #8E44AD)',
                          transitionDelay: `${idx * 150 + 600}ms`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Insight */}
            <div className="pathways-insight">
              <span className="insight-icon">💡</span>
              <p>
                <strong>Reduced Mortality</strong> accounts for nearly half of all health benefits, 
                representing lives saved through cleaner air, active travel, and healthier diets.
                <strong> Quality of Life (QALY)</strong> improvements make up another third.
              </p>
            </div>
          </div>
        )}

        {/* Edinburgh Focus View */}
        {activeTab === 'edinburgh' && (
          <div className={`edinburgh-view ${animate ? 'animate' : ''}`}>
            <div className="edinburgh-header-card">
              <div className="edinburgh-badge">🏴󠁧󠁢󠁳󠁣󠁴󠁿 City of Edinburgh</div>
              <div className="edinburgh-stats">
                <div className="edin-stat">
                  <div className="edin-stat-value">£{edinburghData.totalBenefit.toFixed(1)}M</div>
                  <div className="edin-stat-label">Total Benefits</div>
                </div>
                <div className="edin-stat">
                  <div className="edin-stat-value">£{formatNumber(edinburghData.perCapita)}</div>
                  <div className="edin-stat-label">Per Capita</div>
                </div>
                <div className="edin-stat">
                  <div className="edin-stat-value">{edinburghData.smallAreas}</div>
                  <div className="edin-stat-label">Small Areas</div>
                </div>
                <div className="edin-stat">
                  <div className="edin-stat-value">{formatNumber(edinburghData.population)}</div>
                  <div className="edin-stat-label">Population</div>
                </div>
              </div>
            </div>

            <div className="edinburgh-grid">
              {/* Benefits by Type */}
              <div className="edin-card benefits-card">
                <h4>Benefits by Category</h4>
                <div className="benefits-list">
                  {Object.entries(edinburghData.byType)
                    .filter(([_, v]) => v > 0)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([key, value], idx) => (
                      <div key={key} className="benefit-row" style={{ animationDelay: `${idx * 100}ms` }}>
                        <span className="benefit-name">{key.replace(/_/g, ' ')}</span>
                        <div className="benefit-bar-wrapper">
                          <div 
                            className="benefit-bar"
                            style={{ 
                              width: animate ? `${(value / 523.4) * 100}%` : '0%',
                              transitionDelay: `${idx * 100 + 500}ms`
                            }}
                          />
                        </div>
                        <span className="benefit-value">£{value.toFixed(1)}M</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="edin-card timeline-card">
                <h4>Benefits by Period</h4>
                <div className="period-bars">
                  {Object.entries(edinburghData.byTimePeriod).map(([period, value], idx) => (
                    <div key={period} className="period-row" style={{ animationDelay: `${idx * 100}ms` }}>
                      <span className="period-label">{period.replace('Y', '').replace('_', '-')}</span>
                      <div className="period-bar-wrapper">
                        <div 
                          className="period-bar"
                          style={{ 
                            width: animate ? `${(value / 384.8) * 100}%` : '0%',
                            transitionDelay: `${idx * 100 + 500}ms`
                          }}
                        />
                      </div>
                      <span className="period-value">£{value.toFixed(1)}M</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Traffic Trends */}
              <div className="edin-card traffic-card">
                <h4>🚗 Traffic Trends (Historical)</h4>
                <p className="traffic-note">Secondary dataset: Annual traffic counts</p>
                <div className="traffic-chart">
                  <svg viewBox="0 0 300 150" className="traffic-svg">
                    {edinburghTrafficData.years.map((year, idx) => {
                      const x = 30 + idx * 50;
                      const height = (edinburghTrafficData.totalVehicles[idx] / 35000) * 100;
                      return (
                        <g key={year}>
                          <rect
                            x={x}
                            y={130 - height}
                            width="30"
                            height={animate ? height : 0}
                            fill={idx === edinburghTrafficData.years.length - 1 ? '#4ECDC4' : 'rgba(78, 205, 196, 0.5)'}
                            rx="4"
                            className="traffic-bar"
                            style={{ transitionDelay: `${idx * 100}ms` }}
                          />
                          <text x={x + 15} y="145" fill="rgba(255,255,255,0.6)" fontSize="9" textAnchor="middle">
                            {year}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Final Summary */}
        <div className={`final-summary ${animate ? 'animate' : ''}`}>
          <div className="summary-icon">🌍</div>
          <h3>Building a Healthier, Sustainable Future</h3>
          <p>
            The UK's net-zero journey delivers significant co-benefits across health and quality of life. 
            From cleaner air to more active communities, these benefits demonstrate that climate action 
            is not just an environmental imperative—it's an investment in public health and wellbeing.
          </p>
          <div className="summary-cta">
            <a href="https://www.ukcobenefitsatlas.net/" target="_blank" rel="noopener noreferrer" className="cta-button">
              Explore the UK Co-Benefits Atlas →
            </a>
          </div>
        </div>

        {/* Data Attribution */}
        <div className={`attribution ${animate ? 'animate' : ''}`}>
          <p>
            Data Source: Edinburgh Climate Change Institute, University of Edinburgh. 
            "The Co-Benefits of Reaching Net-Zero in the UK" (2025).
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthImpact;
