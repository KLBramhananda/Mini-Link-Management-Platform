import React from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
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
            onClick={() => navigate("/signup")}
          >
            SignUp
          </button>
          <button
            id="login"
            className="active"
            onClick={() => navigate("/")}
          >
            Login
          </button>
        </div>
        <h1>Login</h1>
        <div className="login__container">
          <form>
            <input
              id="email"
              type="email"
              placeholder="Email id"
              required
            />
            <br />
            <input
              id="password"
              type="password"
              placeholder="Password"
              required
            />
            <br />
            <button className="login__signInButton">Login</button>
          </form>
          <h5 className="login__registerButton">
            Don't have an account?{" "}
            <span onClick={() => navigate("/signup")}>
              SignUp
            </span>
          </h5>
        </div>
      </div>
    </div>
  );
};

export default Login;
