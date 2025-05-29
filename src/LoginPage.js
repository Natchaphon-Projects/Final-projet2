import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  const [hnNumber, setHnNumber] = useState("");
  const navigate = useNavigate();

  const users = [
    { hnNumber: "12345", role: "parent" },
    { hnNumber: "67890", role: "doctor" },
    { hnNumber: "11111", role: "admin" },
  ];

  const handleLogin = () => {
    const user = users.find((u) => u.hnNumber === hnNumber);
    if (user) {
      alert("ส่งรหัส OTP แล้ว: 123456 (เพื่อการทดสอบ)");
      navigate("/enter-otp", { state: { hnNumber } });
    } else {
      alert("หมายเลข HN ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card">
        <div className="icon-circle">
          <span role="img" aria-label="shield" className="icon">🛡️</span>
        </div>
        <h1>เข้าสู่ระบบ</h1>
        <p className="subtext">กรอกหมายเลข HN เพื่อเข้าสู่ระบบ</p>

        <input
          type="text"
          className="hn-input"
          placeholder="กรอกหมายเลข HN ของคุณ"
          value={hnNumber}
          onChange={(e) => setHnNumber(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button className="login-button" onClick={handleLogin}>
          เข้าสู่ระบบ →
        </button>

        <div className="demo-info">
          <p><strong>ข้อมูลสำหรับทดสอบ:</strong></p>
          <ul>
            <li>ผู้ปกครอง: <strong>12345</strong></li>
            <li>หมอ: <strong>67890</strong></li>
            <li>แอดมิน: <strong>11111</strong></li>
          </ul>
        </div>
        <p className="footer-text">
          ระบบจะส่ง OTP ไปยังหมายเลขโทรศัพท์ที่ลงทะเบียนไว้
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
