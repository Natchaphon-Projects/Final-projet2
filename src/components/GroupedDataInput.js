import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ParentDashboard.css";
import logo from "../assets/logo.png";

function Groupdatainput() {
  const navigate = useNavigate();

  const [groupProgress, setGroupProgress] = useState({
    general: 100,
    caregiver: 50,
    nutrition: 0,
    sanitation: 25,
  });

  const totalProgress =
    (groupProgress.general +
      groupProgress.caregiver +
      groupProgress.nutrition +
      groupProgress.sanitation) /
    4;

  const groups = [
    {
      key: "general",
      emoji: "📋",
      label: "ข้อมูลทั่วไป",
      description: "ข้อมูลพื้นฐานและข้อมูลทั่วไป",
      color: "#22c55e",
      buttonGradient: "gradient-general",
    },
    {
      key: "caregiver",
      emoji: "👨‍👩‍👧",
      label: "ผู้เลี้ยงดูหลัก",
      description: "ข้อมูลผู้ดูแลและครอบครัว",
      color: "#f59e0b",
      buttonGradient: "gradient-caregiver",
    },
    {
      key: "nutrition",
      emoji: "🍚",
      label: "อาหารที่เด็กได้รับ",
      description: "ข้อมูลโภชนาการและการรับประทาน",
      color: "#ef4444",
      buttonGradient: "gradient-nutrition",
    },
    {
      key: "sanitation",
      emoji: "🚿",
      label: "สุขาภิบาล",
      description: "ข้อมูลความสะอาดและสุขอนามัย",
      color: "#06b6d4",
      buttonGradient: "gradient-sanitation",
    },
  ];

  const getProgressStatus = (progress) => {
    if (progress === 100) return { icon: "✅", text: "เสร็จสิ้น" };
    if (progress > 0) return { icon: "⏳", text: "กำลังดำเนินการ" };
    return { icon: "❌", text: "ยังไม่เริ่ม" };
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <img src={logo} alt="Logo" className="dashboard-logo" />
        <nav>
          <ul className="nav-links">
            <li>
              <button className="nav-button" onClick={() => navigate("/parent-dashboard")}>หน้าแรก</button>
            </li>
            <li>
              <button className="nav-button" onClick={() => navigate("/parent-risk-assessment")}>ประเมินความเสี่ยงเบื้องต้น</button>
            </li>
            <li>
              <button className="logout-button" onClick={() => navigate("/")}>ออกจากระบบ</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main */}
      <main className="dashboard-main center-content">
        <h2 className="main-title" style={{ textAlign: "center" }}>
          เลือกกลุ่มข้อมูลที่ต้องการกรอก
        </h2>
        <p className="main-description" style={{ textAlign: "center" }}>
          กรอกข้อมูลให้ครบถ้วนเพื่อประเมินสถานการณ์ได้อย่างแม่นยำ
        </p>

        <div className="overall-progress">
          <div className="progress-info">
            <span className="progress-label-main">ความคืบหน้าโดยรวม</span>
            <span className="progress-percentage">{Math.round(totalProgress)}%</span>
          </div>
          <div className="main-progress-container">
            <div className="main-progress-bar" style={{ width: `${totalProgress}%` }} />
          </div>
          <p className="progress-status">
            {totalProgress === 100
              ? "เสร็จสิ้น! 🎉"
              : `เหลืออีก ${100 - Math.round(totalProgress)}% ที่ต้องกรอก`}
          </p>
        </div>

        <div className="groups-grid">
          {groups.map((group) => {
            const progress = groupProgress[group.key];
            const { icon, text } = getProgressStatus(progress);

            return (
              <div className="group-card animate-fade-in" key={group.key}>
                <div className="card-header">
                  <div className="emoji">{group.emoji}</div>
                  <div className="status-container">
                    <span className="status-icon">{icon}</span>
                    <span className="status-text">{text}</span>
                  </div>
                </div>

                <div className="card-content">
                  <h3 className="card-title">{group.label}</h3>
                  <p className="card-description">{group.description}</p>
                </div>

                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">ความคืบหน้า</span>
                    <span className="progress-value">{progress}%</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${progress}%`, backgroundColor: group.color }}
                    />
                  </div>
                </div>

                <button
                  className={`action-button ${group.buttonGradient}`}
                  onClick={() => navigate(`/form/${group.key}`)}
                >
                  <span>ไปยังแบบฟอร์ม</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2023 - Project Hospital</p>
      </footer>
    </div>
  );
}

export default Groupdatainput;
