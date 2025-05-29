import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EnterOTP.css"; // ใช้ไฟล์ CSS แยกสำหรับ EnterOTP

function EnterOTP() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleSubmit = (otpValue) => {
    const validOtp = "123456";
    const { hnNumber, role } = location.state || {};

    if (otpValue === validOtp) {
      const dashboardPath =
        role === "parent"
          ? "/parent-dashboard"
          : role === "doctor"
          ? "/doctor-dashboard"
          : role === "admin"
          ? "/admin-dashboard"
          : null;

      if (dashboardPath) {
        navigate(dashboardPath, {
          state: { hnNumber, role }, // ✅ ส่งข้อมูล hnNumber และ role ไปด้วย
        });
      } else {
        alert("Unknown role. Please try again.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
      resetOtp();
    }
  };

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputs.current[0].focus();
  };

  return (
    <div className="otp-container">
      <h1>Enter OTP</h1>
      <p>Enter the OTP sent to your registered number:</p>
      <div className="otp-input">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e.target.value, index)}
            ref={(el) => (inputs.current[index] = el)}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && index > 0 && !digit) {
                inputs.current[index - 1].focus();
              }
            }}
          />
        ))}
      </div>
      <button
        className="primary-button"
        onClick={() => handleSubmit(otp.join(""))}
      >
        Submit
      </button>
      <p className="resend-link" onClick={resetOtp}>
        Resend OTP
      </p>
    </div>
  );
}

export default EnterOTP;
