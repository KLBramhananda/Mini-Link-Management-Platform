// CreateLink.jsx
import React, { useState, useEffect } from "react";
import "./CreateLink.css";

const CreateLink = ({ onClose }) => {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [linkExpiration, setLinkExpiration] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    setExpirationDate(getCurrentDateTime());
  }, []);

  const handleCreate = () => {
    console.log({ destinationUrl, remarks, linkExpiration, expirationDate });
    onClose();
  };

  const handleClear = () => {
    setDestinationUrl("");
    setRemarks("");
    setLinkExpiration(true);
    setExpirationDate(getCurrentDateTime());
  };

  const getCurrentDateTime = () => {
    const today = new Date();
    return today.toISOString().slice(0, 16);
  };

  const handleExpirationChange = (checked) => {
    setLinkExpiration(checked);
    if (!checked) {
      setExpirationDate("");
    } else {
      setExpirationDate(getCurrentDateTime());
    }
  };

  return (
    <div className="create-link-container">
      <div className="create-link-header">
        <h2>New Link</h2>
        <img className="close-btn" onClick={onClose} src="/assets/cancel.png" alt="Close" />
      </div>
      <div className="create-link-body">
        <label className="label-text">
          Destination Url <span className="required">*</span><br />
          <input
            type="url"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://enter-your-destination-url.com/"
            required
          />
        </label><br />
        <label className="label-text">
          Remarks <span className="required">*</span><br />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks"
            required
          ></textarea>
        </label>
        <div className="expiration-toggle">
          <label>
            Link Expiration
            <input className="expiration-checkbox"
              type="checkbox"
              checked={linkExpiration}
              onChange={(e) => handleExpirationChange(e.target.checked)}
            />
          </label> <br />
          <input
            className="date-time"
            type="datetime-local"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            disabled={!linkExpiration}
            min={getCurrentDateTime()}
          />
        </div>
      </div>
      <div className="create-link-footer">
        <button className="clear-btn" onClick={handleClear}>Clear</button>
        <button className="create-btn" onClick={handleCreate}>Create new</button>
      </div>
    </div>
  );
};

export default CreateLink;
