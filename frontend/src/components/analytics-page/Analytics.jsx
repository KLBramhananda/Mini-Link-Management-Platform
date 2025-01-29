// Links.jsx
import React, { useState, useEffect } from "react";
import "./Analytics.css";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;

  useEffect(() => {
    const username = localStorage.getItem('username') || '';
    const storedLinks = JSON.parse(localStorage.getItem(`${username}_links`)) || [];

    const analyticsArray = storedLinks.map(link => ({
      timestamp: new Date(link.date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(/ AM| PM/, ''),
      originalLink: link.originalLink,
      shortLink: link.shortLink,
      ipAddress: link.ipAddress || '192.158.1.66', // Assuming IP address is stored in 'ipAddress'
      userDevice: link.device || 'Desktop' // Assuming device info is stored in 'device'
    }));

    setAnalyticsData(analyticsArray);
  }, []);

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = analyticsData.slice(indexOfFirstLink, indexOfLastLink);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(analyticsData.length / linksPerPage)));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  return (
    <div className="analytics-container">
      <table className="analytics-table">
        <thead>
          <tr>
            <th style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              Timestamp <img src="/assets/links-page-icons/dropdown.png" alt="option" />
            </th>
            <th style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Original Link</th>
            <th style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Short Link</th>
            <th style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>IP Address</th>
            <th style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>User Device</th>
          </tr>
        </thead>
        <tbody>
          {currentLinks.map((data, index) => (
            <tr key={index}>
              <td style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.timestamp}</td>
              <td style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.originalLink}</td>
              <td style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.shortLink}</td>
              <td style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.ipAddress}</td>
              <td style={{ width: "14.28%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.userDevice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} className="page-arrow">&lt;</button>
        {Array.from({ length: Math.ceil(analyticsData.length / linksPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
          >
            {i + 1}
          </button>
        ))}
        <button onClick={nextPage} className="page-arrow">&gt;</button>
      </div>
    </div>
  );
};

export default Analytics;
