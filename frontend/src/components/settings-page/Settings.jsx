import React, { useState } from 'react';
import './Settings.css';

const Settings = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');

  const handleSaveChanges = () => {
    // Logic to save changes
    console.log('Changes saved:', { name, email, mobile });
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