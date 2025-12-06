import { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

const commonLinks = [
  {
    label: 'EPICS Main OneDrive',
    url: 'https://arizonastateu-my.sharepoint.com/shared?id=%2Fpersonal%2Fjjschoep%5Fasurite%5Fasu%5Fedu%2FDocuments%2FEPICS%20Master%20Folder&listurl=%2Fpersonal%2Fjjschoep%5Fasurite%5Fasu%5Fedu%2FDocuments'
  },
  {
    label: 'Fall 2025 All Info Sheet',
    url: 'https://arizonastateu-my.sharepoint.com/:x:/r/personal/jjschoep_asurite_asu_edu/_layouts/15/Doc.aspx?sourcedoc=%7BE72DE982-FE95-476C-9C46-982E6214C58A%7D&file=Fall%202025%20All%20Info%20Sheet.xlsx&fromShare=true&action=default&mobileredirect=true'
  }
];

export function Layout() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="layout">
      <header className="main-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">EPICS</h1>
            <span className="logo-subtitle">Engineering Projects in Community Service</span>
          </div>
          <nav className="main-nav">
            <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Feed
            </NavLink>
            <NavLink to="/overview" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Overview
            </NavLink>
            <NavLink to="/portfolio" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              Projects
            </NavLink>
            <div className="dropdown" ref={dropdownRef}>
              <button
                className={`nav-link dropdown-toggle ${dropdownOpen ? 'open' : ''}`}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Quick Links
                <span className="dropdown-arrow">&#9662;</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  {commonLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="main-footer">
        <p>Last updated: December 4, 2024</p>
      </footer>
    </div>
  );
}
