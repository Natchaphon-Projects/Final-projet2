import React, { useState, useEffect } from "react";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const nutritionGroups = [
  {
    groupTitle: "จำนวนครั้ง",
    groupNote: "✏️ โปรดกรอกจำนวนครั้งเป็นตัวเลข",
    questions: [
      { key: "Weight", label: "น้ำหนัก", type: "number" },
      { key: "Height", label: "ส่วนสูง", type: "number" }
    ],
  },
];

function NutritionForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    "/form/general",
    "/form/caregiver",
    "/form/nutrition",
    "/form/sanitation",
  ];

  const currentIndex = pages.indexOf(location.pathname);
  const nextIndex = (currentIndex + 1) % pages.length;
  const nextPage = pages[nextIndex];
  const prevPage = pages[(currentIndex - 1 + pages.length) % pages.length];

  const [formData, setFormData] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [completedGroups, setCompletedGroups] = useState([]);
  const [completion, setCompletion] = useState(0);
  const [patientId, setPatientId] = useState(null);
  const [childData, setChildData] = useState(null);

  const totalProgress =
    (parseInt(localStorage.getItem("generalProgress") || 0) +
      parseInt(localStorage.getItem("caregiverProgress") || 0) +
      parseInt(localStorage.getItem("nutritionProgress") || 0) +
      parseInt(localStorage.getItem("sanitationProgress") || 0)) / 4;

  // โหลดข้อมูลเด็กจาก localStorage
  useEffect(() => {
    const childId = localStorage.getItem("childId");
    if (childId) {
      axios.get(`http://localhost:5000/patients/${childId}`)
        .then((res) => {
          setChildData(res.data);
          setPatientId(childId);
        })
        .catch((err) => console.error("โหลดข้อมูลเด็กไม่สำเร็จ", err));
    } else {
      console.warn("ไม่พบ childId ใน localStorage");
    }
  }, []);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGroupComplete = (index) => {
    const group = nutritionGroups[index];
    const requiredKeys = group.questions.map(q => q.key);
    const isComplete = requiredKeys.every(key => {
      const value = formData[key];
      return value !== "" && value !== undefined;
    });

    if (!isComplete) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนกดยืนยัน ✅");
      return;
    }

    setCompletedGroups((prev) => {
      const newCompleted = prev.includes(index) ? prev : [...prev, index];
      setExpandedGroup(index + 1 < nutritionGroups.length ? index + 1 : -1);
      return newCompleted;
    });
  };

  const toggleGroup = (index) => {
    setExpandedGroup((prev) => (prev === index ? -1 : index));
  };

  const handleSubmit = () => {
    if (!patientId) {
      alert("ไม่สามารถระบุรหัสผู้ป่วยได้");
      return;
    }

    const dataToSend = {
      patient_id: patientId,
      height: formData["Height"],
      weight: formData["Weight"],
      visit_date: new Date().toISOString().split("T")[0]
    };
console.log("📤 ส่งข้อมูล:", dataToSend);

    axios.post("http://localhost:5000/medical-records", dataToSend)
      .then(() => {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
      })
      .catch((err) => {
        console.error("❌ บันทึกข้อมูลล้มเหลว", err);
      });
  };

  useEffect(() => {
    const percent = Math.round((completedGroups.length / nutritionGroups.length) * 100);
    setCompletion(percent);
    localStorage.setItem("nutritionProgress", percent.toString());
  }, [completedGroups]);

  return (
    <div className="dashboard-container">
      <Header />

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

      <div className="nutrition-form-container">
        <div className="nutrition-card">

          {/* ✅ แสดงชื่อเด็ก */}
          {childData && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h3>แบบฟอร์มของ: {childData.prefix_name_child} {childData.first_name_child} {childData.last_name_child}</h3>
              <p>HN: {childData.hn}</p>
            </div>
          )}

          <h2 className="nutrition-title">แบบสอบถามข้อมูลโภชนาการของเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับโภชนาการของเด็ก</p>

          <div className="progress-section">
            <span className="progress-label">ความคืบหน้า: {completion}%</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {nutritionGroups.map((group, index) => (
            <div className="accordion-group" key={index}>
              <button
                className={`accordion-toggle ${completedGroups.includes(index) ? "completed-group" : ""}`}
                onClick={() => toggleGroup(index)}
              >
                {group.groupTitle}
                <span>{expandedGroup === index ? "▲" : "▼"}</span>
              </button>

              {expandedGroup === index && (
                <div className="accordion-content">
                  {group.groupNote && <div className="group-note">{group.groupNote}</div>}
                  <div className="number-grid">
                    {group.questions.map(({ key, label }) => (
                      <div className="number-item" key={key}>
                        <label className="question-label">
                          {label}
                          <input
                            type="number"
                            value={formData[key] || ""}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="number-input"
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                  <button className="complete-btn" onClick={() => handleGroupComplete(index)}>
                    ถัดไป ➜
                  </button>
                </div>
              )}
            </div>
          ))}

          {completedGroups.length === nutritionGroups.length && (
            <button className="submit-btn" onClick={handleSubmit}>
              บันทึกข้อมูล
            </button>
          )}

          {/* ปุ่มย้อนหน้า */}
            <button
              className="submit-btn"
              onClick={() => navigate(prevPage)}
              style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
            >
              ◀ กลับหน้าก่อนหน้า
            </button>

            {/* ปุ่มกลับหน้า GroupedDataInput */}
            <button
              className="submit-btn"
              onClick={() => navigate("/parent-risk-assessment")} // เส้นทาง path ของหน้า GroupedDataInput
              style={{ background: "linear-gradient(to right, #f59e0b, #f97316)" }}
            >
              🏠 กลับหน้าเลือกกลุ่มข้อมูล
            </button>

            {/* ปุ่มไปหน้าใหม่ */}
            <button
              className="submit-btn"
              onClick={() => navigate(nextPage)}
              style={{ background: "linear-gradient(to right, #10b981, #06b6d4)" }}
            >
              ตอบคำถามหน้าถัดไป ➜
            </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default NutritionForm;
