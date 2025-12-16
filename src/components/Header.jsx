import React from 'react';
import InteractiveGlobe from './InteractiveGlobe';
import './Header.css';

const Header = ({ onZoomComplete }) => {
  return (
    <header className="header header-with-globe">
      <InteractiveGlobe onZoomComplete={onZoomComplete} />
    </header>
  );
};

export default Header;
