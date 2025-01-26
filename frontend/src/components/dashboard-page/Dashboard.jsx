// Dashboard.jsx
import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [greeting, setGreeting] = useState("Good Morning");
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();

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

  const dateWiseClicks = [
    { date: "21-01-25", count: 34 },
    { date: "20-01-25", count: 40 },
    { date: "19-01-25", count: 13 },
  ].sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date descending

  const clickDevices = [
    { device: "Mobile", count: 34 },
    { device: "Desktop", count: 40 },
    { device: "Tablet", count: 3 },
  ];

  const maxCount = 100;

  return (
    <div className="dashboard-container">
      <img className="logo" src="/assets/logo.png" alt="app-logo" />
      <header className="dashboard-header">
        <p className="dashboard-title">
          <img src="/assets/climate.png" alt="" /> {greeting}, Bramha <br />
          <span className="dashboard-date">Tue, Jan 25</span>
        </p>

        <button className="create-new">
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
            <li className="menu-item active">
              <img src="/assets/dashboard-icon.png" alt="" /> Dashboard
            </li>
            <li className="menu-item">
              <img src="/assets/links-page-icons/link-icon.png" alt="" /> Links
            </li>
            <li className="menu-item">
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
          <div className="total-clicks">
            <h2>Total Clicks <span>1234</span></h2>
          </div>
          <div className="charts">
            <div className="chart date-wise">
              <h3>Date-wise Clicks</h3>
              <ul className="chart-bars">
                {dateWiseClicks.map(item => (
                  <li key={item.date}>
                    <span className="date">{item.date}</span>
                    <span className="bar" style={{ width: `${(item.count / maxCount) * 100}%` }}></span>
                    <span className="count">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="chart devices">
              <h3>Click Devices</h3>
              <ul className="chart-bars">
                {clickDevices.map(item => (
                  <li key={item.device}>
                    <span className="device">{item.device}</span>
                    <span className="bar" style={{ width: `${(item.count / maxCount) * 100}%` }}></span>
                    <span className="count">{item.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
