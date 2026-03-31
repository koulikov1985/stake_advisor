import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          <span className="logo-icon">🔑</span>
          <span className="logo-text">LicenseKey</span>
        </Link>
        <nav>
          <Link to="/" className="nav-link">Home</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
