import React, { useState, useEffect, forwardRef, useImperativeHandle } from "react";
import "./Links.css";
import CreateLink from "../Create-link";

const Links = forwardRef((props, ref) => {
  const [links, setLinks] = useState([]);
  const [showCreateLink, setShowCreateLink] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleCreateLink = (linkData) => {
    const newLink = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      originalLink: linkData.destinationUrl,
      shortLink: generateShortLink(),
      remarks: linkData.remarks,
      clicks: 0,
      status: linkData.linkExpiration && linkData.expirationDate 
        ? isLinkActive(linkData.expirationDate) ? "Active" : "Inactive"
        : "Active",
      expirationDate: linkData.expirationDate
    };
    setLinks(prevLinks => [newLink, ...prevLinks]);
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
    setLinks(links.filter(link => link.id !== deleteId));
    setShowDeleteModal(false);
  };

  const handleUpdate = (updatedData) => {
    setLinks(links.map(link => 
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
    ));
    setShowCreateLink(false);
    setEditingLink(null);
  };

  const handleCopyLink = async (shortLink) => {
    try {
      await navigator.clipboard.writeText(shortLink);
      // Optionally add a visual feedback that the link was copied
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
            <th>Clicks</th>
            <th>Status <img src="/assets/links-page-icons/dropdown.png" alt="option" /></th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map(link => (
            <tr key={link.id}>
              <td>{link.date}</td>
              <td>{link.originalLink}</td>
              <td>
                {link.shortLink}
                <button 
                  className="copy-button"
                  onClick={() => handleCopyLink(link.shortLink)}
                >
                  <img src="/assets/copy-icon.png" alt="copy" />
                </button>
              </td>
              <td>{link.remarks}</td>
              <td>{link.clicks}</td>
              <td className={link.status === "Active" ? "status-active" : "status-inactive"}>
                {link.status}
              </td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(link)}>
                  <img src="/assets/edit-icon.png" alt="edit" />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(link.id)}>
                  <img src="/assets/delete-icon.png" alt="delete" />
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
    </div>
  );
});

export default Links;