import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import "./Links.css";
import CreateLink from "../Create-link";

const Links = forwardRef((props, ref) => {
  const [links, setLinks] = useState([]);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const username = localStorage.getItem('username') || '';

  useImperativeHandle(ref, () => ({
    addNewLink: handleCreateLink
  }));

  const generateShortLink = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 6;
    let shortLink = "https://short.ly/";
    for (let i = 0; i < length; i++) {
      shortLink += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return shortLink;
  };

  const isLinkActive = (expirationDate) => {
    if (!expirationDate) return true;
    return new Date(expirationDate) > new Date();
  };

  const formatDateTime = (date) => {
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleString('en-US', options);
  };

  useEffect(() => {
    const storedLinks = JSON.parse(localStorage.getItem(`${username}_links`)) || [];
    setLinks(storedLinks);
  }, [username]);

  const handleCreateLink = async (linkData) => {
    const newLink = {
      id: Date.now(),
      date: formatDateTime(new Date()),
      originalLink: linkData.destinationUrl,
      shortLink: generateShortLink(),
      remarks: linkData.remarks,
      clicks: 0,
      status: linkData.linkExpiration && linkData.expirationDate 
        ? isLinkActive(linkData.expirationDate) ? "Active" : "Inactive"
        : "Active",
      expirationDate: linkData.expirationDate
    };

    try {
      await axios.post('http://localhost:5000/api/links/create', newLink);
      const updatedLinks = [newLink, ...links];
      setLinks(updatedLinks);
      localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
    } catch (error) {
      console.error('Link Creation Error:', error);
    }
  };

  const handleEdit = (link) => {
    setEditingLink({
      ...link,
      destinationUrl: link.originalLink, // Map for CreateLink component
    });
    setShowCreateLink(true);
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const updatedLinks = links.filter(link => link.id !== deleteId);
    setLinks(updatedLinks);
    localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
    setShowDeleteModal(false);
  };

  const handleUpdate = (updatedData) => {
    const updatedLinks = links.map(link => 
      link.id === editingLink.id 
        ? {
            ...link,
            originalLink: updatedData.destinationUrl,
            remarks: updatedData.remarks,
            expirationDate: updatedData.expirationDate,
            status: updatedData.linkExpiration && updatedData.expirationDate
              ? isLinkActive(updatedData.expirationDate) ? "Active" : "Inactive"
              : "Active"
          }
        : link
    );
    setLinks(updatedLinks);
    localStorage.setItem(`${username}_links`, JSON.stringify(updatedLinks));
    setShowCreateLink(false);
    setEditingLink(null);
  };

  const handleCopyLink = async (shortLink) => {
    try {
      await navigator.clipboard.writeText(shortLink);
      setShowCopyModal(true);
      setTimeout(() => setShowCopyModal(false), 2000); // Hide modal after 2 seconds
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  // Update status based on expiration date
  useEffect(() => {
    const interval = setInterval(() => {
      setLinks(prevLinks => 
        prevLinks.map(link => ({
          ...link,
          status: link.expirationDate ? isLinkActive(link.expirationDate) ? "Active" : "Inactive" : "Active"
        }))
      );
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="links-container">
      <table className="links-table">
        <thead>
          <tr>
            <th>Date <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Original Link</th>
            <th>Short Link</th>
            <th>Remarks</th>
            <th className="clicks">Clicks</th>
            <th>Status <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id}>
              <td>{link.date}</td>
              <td className="original-link">{link.originalLink}</td>
              <td className="short-link">
                <span className="text-content">{link.shortLink}</span>
                <button 
                  className="copy-button"
                  onClick={() => handleCopyLink(link.shortLink)}
                >
                  <img src="/assets/links-page-icons/copy-icon.png" alt="copy" />
                </button>
              </td>
              <td className="remarks">{link.remarks}</td>
              <td className="clicks">{link.clicks}</td>
              <td className={link.status === "Active" ? "status-active" : "status-inactive"}>
                {link.status}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(link)}>
                  <img src="/assets/links-page-icons/edit.png" alt="edit" />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(link.id)}>
                  <img src="/assets/links-page-icons/delete.png" alt="delete" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showCreateLink && (
        <div className="modal-overlay">
          <div className="modal-content">
            <CreateLink 
              onClose={() => {
                setShowCreateLink(false);
                setEditingLink(null);
              }}
              onSubmit={editingLink ? handleUpdate : handleCreateLink}
              initialData={editingLink}
              isEditMode={!!editingLink}
            />
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Are you sure you want to remove it?</h3>
            <div className="delete-modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>No</button>
              <button onClick={confirmDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {showCopyModal && (
        <div className="copy-modal">
          <img src="/assets/copy-icon-blue.png" alt="Copy Icon" />
          <span>Link Copied</span>
        </div>
      )}
    </div>
  );
});

export default Links;