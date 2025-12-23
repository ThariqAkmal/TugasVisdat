import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import NavigationDots from './components/NavigationDots';
import ProgressBar from './components/ProgressBar';
import OverviewDashboard from './components/OverviewDashboard';
import TimelineAnalysis from './components/TimelineAnalysis';
import CategoriesBreakdown from './components/CategoriesBreakdown';
import HealthImpact from './components/HealthImpact';
import edinburghImg from './assets/edinburg.jpg';

function App() {
  const [currentSection, setCurrentSection] = useState(0); // 0-5: globe, intro, overview, timeline, categories, health
  const [showIntro, setShowIntro] = useState(false);
  const [showSections, setShowSections] = useState({
    overview: false,
    timeline: false,
    categories: false,
    health: false
  });

  // Calculate progress percentage
  const progress = (currentSection / 5) * 100;

  // Reset scroll position on mount to prevent auto-zoom
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  const handleZoomComplete = () => {
    setTimeout(() => {
      setShowIntro(true);
      setTimeout(() => {
        setCurrentSection(1);
      }, 100);
    }, 1200);
  };

  // Handle scroll for section transitions
  useEffect(() => {
    if (!showIntro) return;

    let scrollCount = 0;
    let scrollDirection = 0;
    let scrollTimeout;
    let isTransitioning = false;

    const handleWheel = (e) => {
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      const direction = e.deltaY > 0 ? 1 : -1;
      
      if (direction !== scrollDirection) {
        scrollCount = 0;
        scrollDirection = direction;
      }

      scrollCount++;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollCount = 0;
      }, 1000);

      if (scrollCount >= 3) {
        scrollCount = 0;
        isTransitioning = true;

        // Forward navigation
        if (direction > 0) {
          if (currentSection === 1) {
            setCurrentSection(2);
            setTimeout(() => setShowSections(prev => ({ ...prev, overview: true })), 600);
          } else if (currentSection === 2) {
            setCurrentSection(3);
            setTimeout(() => setShowSections(prev => ({ ...prev, timeline: true })), 600);
          } else if (currentSection === 3) {
            setCurrentSection(4);
            setTimeout(() => setShowSections(prev => ({ ...prev, categories: true })), 600);
          } else if (currentSection === 4) {
            setCurrentSection(5);
            setTimeout(() => setShowSections(prev => ({ ...prev, health: true })), 600);
          }
        }
        // Backward navigation
        else {
          if (currentSection === 5) {
            setCurrentSection(4);
          } else if (currentSection === 4) {
            setCurrentSection(3);
          } else if (currentSection === 3) {
            setCurrentSection(2);
          } else if (currentSection === 2) {
            setCurrentSection(1);
          } else if (currentSection === 1) {
            setShowIntro(false);
            setCurrentSection(0);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }

        setTimeout(() => {
          isTransitioning = false;
        }, 3000);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      clearTimeout(scrollTimeout);
    };
  }, [showIntro, currentSection]);

  // Navigation dots handler
  const handleNavigate = (section) => {
    setCurrentSection(section);
    
    // Ensure all previous sections are shown
    if (section >= 1) setShowIntro(true);
    if (section >= 2) setShowSections(prev => ({ ...prev, overview: true }));
    if (section >= 3) setShowSections(prev => ({ ...prev, timeline: true }));
    if (section >= 4) setShowSections(prev => ({ ...prev, categories: true }));
    if (section >= 5) setShowSections(prev => ({ ...prev, health: true }));
  };

  return (
    <div className="app">
      {/* Progress Bar */}
      <ProgressBar progress={progress} />

      {/* Navigation Dots */}
      <NavigationDots 
        currentSection={currentSection} 
        totalSections={6}
        onNavigate={handleNavigate}
      />
      {/* Globe Section - Fixed position */}
      <div className={`globe-section ${currentSection > 0 ? 'hidden' : ''}`}>
        <Header onZoomComplete={handleZoomComplete} />
      </div>
      
      {/* Scroll Spacer - Creates scrollable space for zoom trigger */}
      <div className="scroll-spacer"></div>

      {/* Intro Section - UK Net-Zero Journey with background image */}
      {showIntro && (
        <section 
          className={`intro-section ${currentSection === 1 ? 'active' : ''} ${currentSection >= 2 ? 'fade-out' : ''}`}
          style={{ backgroundImage: `url(${edinburghImg})` }}
        >
          <div className="intro-overlay"></div>
          <div className="intro-content">
            <div className="intro-badge">Data Visualization Competition 2025</div>
            <h1 className="intro-title">The Co-Benefits of Net-Zero</h1>
            <p className="intro-description">
              Discover how the UK's journey to net-zero delivers substantial economic and health benefits 
              across 46,426 small areas. From cleaner air to more active communities, climate action 
              translates into improved quality of life for 67 million residents.
            </p>
            <p className="intro-description">
              This interactive visualization explores modelled estimates of socio-economic co-benefits 
              from the Climate Change Committee's Seventh Carbon Budget recommendations, spanning 
              2025 to 2050 with a total value of <span className="highlight">£156.8 billion</span>.
            </p>
            <div className="intro-stats">
              <div className="intro-stat">
                <span className="stat-value">£156.8B</span>
                <span className="stat-label">Total Benefits</span>
              </div>
              <div className="intro-stat">
                <span className="stat-value">46,426</span>
                <span className="stat-label">Small Areas</span>
              </div>
              <div className="intro-stat">
                <span className="stat-value">11</span>
                <span className="stat-label">Benefit Types</span>
              </div>
              <div className="intro-stat">
                <span className="stat-value">25 Years</span>
                <span className="stat-label">Time Period</span>
              </div>
            </div>
            <div className="scroll-hint">
              <span>Scroll to explore the data</span>
              <svg className="scroll-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </section>
      )}

      {/* Data Section - Visualizations */}
      {showSections.overview && (
        <OverviewDashboard isActive={currentSection === 2} />
      )}

      {/* Timeline Analysis Section */}
      {showSections.timeline && (
        <TimelineAnalysis isActive={currentSection === 3} />
      )}

      {/* Categories Breakdown Section */}
      {showSections.categories && (
        <CategoriesBreakdown isActive={currentSection === 4} />
      )}

      {/* Health Impact Section */}
      {showSections.health && (
        <HealthImpact isActive={currentSection === 5} />
      )}
    </div>
  );
}

export default App;
