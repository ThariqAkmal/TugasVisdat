import React, { useState, useEffect, useRef } from 'react';
import './OverviewDashboard.css';
import { 
  ukTotalBenefits, 
  keyInsights, 
  coBenefitTypes,
  regionalData,
  formatNumber 
} from '../data/ukCobenefitsData';

const OverviewDashboard = ({ isActive }) => {
  const [animate, setAnimate] = useState(false);
  const [heroValue, setHeroValue] = useState(0);
  const [activeInsight, setActiveInsight] = useState(0);
  const canvasRef = useRef(null);
  
  const targetValue = ukTotalBenefits.totalValue;
  
  const metrics = [
    { icon: '💰', value: '£156.8B', label: 'Total Economic Impact', detail: 'UK Net Present Value', color: '#4ECDC4' },
    { icon: '💚', value: '72%', label: 'Health Benefits', detail: 'Of total co-benefits', color: '#2ECC71' },
    { icon: '🌍', value: '46,426', label: 'Small Areas', detail: 'Across UK regions', color: '#9B59B6' },
    { icon: '👥', value: '67M', label: 'Population', detail: 'UK residents benefiting', color: '#FF6B6B' },
    { icon: '📅', value: '25 Years', label: 'Time Period', detail: '2025-2050', color: '#F39C12' },
    { icon: '📈', value: '£2,340', label: 'Per Capita', detail: 'Average benefit', color: '#3498DB' }
  ];

  // Animated particles background
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    
    const particles = [];
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.2
      });
    }
    
    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(125, 162, 169, ${p.alpha})`;
        ctx.fill();
        
        // Connect nearby particles
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(125, 162, 169, ${0.1 * (1 - dist / 150)})`;
            ctx.stroke();
          }
        });
      });
      
      animationId = requestAnimationFrame(animateParticles);
    };
    
    animateParticles();
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isActive]);

  // Counter animation
  useEffect(() => {
    if (isActive) {
      setAnimate(true);
      let start = 0;
      const duration = 2500;
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

  // Auto-rotate insights
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setActiveInsight(prev => (prev + 1) % keyInsights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Mini bar chart for benefits by type
  const topBenefits = Object.entries(ukTotalBenefits.byType)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const maxBenefit = Math.max(...topBenefits.map(([_, v]) => v));

  return (
    <div className={`overview-dashboard ${isActive ? 'active' : ''}`}>
      <canvas ref={canvasRef} className="particles-canvas" />
      
      <div className="overview-container">
        {/* Hero Section */}
        <div className={`hero-section ${animate ? 'animate' : ''}`}>
          <div className="hero-badge">UK Net-Zero Journey 2025-2050</div>
          <div className="hero-stat">
            <div className="hero-label">Total Co-Benefits Value</div>
            <div className="hero-value">
              <span className="currency">£</span>
              {formatNumber(heroValue)}
              <span className="hero-unit">M</span>
            </div>
            <div className="hero-subtitle">
              Net Present Value across all UK regions
            </div>
          </div>
          
          {/* Animated insight carousel */}
          <div className="insight-carousel">
            {keyInsights.map((insight, idx) => (
              <div 
                key={idx}
                className={`insight-card ${activeInsight === idx ? 'active' : ''}`}
              >
                <span className="insight-icon">{insight.icon}</span>
                <div className="insight-content">
                  <div className="insight-value">{insight.value}</div>
                  <div className="insight-title">{insight.title}</div>
                </div>
              </div>
            ))}
            <div className="insight-dots">
              {keyInsights.map((_, idx) => (
                <button 
                  key={idx}
                  className={`dot ${activeInsight === idx ? 'active' : ''}`}
                  onClick={() => setActiveInsight(idx)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Preview Chart */}
        <div className={`benefits-preview ${animate ? 'animate' : ''}`}>
          <h3>Top Co-Benefit Categories</h3>
          <div className="mini-chart">
            {topBenefits.map(([key, value], idx) => {
              const typeInfo = coBenefitTypes.find(t => t.id === key);
              const width = (value / maxBenefit) * 100;
              return (
                <div key={key} className="chart-row" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="chart-label">
                    <span className="chart-icon">{typeInfo?.icon || '📊'}</span>
                    <span className="chart-name">{typeInfo?.name || key}</span>
                  </div>
                  <div className="chart-bar-container">
                    <div 
                      className="chart-bar" 
                      style={{ 
                        width: animate ? `${width}%` : '0%',
                        backgroundColor: typeInfo?.color || '#7da2a9',
                        transitionDelay: `${idx * 100 + 500}ms`
                      }}
                    />
                    <span className="chart-value">£{(value / 1000).toFixed(1)}B</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {metrics.map((metric, index) => (
            <div 
              key={index}
              className={`metric-card ${animate ? 'animate' : ''}`}
              style={{ 
                animationDelay: `${index * 100}ms`,
                '--card-color': metric.color 
              }}
            >
              <div className="metric-icon">{metric.icon}</div>
              <div className="metric-value">{metric.value}</div>
              <div className="metric-label">{metric.label}</div>
              <div className="metric-detail">{metric.detail}</div>
              <div className="metric-glow" style={{ backgroundColor: metric.color }} />
            </div>
          ))}
        </div>

        {/* Regional Quick View */}
        <div className={`regional-preview ${animate ? 'animate' : ''}`}>
          <h3>Regional Distribution</h3>
          <div className="region-bars">
            {regionalData.map((region, idx) => (
              <div key={region.region} className="region-item" style={{ animationDelay: `${idx * 150}ms` }}>
                <div className="region-info">
                  <span className="region-name">{region.region}</span>
                  <span className="region-value">£{(region.totalBenefit / 1000).toFixed(1)}B</span>
                </div>
                <div className="region-bar-bg">
                  <div 
                    className="region-bar-fill"
                    style={{ 
                      width: animate ? `${(region.totalBenefit / 118420) * 100}%` : '0%',
                      backgroundColor: region.color,
                      transitionDelay: `${idx * 150 + 800}ms`
                    }}
                  />
                </div>
                <div className="region-percapita">
                  £{formatNumber(region.perCapita)} per capita
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Hint */}
        <div className={`scroll-hint ${animate ? 'animate' : ''}`}>
          <span>Explore Timeline Analysis</span>
          <svg className="scroll-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default OverviewDashboard;
