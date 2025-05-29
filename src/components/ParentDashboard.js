import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ParentDashboard.css";
import logo from "../assets/logo.png";
import loupeIcon from "../assets/loupe.png";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import {
  FaHeart,
  FaDumbbell,
  FaAppleAlt,
  FaTint,
  FaShieldAlt,
  FaBalanceScale,
} from "react-icons/fa";

function ParentDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [parentData, setParentData] = useState(null);

  const hnNumber = location.state?.hnNumber || localStorage.getItem("hnNumber");

  useEffect(() => {
    if (hnNumber) {
      // ✅ เรียก API เพื่อดึงข้อมูลผู้ปกครองตาม HN
      axios.get(`http://localhost:5000/parents/${hnNumber}`)
        .then(res => setParentData(res.data))
        .catch(err => console.error("ไม่สามารถโหลดข้อมูลผู้ปกครองได้", err));
    }
  }, [hnNumber]);

  const handleReadMore = (title) => {
    alert(`อ่านเพิ่มเติมเกี่ยวกับ: ${title}`);
  };

  const recommendations = [
    { icon: <FaHeart />, title: "ลดการบริโภคอาหารที่มีไขมันสูง", description: "ช่วยลดความเสี่ยงของโรคหัวใจและน้ำหนักเกิน", color: "red" },
    { icon: <FaDumbbell />, title: "เพิ่มการออกกำลังกายวันละ 30 นาที", description: "ช่วยเสริมสร้างความแข็งแรงของร่างกาย", color: "blue" },
    { icon: <FaAppleAlt />, title: "เพิ่มการบริโภคผักและผลไม้", description: "เพิ่มวิตามินและแร่ธาตุเพื่อสุขภาพที่ดี", color: "green" },
    { icon: <FaTint />, title: "ดื่มน้ำให้เพียงพอ", description: "ช่วยให้ระบบการย่อยและการเผาผลาญทำงานได้ดี", color: "cyan" },
    { icon: <FaShieldAlt />, title: "เพิ่มการบริโภคธาตุเหล็ก", description: "ป้องกันภาวะโลหิตจางที่เกิดจากการขาดธาตุเหล็ก", color: "orange" },
    { icon: <FaBalanceScale />, title: "ควบคุมน้ำหนัก", description: "ลดความเสี่ยงของโรคอ้วนและเบาหวาน", color: "purple" },
  ];

  return (
    <div className="dashboard-container">
      <Header />

      <main className="dashboard-main">
        {/* Profile Info */}
        <div className="user-info-header">
          <div className="profile-circle">
            {parentData?.first_name_parent?.charAt(0)}
            {parentData?.last_name_parent?.charAt(0)}
          </div>
          <div className="user-details">
            <p className="greeting">ยินดีต้อนรับ</p>
            <h2 className="role">ผู้ปกครอง</h2>
            <p className="username">
              คุณ {parentData ? `${parentData.first_name_parent} ${parentData.last_name_parent}` : "Loading..."}
            </p>
            <div className="underline" />
          </div>
        </div>

        {/* Menu */}
        <div className="menu-container">
          <div className="menu-item" onClick={() => navigate("/parent-risk-assessment", { state: { hnNumber } })}>
            <img src={loupeIcon} alt="Risk Assessment" className="menu-icon" />
            <p className="menu-title">ประเมินความเสี่ยงเบื้องต้น</p>
            <small className="menu-description">Preliminary Risk Assessment</small>
          </div>
        </div>

        {/* Recommendations */}
        <div className="recommendation-section">
          <h3>คำแนะนำเกี่ยวกับภาวะโภชนาการ</h3>
          <div className="recommendation-cards">
            {recommendations.map((item, idx) => (
              <div key={idx} className="recommendation-card">
                <div className={`icon-circle ${item.color}`}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <button className="read-more-button" onClick={() => handleReadMore(item.title)}>
                  อ่านเพิ่มเติม
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default ParentDashboard;
