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
    console.log('App mounted, resetting scroll to 0');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  const handleZoomComplete = () => {
    console.log('Zoom complete, showing intro section');
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
      console.log(`Section ${currentSection}: Scroll ${scrollCount}/3 ${direction > 0 ? '↓' : '↑'}`);

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
            console.log('Transitioning to overview');
            setCurrentSection(2);
            setTimeout(() => setShowSections(prev => ({ ...prev, overview: true })), 600);
          } else if (currentSection === 2) {
            console.log('Transitioning to timeline');
            setCurrentSection(3);
            setTimeout(() => setShowSections(prev => ({ ...prev, timeline: true })), 600);
          } else if (currentSection === 3) {
            console.log('Transitioning to categories');
            setCurrentSection(4);
            setTimeout(() => setShowSections(prev => ({ ...prev, categories: true })), 600);
          } else if (currentSection === 4) {
            console.log('Transitioning to health impact');
            setCurrentSection(5);
            setTimeout(() => setShowSections(prev => ({ ...prev, health: true })), 600);
          }
        }
        // Backward navigation
        else {
          if (currentSection === 5) {
            console.log('Going back to categories');
            setCurrentSection(4);
          } else if (currentSection === 4) {
            console.log('Going back to timeline');
            setCurrentSection(3);
          } else if (currentSection === 3) {
            console.log('Going back to overview');
            setCurrentSection(2);
          } else if (currentSection === 2) {
            console.log('Going back to intro');
            setCurrentSection(1);
          } else if (currentSection === 1) {
            console.log('Going back to globe');
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
    console.log(`Navigating to section ${section}`);
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

      {/* Intro Section - Edinburgh Explanation with background image */}
      {showIntro && (
        <section 
          className={`intro-section ${currentSection === 1 ? 'active' : ''} ${currentSection >= 2 ? 'fade-out' : ''}`}
          style={{ backgroundImage: `url(${edinburghImg})` }}
        >
          <div className="intro-overlay"></div>
          <div className="intro-content">
            <h1 className="intro-title">Edinburgh, Scotland</h1>
            <p className="intro-description">
              The capital city of Scotland, Edinburgh is a UNESCO World Heritage Site renowned for its 
              stunning medieval Old Town and elegant Georgian New Town. Perched on volcanic hills overlooking 
              the Firth of Forth, this historic city seamlessly blends ancient architecture with modern innovation.
            </p>
            <p className="intro-description">
              Home to world-class universities, thriving arts scene, and as the host of the world's largest 
              arts festival, Edinburgh stands as a beacon of culture, education, and sustainable urban development. 
              Today, the city leads in climate action and public health initiatives, setting an example for 
              cities worldwide.
            </p>
            <div className="scroll-hint">Scroll to explore data</div>
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
