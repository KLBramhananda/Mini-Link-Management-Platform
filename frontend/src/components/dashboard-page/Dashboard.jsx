import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [totalLinks, setTotalLinks] = useState(0);
  const [dateWiseClicks, setDateWiseClicks] = useState([]);

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

    const clicksArray = Object.keys(clicksByDate).map(date => ({
      date,
      count: clicksByDate[date]
    }));

    setDateWiseClicks(clicksArray);
  }, []);

  const maxCount = 100;

  return (
    <>
      <div className="total-links">
        <h2>Total Links <span>{totalLinks}</span></h2>
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
            {/* Add device-wise clicks logic here if needed */}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;