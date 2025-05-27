import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EnterOTP.css"; // ใช้ไฟล์ CSS แยกสำหรับ EnterOTP

function EnterOTP() {
  const navigate = useNavigate();
  const location = useLocation(); // Get state passed from the previous page
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // เก็บค่า OTP เป็น array
  const inputs = useRef([]); // ใช้ Ref สำหรับจัดการ focus ในแต่ละช่อง

  const handleChange = (value, index) => {
    // อนุญาตเฉพาะตัวเลข
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value; // อัปเดตค่าที่ป้อนในแต่ละช่อง
    setOtp(newOtp);

    // ย้าย focus ไปยังช่องถัดไปถ้ายังไม่ถึงช่องสุดท้าย
    if (value && index < 5) {
      inputs.current[index + 1].focus();
    }

    // เมื่อกรอกครบทุกช่องแล้ว
    if (newOtp.every((digit) => digit !== "")) {
      handleSubmit(newOtp.join("")); // รวมค่าใน array และส่งไปตรวจสอบ
    }
  };

  const handleSubmit = (otpValue) => {
    const validOtp = "123456"; // กำหนด OTP ที่ถูกต้อง
    if (otpValue === validOtp) {
      // Determine the user's role from the state
      const { hnNumber } = location.state || {};
      if (hnNumber === "12345") {
        navigate("/parent-dashboard"); // Navigate to Parent Dashboard
      } else if (hnNumber === "67890") {
        navigate("/doctor-dashboard"); // Navigate to Doctor Dashboard
      } else if (hnNumber === "11111") {
        navigate("/admin-dashboard"); // Navigate to Admin Dashboard
      } else {
        alert("Unknown user. Please try again.");
      }
    } else {
      alert("Invalid OTP. Please try again.");
      resetOtp(); // ล้างข้อมูลในทุกช่อง
    }
  };

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]); // รีเซ็ตค่า OTP
    inputs.current[0].focus(); // ย้าย focus กลับไปที่ช่องแรก
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
            ref={(el) => (inputs.current[index] = el)} // เก็บ Ref ของ input แต่ละช่อง
            onKeyDown={(e) => {
              if (e.key === "Backspace" && index > 0 && !digit) {
                inputs.current[index - 1].focus(); // ย้าย focus ไปช่องก่อนหน้าเมื่อกด Backspace
              }
            }}
          />
        ))}
      </div>
      <button className="primary-button" onClick={() => handleSubmit(otp.join(""))}>
        Submit
      </button>
      <p className="resend-link" onClick={resetOtp}>
        Resend OTP
      </p>
    </div>
  );
}

export default EnterOTP;
