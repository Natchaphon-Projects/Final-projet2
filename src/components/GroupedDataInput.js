import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupedDataInput.css";
import clockwiseIcon from "../assets/clockwise.png";
import doneIcon from "../assets/done.png";
import foodIcon from "../assets/healthy-food.png";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function Groupdatainput() {
  const navigate = useNavigate();

  const [groupProgress, setGroupProgress] = useState({
    general: 100,
    caregiver: 50,
    nutrition: 0,
    sanitation: 25,
  });

  useEffect(() => {
    const savedNutrition = localStorage.getItem("nutritionProgress");
    if (savedNutrition) {
      setGroupProgress((prev) => ({
        ...prev,
        nutrition: parseInt(savedNutrition),
      }));
    }
  }, []);

  const totalProgress =
    (groupProgress.general +
      groupProgress.caregiver +
      groupProgress.nutrition +
      groupProgress.sanitation) /
    4;

  const groups = [
    {
      label: "ข้อมูลทั่วไป",
      description: "ข้อมูลพื้นฐานและข้อมูลทั่วไป",
      path: "/form/general",
      color: "#22c55e",
      buttonGradient: "gradient-general",
      progress: groupProgress.general,
      emoji: "",
    },
    {
      label: "ผู้เลี้ยงดูหลัก",
      description: "ข้อมูลผู้ดูแลและครอบครัว",
      path: "/form/caregiver",
      color: "#f59e0b",
      buttonGradient: "gradient-caregiver",
      progress: groupProgress.caregiver,
      emoji: "",
    },
    {
      label: "อาหารที่เด็กได้รับ",
      description: "ข้อมูลโภชนาการและการรับประทาน",
      path: "/form/nutrition",
      color: "#ef4444",
      buttonGradient: "gradient-nutrition",
      progress: groupProgress.nutrition,
      emoji: <img src={foodIcon} alt="อาหาร" style={{ width: "40px", height: "40px" }} />,
    },
    {
      label: "สุขาภิบาล",
      description: "ข้อมูลความสะอาดและสุขอนามัย",
      path: "/form/sanitation",
      color: "#06b6d4",
      buttonGradient: "gradient-sanitation",
      progress: groupProgress.sanitation,
      emoji: "",
    },
  ];

  const getProgressStatus = (progress) => {
    if (progress === 100)
      return {
        icon: <img src={doneIcon} alt="done" style={{ width: "24px", height: "24px" }} />,
        text: "เสร็จสิ้น",
      };
    if (progress > 0)
      return {
        icon: <img src={clockwiseIcon} alt="loading" style={{ width: "24px", height: "24px" }} />,
        text: "กำลังกรอกข้อมูล",
      };
    return { icon: "❌", text: "ยังไม่เริ่ม" };
  };

  return (
    <div className="dashboard-container">
      <Header />

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
          {groups.map((group, index) => {
            const { icon, text } = getProgressStatus(group.progress);

            return (
              <div className="group-card animate-fade-in" key={index}>
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
                    <span className="progress-value">{group.progress}%</span>
                  </div>
                  <div className="progress-container">
                    <div
                      className="progress-bar"
                      style={{ width: `${group.progress}%`, backgroundColor: group.color }}
                    />
                  </div>
                </div>

                <button
                  className={`action-button ${group.buttonGradient}`}
                  onClick={() => navigate(group.path)}
                >
                  <span>ไปยังแบบฟอร์ม</span>
                  <span className="arrow">→</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Groupdatainput;