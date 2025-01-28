import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

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
      const response = await axios.put('http://localhost:5000/api/users/update', {
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

  const handleDeleteAccount = () => {
    // Logic to delete account
    console.log('Account deleted');
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
        <button id='delete' onClick={handleDeleteAccount}>Delete Account</button>
      </div>
    </div>
  );
};

export default Settings;