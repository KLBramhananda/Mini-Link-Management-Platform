import React from 'react';

const Dashboard = () => {
  const dateWiseClicks = [
    { date: "21-01-25", count: 34 },
    { date: "20-01-25", count: 40 },
    { date: "19-01-25", count: 13 },
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  const clickDevices = [
    { device: "Mobile", count: 34 },
    { device: "Desktop", count: 40 },
    { device: "Tablet", count: 3 },
  ];

  const maxCount = 100;

  return (
    <>
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
    </>
  );
};

export default Dashboard;