// Links.jsx
import React, { useState, useEffect } from "react";
import "./Analytics.css";
import axios from "axios";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const linksPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      if (!userId) {
        setAnalyticsData([]);
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/links`,
        {
          headers: {
            "user-id": userId,
          },
        }
      );

      console.log("Raw analytics data:", response.data);

      const formattedData = response.data.map((link) => ({
        timestamp: new Date(link.createdAt)
          .toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
          .replace(/ AM| PM/, ""),
        originalLink: link.originalLink,
        shortLink: link.shortLink,
        ipAddress: link.analytics?.ipAddress || "::1",
        userDevice: link.analytics?.device || "Desktop",
      }));

      console.log("Formatted analytics data:", formattedData);
      setAnalyticsData(formattedData);
    } catch (error) {
      console.error("Error fetching analytics data:", error);
      setAnalyticsData([]);
    }
  };

  const indexOfLastLink = currentPage * linksPerPage;
  const indexOfFirstLink = indexOfLastLink - linksPerPage;
  const currentLinks = analyticsData.slice(indexOfFirstLink, indexOfLastLink);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(analyticsData.length / linksPerPage))
    );
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...currentLinks].sort((a, b) => {
    if (sortConfig.key === "timestamp") {
      const dateA = new Date(a.timestamp);
      const dateB = new Date(b.timestamp);
      return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
    }
    return 0;
  });

  return (
    <div className="analytics-container">
      <table className="analytics-table">
        <thead>
          <tr>
            <th
              onClick={() => handleSort("timestamp")}
              style={{ cursor: "pointer" }}
            >
              Timestamp{" "}
              <img
                src="/assets/links-page-icons/dropdown.png"
                alt="option"
                style={{
                  transform:
                    sortConfig.key === "timestamp" &&
                    sortConfig.direction === "desc"
                      ? "rotate(180deg)"
                      : "none",
                  transition: "transform 0.3s",
                }}
              />
            </th>
            <th className="original-link">Original Link</th>
            <th>Short Link</th>
            <th>IP Address</th>
            <th>User Device</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((data, index) => (
            <tr key={index}>
              <td>{data.timestamp}</td>
              <td className="original-link">{data.originalLink}</td>
              <td>{data.shortLink}</td>
              <td>{data.ipAddress}</td>
              <td>{data.userDevice}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={prevPage} className="page-arrow">
          &lt;
        </button>
        {Array.from(
          { length: Math.ceil(analyticsData.length / linksPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
            >
              {i + 1}
            </button>
          )
        )}
        <button onClick={nextPage} className="page-arrow">
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Analytics;
