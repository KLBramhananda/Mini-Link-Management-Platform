// CreateLink.jsx
import React, { useState, useEffect } from "react";
import "./CreateLink.css";
import axios from "axios";

const CreateLink = ({ onClose, onSubmit, initialData, isEditMode }) => {
  const [destinationUrl, setDestinationUrl] = useState("");
  const [remarks, setRemarks] = useState("");
  const [linkExpiration, setLinkExpiration] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");
  const [errors, setErrors] = useState({ destinationUrl: "", remarks: "" });

  useEffect(() => {
    if (initialData && isEditMode) {
      setDestinationUrl(initialData.destinationUrl || "");
      setRemarks(initialData.remarks || "");
      setLinkExpiration(initialData.linkExpiration);
      setExpirationDate(initialData.expirationDate || getCurrentDateTime());
    } else {
      setExpirationDate(getCurrentDateTime());
    }
  }, [initialData, isEditMode]);

  const getDeviceType = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/mobile|android|iphone|phone/i.test(userAgent)) {
      return "Mobile";
    } else if (/tablet|ipad/i.test(userAgent)) {
      return "Tablet";
    } else if (/macintosh|mac os x/i.test(userAgent)) {
      return "Mac";
    } else if (/windows|win32|win64/i.test(userAgent)) {
      return "Windows";
    } else if (/linux/i.test(userAgent)) {
      return "Linux";
    } else {
      return "Desktop";
    }
  };

  const handleCreateOrUpdate = async () => {
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
      try {
        // Get IP address from the backend
        const ipResponse = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/api/ip`
        );
        const ipAddress = ipResponse.data.ip;

        const device = getDeviceType();
        const userId = localStorage.getItem("userId");

        const linkData = {
          originalLink: destinationUrl,
          remarks,
          expirationDate: linkExpiration ? expirationDate : null,
          device: device,
          ipAddress,
        };

        // Close modal first
        onClose();

        // Let the parent component handle the API call and updates
        if (typeof onSubmit === "function") {
          onSubmit(linkData);
        }
      } catch (error) {
        console.error("Error:", error.response?.data || error);
        setErrors({
          ...newErrors,
          destinationUrl: error.response?.data?.error || "Error creating link",
        });
      }
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
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
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
        <img
          className="close-btn"
          onClick={onClose}
          src="/assets/cancel.png"
          alt="Close"
        />
      </div>
      <div className="create-link-body">
        <label className="label-text">
          Destination Url <span className="required">*</span>
          <br />
          <input
            type="url"
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://enter-your-destination-url.com/"
            required
            className={errors.destinationUrl ? "error-input" : ""}
          />
          {errors.destinationUrl && (
            <div className="error-message">{errors.destinationUrl}</div>
          )}
        </label>
        <br />
        <label className="label-text">
          Remarks <span className="required">*</span>
          <br />
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Add remarks"
            required
            className={errors.remarks ? "error-input" : ""}
          ></textarea>
          {errors.remarks && (
            <div className="error-message">{errors.remarks}</div>
          )}
        </label>
        <div className="expiration-toggle">
          <label>
            Link Expiration
            <input
              className="expiration-checkbox"
              type="checkbox"
              checked={linkExpiration}
              onChange={(e) => handleExpirationChange(e.target.checked)}
            />
          </label>{" "}
          <br />
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
        <button className="clear-btn" onClick={handleClear}>
          Clear
        </button>
        <button className="create-btn" onClick={handleCreateOrUpdate}>
          {isEditMode ? "Save" : "Create new"}
        </button>
      </div>
    </div>
  );
};

export default CreateLink;
