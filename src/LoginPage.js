import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./LoginPage.css";

function LoginPage() {
  const [hnNumber, setHnNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!hnNumber.trim()) {
      alert("กรุณากรอกหมายเลข HN");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/login", { hnNumber });
      const { role } = response.data;

      alert("ส่งรหัส OTP แล้ว: 123456 (เพื่อการทดสอบ)");

      // ส่ง hnNumber และ role ไปหน้า enter-otp
      navigate("/enter-otp", { state: { hnNumber, role } });
    } catch (error) {
      alert("หมายเลข HN ไม่ถูกต้อง หรือเชื่อมต่อเซิร์ฟเวอร์ไม่ได้");
    }
    setLoading(false);
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

        <button className="login-button" onClick={handleLogin} disabled={loading}>
          {loading ? "กำลังตรวจสอบ..." : "เข้าสู่ระบบ →"}
        </button>

        <div className="demo-info">
          <p><strong>ตัวอย่างหมายเลข HN ที่ใช้งานได้:</strong></p>
          <ul>
            <li>ผู้ปกครอง: <strong>1001</strong></li>
            <li>หมอ: <strong>9002</strong></li>
            <li>แอดมิน: <strong>9001</strong></li>
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
