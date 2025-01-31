import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `https://mini-link-management-platform-server.vercel.app/`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data && response.data.user && response.data.user.id) {
        // Clear any existing data first
        localStorage.clear();

        // Then set new user data
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("email", response.data.user.email);
        localStorage.setItem("phone", response.data.user.phone);
        localStorage.setItem("userId", response.data.user.id);

        // Force reload the application state
        window.dispatchEvent(new Event("storage"));

        navigate("/dashboard");
      } else {
        console.error("Invalid response format:", response.data);
        setError("Login failed - invalid response format");
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      setError(error.response?.data?.error || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="login">
      <div className="left-side">
        <img className="logo" src="/assets/logo.png" alt="app-logo" />
        <img className="bg-image" src="/assets/bg-image.png" alt="bg-image" />
      </div>
      <div className="right-side">
        <div className="buttons">
          <button id="signup" onClick={() => navigate("/signup")}>
            SignUp
          </button>
          <button id="login" className="active" onClick={() => navigate("/")}>
            Login
          </button>
        </div>
        <h1>Login</h1>
        <div className="login__container">
          <form onSubmit={handleSubmit}>
            <input
              id="email"
              type="email"
              placeholder="Email id"
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button className="login__signInButton" type="submit">
              Register
            </button>
          </form>
          <h5 className="login__registerButton">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>SignUp</span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Login;
