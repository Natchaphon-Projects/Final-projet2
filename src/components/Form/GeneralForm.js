import React, { useState, useEffect } from "react";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import { Weight } from "lucide-react";

const nutritionGroups = [
  {
    groupTitle: "จำนวนครั้ง",
    groupNote: "✏️ โปรดกรอกจำนวนครั้งเป็นตัวเลข",
    questions: [
      { key: "Weight", label: "น้ำหนัก", type: "number" },
      { key: "Height", label: "ส่วนสูง", type: "number" },
      { key: "โรคที่แพ้", label: "อาหารที่แพ้", type: "number" },
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
  const prevIndex = (currentIndex - 1 + pages.length) % pages.length;
  const prevPage = pages[prevIndex];

  const [formData, setFormData] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [completedGroups, setCompletedGroups] = useState([]);
  const [completion, setCompletion] = useState(0);

  // 👇 เพิ่มคำนวณ totalProgress เหมือน GroupedDataInput
  const totalProgress =
    (parseInt(localStorage.getItem("generalProgress") || 0) +
      parseInt(localStorage.getItem("caregiverProgress") || 0) +
      parseInt(localStorage.getItem("nutritionProgress") || 0) +
      parseInt(localStorage.getItem("sanitationProgress") || 0)) / 4;


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
      const question = group.questions.find(q => q.key === key);

      if (question.type === "number") {
        return value !== "" && value !== undefined;
      } else if (question.type === "dropdown") {
        return value !== "" && value !== undefined;
      }

      return true;
    });

    if (!isComplete) {
      alert("กรุณากรอกข้อมูลให้ครบก่อนกดยืนยัน ✅");
      return;
    }

    setCompletedGroups((prevCompletedGroups) => {
      let newCompleted = prevCompletedGroups;

      if (!prevCompletedGroups.includes(index)) {
        newCompleted = [...prevCompletedGroups, index];
      }

      if (index + 1 < nutritionGroups.length) {
        setExpandedGroup(index + 1);
      } else {
        setExpandedGroup(-1);
      }

      return newCompleted;
    });
  };

  const toggleGroup = (index) => {
    setExpandedGroup((prev) => (prev === index ? -1 : index));
  };

  const handleSubmit = () => {
    console.log("🟢 ข้อมูลที่ส่ง:", formData);
  };

  useEffect(() => {
    const totalGroups = nutritionGroups.length;
    const completedCount = completedGroups.length;
    const percent = Math.round((completedCount / totalGroups) * 100);
    setCompletion(percent);

    // อัปเดตลง localStorage ด้วย (เหมือน GroupedDataInput)
    localStorage.setItem("nutritionProgress", percent.toString());
  }, [completedGroups]);

  return (
    <div className="dashboard-container">
      <Header />

      {/* ✅ แถบ progress รวม */}
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
          <h2 className="nutrition-title">แบบสอบถามข้อมูลโภชนาการของเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับการได้รับสารอาหารของเด็ก</p>

          {/* ✅ Progress */}
          <div className="progress-section">
            <span className="progress-label">ความคืบหน้า: {completion}%</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {/* ✅ Groups */}
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

                  <div className="checkbox-grid">
                    {group.questions.map(({ key, label, type }) =>
                      type === "checkbox" ? (
                        <div className="checkbox-row" key={key}>
                          <input
                            type="checkbox"
                            id={key}
                            checked={formData[key] || false}
                            onChange={(e) => handleChange(key, e.target.checked)}
                          />
                          <label htmlFor={key}>{label}</label>
                        </div>
                      ) : null
                    )}
                  </div>

                  {group.questions.some((q) => q.type === "number" || q.type === "dropdown") && (
                    <div className="number-grid">
                      {group.questions.map(({ key, label, type, options }) => {
                        if (type === "number") {
                          return (
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
                          );
                        } else if (type === "dropdown") {
                          return (
                            <div className="number-item" key={key}>
                              <label className="question-label">
                                {label}
                                <select
                                  value={formData[key] || ""}
                                  onChange={(e) => handleChange(key, e.target.value)}
                                  className="number-input"
                                >
                                  <option value="">-- เลือกตัวเลือก --</option>
                                  {options.map((opt, idx) => (
                                    <option key={idx} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </label>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </div>
                  )}

                  <button className="complete-btn" onClick={() => handleGroupComplete(index)}>
                    ถัดไป ➜
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* ✅ ปุ่มบันทึกข้อมูล */}
          {completedGroups.length === nutritionGroups.length && (
            <button className="submit-btn" onClick={handleSubmit}>
              บันทึกข้อมูล
            </button>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", marginTop: "2rem" }}>
            <button
              className="submit-btn"
              onClick={() => navigate(prevPage)}
              style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
            >
              ◀ กลับหน้าก่อนหน้า
            </button>

            <button
              className="submit-btn"
              onClick={() => navigate(nextPage)}
              style={{ background: "linear-gradient(to right, #10b981, #06b6d4)" }}
            >
              ตอบคำถามหน้าถัดไป ➜
            </button>
          </div>


        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NutritionForm;
