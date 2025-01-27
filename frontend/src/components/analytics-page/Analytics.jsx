// Links.jsx
import React from "react";
import "./Analytics.css";

const Analytics = () => {
  return (
    <div className="links-container">
      <table className="links-table">
        <thead>
          <tr>
            <th>Timestamp <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>ip address</th>
            <th>User Device</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
};

export default Analytics;
