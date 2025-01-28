import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [totalLinks, setTotalLinks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);
  const [deviceWiseClicks, setDeviceWiseClicks] = useState({
    mobile: 0,
    desktop: 0,
    tablet: 0
  });

  useEffect(() => {
    const username = localStorage.getItem('username') || '';
    const storedLinks = JSON.parse(localStorage.getItem(`${username}_links`)) || [];
    setTotalLinks(storedLinks.length);

    const clicksByDate = storedLinks.reduce((acc, link) => {
      const date = new Date(link.date).toLocaleDateString('en-US');
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += 1;
      return acc;
    }, {});

    const cumulativeClicksArray = [];
    let cumulativeCount = 0;
    Object.keys(clicksByDate).sort().forEach(date => {
      cumulativeCount += clicksByDate[date];
      cumulativeClicksArray.push({ date, count: cumulativeCount });
    });

    setDateWiseClicks(cumulativeClicksArray.reverse());

    const clicksByDevice = storedLinks.reduce((acc, link) => {
      const device = link.device || 'desktop'; // Default to 'desktop' if device info is not available
      if (!acc[device]) {
        acc[device] = 0;
      }
      acc[device] += 1;
      return acc;
    }, { mobile: 0, desktop: 0, tablet: 0 });

    setDeviceWiseClicks(clicksByDevice);
  }, []);

  const maxCount = 100;

  return (
    <>
      <div className="total-links">
        <h2>Total Clicks <span>{totalLinks}</span></h2>
      </div>
      <div className="charts">
        <div className="chart date-wise">
          <h3>Date-wise Clicks</h3>
          <ul className="chart-bars">
            {dateWiseClicks.map(item => (
              <li key={item.date}>
                <span className="date">{item.date}</span>
                <div className="bar">
                  <span style={{ display: 'inline-block', width: `${(item.count / maxCount) * 100}%`, backgroundColor: 'blue', height: '10px' }}></span>
                </div>
                <span className="count">{item.count}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="chart devices">
          <h3>Click Devices</h3>
          <ul className="chart-bars">
            {Object.keys(deviceWiseClicks).map(device => (
              <li key={device}>
                <span className="device">{device.charAt(0).toUpperCase() + device.slice(1)}</span>
                <div className="bar">
                  <span style={{ display: 'inline-block', width: `${(deviceWiseClicks[device] / maxCount) * 100}%`, backgroundColor: 'blue', height: '10px' }}></span>
                </div>
                <span className="count">{deviceWiseClicks[device]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;