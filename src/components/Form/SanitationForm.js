import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";


const sanitationGroups = [
  {
    groupTitle: "พฤติกรรมด้านสุขาภิบาลและความสะอาด",
    groupNote: "หากปฏิบัติพฤติกรรมนั้นให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Sanitary_Disposal", label: "เด็กมีการถ่ายอุจจาระแบบถูกสุขลักษณะหรือไม่ เช่น ถ่ายในห้องน้ำและมีการชำระล้าง", type: "checkbox" },
      { key: "Child_wash_hand_before_or_after_eating_food", label: "เด็กล้างมือทั้งก่อนหรือหลังทานข้าวหรือไม่ ", type: "checkbox" },
      { key: "Child_wash_hand_before_or_after_visiting_the_toilet", label: "เด็กล้างมือทั้งก่อนหรือหลังเข้าห้องน้ำหรือไม่", type: "checkbox" },
      { key: "Mom_wash_hand_before_or_after_cleaning_children", label: "คุณแม่ล้างมือทั้งก่อนหรือหลังทำความสะอาดตัวเด็กหรือไม่", type: "checkbox" },
      { key: "Mom_wash_hand_before_or_after_feeding_the_child", label: "คุณแม่ล้างมือทั้งก่อนและหลังทำอาหารและป้อนอาหารเด็กหรือไม่", type: "checkbox" },
    ],
  },
];

function SanitationForm() {
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

  const [formData, setFormData] = useState(() => {
  const saved = localStorage.getItem("sanitationFormData");
  return saved ? JSON.parse(saved) : {};
});

  useEffect(() => {
  localStorage.setItem("sanitationFormData", JSON.stringify(formData));
}, [formData]);

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
    const group = sanitationGroups[index];

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

      if (index + 1 < sanitationGroups.length) {
        setExpandedGroup(index + 1);
      } else {
        setExpandedGroup(-1);
      }

      localStorage.setItem("sanitationCompletedGroups", JSON.stringify(newCompleted));

      return newCompleted;
    });
  };

  const toggleGroup = (index) => {
    setExpandedGroup((prev) => (prev === index ? -1 : index));
  };

  const [patientId, setPatientId] = useState(null);
const [childData, setChildData] = useState(null);
useEffect(() => {
  const savedData = localStorage.getItem("sanitationFormData");
  if (savedData) {
    setFormData(JSON.parse(savedData));
  }
}, []);
useEffect(() => {
  const savedCompleted = localStorage.getItem("sanitationCompletedGroups");
  if (savedCompleted) {
    setCompletedGroups(JSON.parse(savedCompleted));
  }
}, []);

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


  useEffect(() => {
    const totalGroups = sanitationGroups.length;
    const completedCount = completedGroups.length;
    const percent = Math.round((completedCount / totalGroups) * 100);
    setCompletion(percent);

    // อัปเดตลง localStorage ด้วย (เหมือน GroupedDataInput)
    localStorage.setItem("sanitationProgress", percent.toString());
  }, [completedGroups]);
  const handleSubmit = async () => {
  if (!patientId) {
    alert("ไม่พบข้อมูลผู้ป่วย กรุณากลับไปเลือกเด็กใหม่");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/predictions/sanitation", {
      patient_id: patientId,
      ...formData,
    });

    if (response.status === 200 || response.status === 201) {
      alert("✅ บันทึกข้อมูลสำเร็จ");
    } else {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  } catch (error) {
    console.error("❌ บันทึกข้อมูลไม่สำเร็จ:", error);
    alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
  }
};

  return (
    <div className="dashboard-container">
      <Header currentPage="form-nutrition" />

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
          <h2 className="nutrition-title">แบบสอบถามข้อมูลสุขาภิบาลของเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับข้อมูลสุขาภิบาลของเด็ก</p>
          {/* ✅ Progress */}
          <div className="progress-section">
            <span className="progress-label">ความคืบหน้า: {completion}%</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {/* ✅ Groups */}
          {sanitationGroups.map((group, index) => (
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
                    บันทึก
                  </button>
                </div>
              )}
            </div>
          ))}

         {completedGroups.length === sanitationGroups.length && totalProgress === 100 && (
  <button
    className="submit-btn"
    onClick={() => navigate("/parent-risk-assessment")}
    style={{ background: "linear-gradient(to right, #22c55e, #16a34a)" }}
  >
    ✅ กรอกข้อมูลครบแล้ว กลับหน้าหลักเพื่อวิเคราะห์ภาวะทุพโภชนาการ
  </button>
)}


          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginTop: "2rem",
            }}
          >
            {/* ปุ่มย้อนหน้า */}
           <button
  className="submit-btn"
  onClick={async () => {
    await handleSubmit(); // บันทึกก่อน
    navigate(prevPage);
  }}
  style={{ background: "linear-gradient(to right, #3b82f6, #2563eb)" }}
>
  ◀ กลับหน้าก่อนหน้า
</button>

            {/* ปุ่มกลับหน้า GroupedDataInput */}
            <button
  className="submit-btn"
  onClick={async () => {
    await handleSubmit(); // บันทึกก่อน
    navigate("/parent-risk-assessment");
  }}
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
      </div>
      <Footer />
    </div>
  );
}

export default SanitationForm;
