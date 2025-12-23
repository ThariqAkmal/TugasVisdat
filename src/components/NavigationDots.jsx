import React from 'react';
import './NavigationDots.css';

const NavigationDots = ({ currentSection, totalSections, onNavigate }) => {
  const sections = [
    { id: 0, label: 'Start', icon: '🌍' },
    { id: 1, label: 'Introduction', icon: '📖' },
    { id: 2, label: 'Overview', icon: '📊' },
    { id: 3, label: 'Timeline', icon: '📈' },
    { id: 4, label: 'Categories', icon: '🎯' },
    { id: 5, label: 'Health Impact', icon: '💚' }
  ];

  return (
    <div className="navigation-dots">
      {sections.map((section) => (
        <div
          key={section.id}
          className={`nav-dot ${currentSection === section.id ? 'active' : ''} ${currentSection > section.id ? 'completed' : ''}`}
          onClick={() => onNavigate(section.id)}
          title={section.label}
        >
          <div className="dot-icon">{section.icon}</div>
          <span className="dot-label">{section.label}</span>
          {currentSection > section.id && (
            <div className="dot-check">✓</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NavigationDots;
