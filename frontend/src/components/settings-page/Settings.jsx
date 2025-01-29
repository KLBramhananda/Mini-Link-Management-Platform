import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage or API
    const username = localStorage.getItem('username') || '';
    const userEmail = localStorage.getItem('email') || '';
    const userPhone = localStorage.getItem('phone') || '';

    setName(username);
    setEmail(userEmail);
    setMobile(userPhone);
  }, []);

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('https://mini-link-management-platform-backend-fnqm.onrender.com/api/users/update', {
        username: name,
        email,
        phone: mobile
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.setItem('username', name);
      localStorage.setItem('email', email);
      localStorage.setItem('phone', mobile);

      alert('Your credentials are updated');
      console.log('Changes saved:', response.data);
    } catch (error) {
      console.error('Update Error:', error);
      alert('Failed to update credentials');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('https://mini-link-management-platform-backend-fnqm.onrender.com/api/users/delete', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('email');
      localStorage.removeItem('phone');

      alert('Your account has been deleted');
      navigate('/');
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete account');
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    handleDeleteAccount();
    setShowDeleteModal(false);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="settings-page">
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email id</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="mobile">Mobile no.</label>
        <input
          type="tel"
          id="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
      </div>
      <div className="button-group">
        <button id='save' onClick={handleSaveChanges}>Save Changes</button> <br />
        <button id='delete' onClick={handleDelete}>Delete Account</button>
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <button className="close-btn" onClick={handleCloseDeleteModal}>X</button>
            <h3>Are you sure, you want to delete your account?</h3>
            <div className="delete-modal-buttons">
              <button onClick={handleCloseDeleteModal}>No</button>
              <button onClick={confirmDelete}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;