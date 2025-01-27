// CreateLink.jsx
import React, { useState, useEffect } from "react";
import "./CreateLink.css";

const CreateLink = ({ onClose, onSubmit, initialData, isEditMode }) => {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [linkExpiration, setLinkExpiration] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");
  const [errors, setErrors] = useState({ destinationUrl: "", remarks: "" });

  useEffect(() => {
    if (initialData) {
      setDestinationUrl(initialData.destinationUrl);
      setRemarks(initialData.remarks);
      setLinkExpiration(initialData.linkExpiration);
      setExpirationDate(initialData.expirationDate || getCurrentDateTime());
    } else {
      setExpirationDate(getCurrentDateTime());
    }
  }, [initialData]);

  const handleCreateOrUpdate = () => {
    let hasError = false;
    let newErrors = { destinationUrl: "", remarks: "" };

    if (!destinationUrl) {
      newErrors.destinationUrl = "This field is mandatory";
      hasError = true;
    }
    if (!remarks) {
      newErrors.remarks = "This field is mandatory";
      hasError = true;
    }

    setErrors(newErrors);

    if (!hasError) {
      const linkData = {
        destinationUrl,
        remarks,
        linkExpiration,
        expirationDate: linkExpiration ? expirationDate : null
      };
      
      if (typeof onSubmit === 'function') {
        onSubmit(linkData);
      }
      onClose();
    }
  };

  const handleClear = () => {
    setDestinationUrl("");
    setRemarks("");
    setLinkExpiration(true);
    setExpirationDate(getCurrentDateTime());
  };

  const getCurrentDateTime = () => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
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
        <h3>{isEditMode ? "Edit Link" : "New Link"}</h3>
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
            className={errors.destinationUrl ? "error-input" : ""}
          />
          {errors.destinationUrl && <div className="error-message">{errors.destinationUrl}</div>}
        </label><br />
        <label className="label-text">
          Remarks <span className="required">*</span><br />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks"
            required
            className={errors.remarks ? "error-input" : ""}
          ></textarea>
          {errors.remarks && <div className="error-message">{errors.remarks}</div>}
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
        <button className="create-btn" onClick={handleCreateOrUpdate}>
          {isEditMode ? "Save" : "Create new"}
        </button>
      </div>
    </div>
  );
};

export default CreateLink;