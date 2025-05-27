import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai"; // For toggle icon
import "./LoginPage.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [hnNumber, setHnNumber] = useState(""); // Separate state for HN Number
  const [useHn, setUseHn] = useState(false); // Default to email login
  const navigate = useNavigate();

  // Predefined user data
  const users = [
    { hnNumber: "12345", email: "parent@example.com", role: "parent" },
    { hnNumber: "67890", email: "doctor@example.com", role: "doctor" },
    { hnNumber: "11111", email: "admin@example.com", role: "admin" },
  ];

  const handleLogin = () => {
    if (useHn) {
      // Validate HN Number
      const user = users.find((user) => user.hnNumber === hnNumber);
      if (user) {
        alert("OTP sent: 123456 (for demo purposes)");
        navigate("/enter-otp", { state: { hnNumber } }); // Navigate to OTP page
      } else {
        alert("Invalid HN Number. Please try again.");
      }
    } else if (email && password) {
      // Validate Email and Password
      const user = users.find((user) => user.email === email);
      if (user && password === "password") {
        alert(`Logged in as ${user.role}`);
        // Redirect to the dashboard based on the user's role
        if (user.role === "parent") {
          navigate("/parent-dashboard", { state: { role: user.role } });
        } else if (user.role === "doctor") {
          navigate("/doctor-dashboard", { state: { role: user.role } });
        } else if (user.role === "admin") {
          navigate("/admin-dashboard", { state: { role: user.role } });
        }
      } else {
        alert("Invalid Email or Password. Please try again.");
      }
    } else {
      alert("Please fill in valid Email and Password or HN Number.");
    }
  };

  const toggleLoginMethod = () => {
    setUseHn(!useHn);
    // Clear inputs when switching login methods
    setEmail("");
    setPassword("");
    setHnNumber("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <h1>Login to your Account</h1>
      <p>Welcome back! Select a method to log in:</p>
      <div className="button-group">
        {useHn ? (
          <button className="switch-button" onClick={toggleLoginMethod}>
            Continue with Email
          </button>
        ) : (
          <button className="switch-button" onClick={toggleLoginMethod}>
            HN Number
          </button>
        )}
      </div>
      <div className="divider">
        <hr />
        <span>{useHn ? "Continue with HN Number" : "Or continue with Email"}</span>
        <hr />
      </div>
      {useHn ? (
        <div className="input-field">
          <FaEnvelope />
          <input
            type="text"
            placeholder="HN Number"
            value={hnNumber}
            onChange={(e) => setHnNumber(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleLogin(); // Trigger login when Enter is pressed
              }
            }}
          />
        </div>
      ) : (
        <>
          <div className="input-field">
            <FaEnvelope />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-field">
            <FaLock />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="toggle-icon" onClick={togglePasswordVisibility}>
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </div>
          </div>
        </>
      )}
      <button className="primary-button" onClick={handleLogin}>
        {useHn ? "Continue to OTP" : "Log In"}
      </button>
      {!useHn && (
        <div className="options">
        <label>
          <input type="checkbox" /> Remember
        </label>
        <button
          className="link-button"
          onClick={() => alert("Forgot password functionality to be implemented")}
        >
          Forgot Password?
        </button>
      </div>
      
      
      )}
      {!useHn && (
        <p>
          Don’t have an account?{" "}
          <button
            className="link-button"
            onClick={() => alert("Create an account functionality to be implemented")}
          >
            Create an account
          </button>
        </p>
      )}
    </div>
  );
}

export default LoginPage;
