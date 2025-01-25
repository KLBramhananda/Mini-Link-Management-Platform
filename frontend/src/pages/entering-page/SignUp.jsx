import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Signup = () => {
  const navigate = useNavigate();

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
          <form>
            <input id="name" type="text" placeholder="Name" required />
            <br />
            <input
              id="email"
              type="email"
              placeholder="Email id"
              required
            />
            <br />
            <input
              id="phone"
              type="tel"
              placeholder="Mobile no."
              required
            />{" "}
            <br />
            <input type="password" placeholder="Password" required />
            <br />
            <input
              id="confirm-password"
              type="password"
              placeholder="Confirm Password"
              required
            />
            <br />
            <button className="login__signInButton">Register</button>
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
