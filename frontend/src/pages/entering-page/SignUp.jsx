import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./login.css";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const maskPassword = (password) => {
    return password.replace(/./g, "*");
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);

    if (event.target.value !== password) {
      setError("Enter the same password in both fields");
    } else {
      setError("");
    }
  };

  const handleSignUp = async () => {
    if (!user || user.trim() === "") {
      setError("Username is required");
      return;
    }

    if (!email || email.trim() === "") {
      setError("Email is required");
      return;
    }

    if (!email.includes("@") || !email.includes(".com")) {
      setError("Invalid email format");
      return;
    }

    if (!phone || phone.trim() === "") {
      setError("Phone number is required");
      return;
    }

    if (!password || password.trim() === "") {
      setError("Password is required");
      return;
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      setError("Please confirm your password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/users/register`,
        {
          username: user,
          email,
          phone,
          password,
        }
      );

      if (response.status === 201) {
        localStorage.setItem(
          "userData",
          JSON.stringify({
            username: user,
            email: email,
          })
        );

        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred during signup. Please try again."
      );
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
          <button
            id="login"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
        <h1 id="signup-head">Join us Today!</h1>
        <div className="login__container">
          <form onSubmit={(e) => e.preventDefault()}>
            <input id="username" type="text" placeholder="Name" required onChange={handleUserChange} />
            <br />
            <input id="email" type="email" placeholder="Email id" required onChange={handleEmailChange} />
            <br />
            <input id="phone" type="tel" placeholder="Mobile no." required value={phone} onChange={handlePhoneChange} />
            <br />
            <input id="password" type="password" placeholder="Password" required onChange={handlePasswordChange} />
            <br />
            <input id="confirm-password" type="password" placeholder="Confirm Password" required onChange={handleConfirmPasswordChange} />
            <br />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="login__signInButton" type="button" onClick={handleSignUp}>Register</button>
          </form>
          <h5 className="login__registerButton">
            Already have an account?{" "}
            <span onClick={() => navigate("/")}>
              Login
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Signup;
