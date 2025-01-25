import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '20px' }}>
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '30%' }}>
          <h2>Section 1</h2>
          <p>Content for section 1</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '30%' }}>
          <h2>Section 2</h2>
          <p>Content for section 2</p>
        </div>
        <div style={{ border: '1px solid #ccc', padding: '10px', width: '30%' }}>
          <h2>Section 3</h2>
          <p>Content for section 3</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;