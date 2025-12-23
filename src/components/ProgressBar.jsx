import React from 'react';

const ProgressBar = ({ progress }) => {
  const sectionNames = ['Start', 'Intro', 'Overview', 'Timeline', 'Categories', 'Health'];
  const currentSection = Math.floor(progress / 20);
  
  // Check for mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: isMobile ? '0.5rem 1rem' : '0.75rem 2rem',
      background: 'linear-gradient(180deg, rgba(10, 22, 40, 0.98) 0%, rgba(10, 22, 40, 0) 100%)',
      display: 'flex',
      alignItems: 'center',
      gap: isMobile ? '0.5rem' : '1rem'
    }}>
      {/* Progress bar */}
      <div style={{
        flex: 1,
        height: isMobile ? '3px' : '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #4ECDC4, #2ECC71)',
          borderRadius: '2px',
          transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 10px rgba(78, 205, 196, 0.5)'
        }} />
      </div>
      
      {/* Current section label - hidden on very small mobile */}
      <div style={{
        fontSize: isMobile ? '0.65rem' : '0.75rem',
        color: 'rgba(255, 255, 255, 0.6)',
        minWidth: isMobile ? '60px' : '80px',
        textAlign: 'right',
        fontWeight: '500',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap'
      }}>
        {sectionNames[currentSection] || 'Start'}
      </div>
      
      {/* Progress percentage */}
      <div style={{
        fontSize: isMobile ? '0.7rem' : '0.8rem',
        fontWeight: '600',
        color: '#4ECDC4',
        minWidth: isMobile ? '30px' : '40px'
      }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default ProgressBar;
