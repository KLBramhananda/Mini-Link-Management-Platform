// Links.jsx
import React from "react";
import "./Links.css";

const Links = () => {

  return (
    <div className="links-container">
      <table className="links-table">
        <thead>
          <tr>
            <th>Date <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th>Clicks</th>
            <th>Status <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        </tbody>
      </table>
    </div>
  );
};

export default Links;
