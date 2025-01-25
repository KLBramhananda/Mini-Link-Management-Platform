import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api', // Backend port
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/users/register', {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      
      console.log('Registration Response:', response.data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration Error:', {
        response: error.response,
        message: error.message
      });
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="login">
      <div className="left-side">
        <img className="logo" src="/assets/logo.png" alt="app-logo" />
        <img className="bg-image" src="/assets/bg-image.png" alt="bg-image" />
      </div>
      <div className="right-side">
        <div className="buttons">
          <button
            id="signup"
            className="active"
            onClick={() => navigate("/signup")}
          >
            SignUp
          </button>
          <button id="login" onClick={() => navigate("/")}>
            Login
          </button>
        </div>
        <h1 id="signup-head">Join us Today!</h1>
        <div className="login__container">
          <form onSubmit={handleSubmit}>
            <input
              id="username"
              type="text"
              placeholder="Name"
              required
              onChange={handleChange}
            />
            <br />
            <input
              id="email"
              type="email"
              placeholder="Email id"
              required
              onChange={handleChange}
            />
            <br />
            <input
              id="phone"
              type="tel"
              placeholder="Mobile no."
              required
              onChange={handleChange}
            />
            <br />
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
            />
            <br />
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
            />
            <br />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="login__signInButton" type="submit">
              Register
            </button>
          </form>
          <h5 className="login__registerButton">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>Login</span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Signup;
