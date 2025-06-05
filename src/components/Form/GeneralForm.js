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

function GeneralForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const pages = [
    "/form/general",
    "/form/caregiver",
    "/form/nutrition",
    "/form/sanitation",
  ];

  const currentIndex = pages.indexOf(location.pathname);
  const nextPage = pages[(currentIndex + 1) % pages.length];
  const prevPage = pages[(currentIndex - 1 + pages.length) % pages.length];

  const [formData, setFormData] = useState(() => {
  const saved = localStorage.getItem("generalFormData");
  return saved ? JSON.parse(saved) : {};
});

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




  // ✅ บันทึกข้อมูลเมื่อ formData เปลี่ยน
  useEffect(() => {
    localStorage.setItem("generalFormData", JSON.stringify(formData)); // ✅ แก้ให้ตรงกัน
  }, [formData]);
  // ✅ เพิ่มตรงนี้
useEffect(() => {
  const savedCompleted = localStorage.getItem("generalCompletedGroups");
  if (savedCompleted) {
    setCompletedGroups(JSON.parse(savedCompleted));
  }
}, []);

  // ✅ โหลดข้อมูลเด็ก
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

  // ✅ เพิ่มการบันทึกลง localStorage
  localStorage.setItem("generalCompletedGroups", JSON.stringify(newCompleted));

  return newCompleted;
});

  };

  const toggleGroup = (index) => {
    setExpandedGroup((prev) => (prev === index ? -1 : index));
  };

  const handleSubmit = (goNext = false) => {
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

    axios.post("http://localhost:5000/medical-records", dataToSend)
      .then(() => {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
        if (goNext) navigate(nextPage);
      })
      .catch((err) => {
        console.error("❌ บันทึกข้อมูลล้มเหลว", err);
      });
  };

  useEffect(() => {
    const percent = Math.round((completedGroups.length / nutritionGroups.length) * 100);
    setCompletion(percent);
    localStorage.setItem("generalProgress", percent.toString());
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
          {childData && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h3>แบบฟอร์มของ: {childData.prefix_name_child} {childData.first_name_child} {childData.last_name_child}</h3>
              <p>HN: {childData.hn}</p>
            </div>
          )}

          <h2 className="nutrition-title">แบบสอบถามข้อมูลทั่วไปของเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับน้ำหนักและส่วนสูง</p>

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
                    บันทึก
                  </button>
                </div>
              )}
            </div>
          ))}

          {completedGroups.length === nutritionGroups.length && totalProgress === 100 && (
  <button
    className="submit-btn"
    onClick={() => navigate("/parent-risk-assessment")}
    style={{ background: "linear-gradient(to right, #22c55e, #16a34a)" }}
  >
    ✅ กรอกข้อมูลครบแล้ว กลับหน้าหลักเพื่อวิเคราะห์ภาวะทุพโภชนาการ
  </button>
)}


          <div className="navigation-buttons">
            <button className="submit-btn" onClick={() => navigate(prevPage)}>◀ กลับหน้าก่อนหน้า</button>
            <button className="submit-btn" onClick={() => navigate("/parent-risk-assessment")}>🏠 กลับหน้าหลัก</button>
            <button className="submit-btn" onClick={() => navigate(nextPage)}>ตอบคำถามหน้าถัดไป ➜</button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default GeneralForm;