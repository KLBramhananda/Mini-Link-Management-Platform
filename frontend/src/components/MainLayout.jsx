import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './dashboard-page/Dashboard.css';
import CreateLink from './Create-link';

const MainLayout = () => {
  const [greeting, setGreeting] = useState("Good Morning");
  const [showLogout, setShowLogout] = useState(false);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleMenuClick = (path) => {
    navigate(`/dashboard/${path}`);
  };

  const handleCreateNewClick = () => {
    setShowCreateLink(true);
  };

  const handleCloseCreateLink = () => {
    setShowCreateLink(false);
  };

  return (
    <div className="dashboard-container">
      <img className="logo" src="/assets/logo.png" alt="app-logo" />
      <header className="dashboard-header">
        <p className="dashboard-title">
          <img src="/assets/climate.png" alt="" /> {greeting}, Bramha <br />
          <span className="dashboard-date">Tue, Jan 25</span>
        </p>

        <button className="create-new" onClick={handleCreateNewClick}>
          <span>
            <img src="/assets/plus.png" alt="" /> Create new
          </span>
        </button>
        <div className="search">
          <img className="search-logo" src="/assets/search.png" alt="" />
          <input
            className="search-box"
            type="text"
            placeholder="Search by links"
          />
        </div>

        <div className="user-profile">
          <button className="user-initials" onClick={() => setShowLogout(!showLogout)}>
            BR
          </button>
          {showLogout && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="dashboard-main">
        <aside className="sidebar">
          <ul className="menu">
            <li 
              className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
              onClick={() => handleMenuClick('')}
            >
              <img src="/assets/dashboard-icon.png" alt="" /> Dashboard
            </li>
            <li 
              className={`menu-item ${location.pathname === '/dashboard/links' ? 'active' : ''}`}
              onClick={() => handleMenuClick('links')}
            >
              <img src="/assets/links-page-icons/link-icon.png" alt="" /> Links
            </li>
            <li 
              className={`menu-item ${location.pathname === '/dashboard/analytics' ? 'active' : ''}`}
              onClick={() => handleMenuClick('analytics')}
            >
              <img src="/assets/analystics-icon.png" alt="" /> Analytics
            </li>
          </ul>
          <div className="settings">
            <p>
              <img src="/assets/settings.icon.png" alt="" /> Settings
            </p>
          </div>
        </aside>
        <main className="content">
          <Outlet />
        </main>
      </div>

      {showCreateLink && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateLink onClose={handleCloseCreateLink} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;