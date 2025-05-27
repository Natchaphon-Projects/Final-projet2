import React from "react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";
import logo from "../assets/logo.png";
import loupeIcon from "../assets/loupe.png";
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

  const handleReadMore = (title) => {
    alert(`อ่านเพิ่มเติมเกี่ยวกับ: ${title}`);
  };

  const recommendations = [
    {
      icon: <FaHeart />,
      title: "ลดการบริโภคอาหารที่มีไขมันสูง",
      description: "ช่วยลดความเสี่ยงของโรคหัวใจและน้ำหนักเกิน",
      color: "red",
    },
    {
      icon: <FaDumbbell />,
      title: "เพิ่มการออกกำลังกายวันละ 30 นาที",
      description: "ช่วยเสริมสร้างความแข็งแรงของร่างกาย",
      color: "blue",
    },
    {
      icon: <FaAppleAlt />,
      title: "เพิ่มการบริโภคผักและผลไม้",
      description: "เพิ่มวิตามินและแร่ธาตุเพื่อสุขภาพที่ดี",
      color: "green",
    },
    {
      icon: <FaTint />,
      title: "ดื่มน้ำให้เพียงพอ",
      description: "ช่วยให้ระบบการย่อยและการเผาผลาญทำงานได้ดี",
      color: "cyan",
    },
    {
      icon: <FaShieldAlt />,
      title: "เพิ่มการบริโภคธาตุเหล็ก",
      description: "ป้องกันภาวะโลหิตจางที่เกิดจากการขาดธาตุเหล็ก",
      color: "orange",
    },
    {
      icon: <FaBalanceScale />,
      title: "ควบคุมน้ำหนัก",
      description: "ลดความเสี่ยงของโรคอ้วนและเบาหวาน",
      color: "purple",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <button className="nav-button" onClick={() => navigate("/parent-dashboard")}>
                หน้าแรก
              </button>
            </li>
            <li>
              <button className="nav-button" onClick={() => navigate("/parent-risk-assessment")}>
                ประเมินความเสี่ยงเบื้องต้น
              </button>
            </li>
            <li>
              <button className="logout-button" onClick={() => navigate("/")}>
                ออกจากระบบ
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main">
        {/* Profile Left-Aligned */}
 {/* Profile Header Block */}
<div className="user-info-header">
  <div className="profile-circle">CT</div>
  <div className="user-details">
    <p className="greeting">ยินดีต้อนรับ</p>
    <h2 className="role">ผู้ปกครอง</h2>
    <p className="username">คุณ Chin Tanawat</p>
    <div className="underline" />
  </div>
</div>


        {/* Quick Menu */}
        <div className="menu-container">
          <div className="menu-item" onClick={() => navigate("/parent-risk-assessment")}>
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

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default ParentDashboard;
