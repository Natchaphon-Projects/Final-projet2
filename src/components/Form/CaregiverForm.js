import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NutritionForm.css";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import axios from "axios";


const caregiverGroups = [
  {
    groupTitle: "ผู้ตอบแบบสอบถามมีความสัมพันธ์อย่างไรกับเด็ก",
    groupNote: "หากผู้ตอบแบบสอบถามมีความสัมพันธ์ที่เกี่ยวข้องกับเด็กให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Guardian", label: "บุคคลที่รับผิดชอบในการดูแลเด็กเป็นมารดาผู้ให้กำเนิดของเด็กหรือไม่", type: "checkbox" },
      { key: "Is_Respondent_Biological_Mother", label: "ผู้ตอบแบบสอบถามเป็นมารดาผู้ให้กำเนิดของเด็กหรือไม่", type: "checkbox" },
    ],
  },
  
];

function CaregiverForm() {
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
  const [patientId, setPatientId] = useState(null);
  const [childData, setChildData] = useState(null);
const [showConfirmPopup, setShowConfirmPopup] = useState(false);
const [pendingSubmitGroup, setPendingSubmitGroup] = useState(null);
  const [formData, setFormData] = useState(() => {
  const saved = localStorage.getItem("caregiverFormData");
  return saved ? JSON.parse(saved) : {};
});
useEffect(() => {
  localStorage.setItem("caregiverFormData", JSON.stringify(formData));
}, [formData]);

  const [expandedGroup, setExpandedGroup] = useState(0);
  const [completedGroups, setCompletedGroups] = useState([]);
  useEffect(() => {
  const savedCompleted = localStorage.getItem("caregiverCompletedGroups");
  if (savedCompleted) {
    const parsed = JSON.parse(savedCompleted);
    setCompletedGroups(parsed);
    // ปิด accordion ถ้ากลุ่มแรกใน saved เป็นสีเขียวแล้ว
    if (parsed.length > 0) {
      setExpandedGroup(-1);
    }
  }
}, []);


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
    const group = caregiverGroups[index];


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

      if (index + 1 < caregiverGroups.length) {

        setExpandedGroup(index + 1);
      } else {
        setExpandedGroup(-1);
      }

      localStorage.setItem("caregiverCompletedGroups", JSON.stringify(newCompleted));
      
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
    ...formData,
    created_at: new Date().toISOString()
  };

  axios.post("http://localhost:5000/predictions", dataToSend)
    .then(() => {
      alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
      if (goNext) navigate(nextPage);
    })
    .catch((err) => {
      console.error("❌ บันทึกข้อมูลล้มเหลว", err);
    });
};


  useEffect(() => {
  const totalGroups = caregiverGroups.length;
    const completedCount = completedGroups.length;
    const percent = Math.round((completedCount / totalGroups) * 100);
    setCompletion(percent);

    // อัปเดตลง localStorage ด้วย (เหมือน GroupedDataInput)
  localStorage.setItem("caregiverProgress", percent.toString());
  }, [completedGroups]);
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
          {childData && (
  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
    <h3>แบบฟอร์มของ: {childData.prefix_name_child} {childData.first_name_child} {childData.last_name_child}</h3>
    <p>HN: {childData.hn_number}</p>
  </div>
)}

          <h2 className="nutrition-title">แบบสอบถามข้อมูลผู้ดุแลเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับผู้ดุแลของเด็ก</p>

          {/* ✅ Progress */}
          <div className="progress-section">
            <span className="progress-label">ความคืบหน้า: {completion}%</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {/* ✅ Groups */}
          {caregiverGroups.map((group, index) => (
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

                 <button
  className="complete-btn"
  onClick={() => {
    setPendingSubmitGroup(index);
    setShowConfirmPopup(true);
  }}
>
  บันทึก
</button>
                </div>
              )}
            </div>
          ))}



 {completedGroups.length === caregiverGroups.length && totalProgress === 100 && (

  <button
    className="submit-btn"
    style={{ background: "linear-gradient(to right, #22c55e, #16a34a)" }}
    onClick={async () => {
      const isSubmitting = localStorage.getItem("isSubmitting");
      if (isSubmitting === "true") return;

      localStorage.setItem("isSubmitting", "true");

      const general = JSON.parse(localStorage.getItem("generalFormData") || "{}");
      const caregiver = JSON.parse(localStorage.getItem("caregiverFormData") || "{}");
      const nutrition = JSON.parse(localStorage.getItem("nutritionFormData") || "{}");
      const sanitation = JSON.parse(localStorage.getItem("sanitationFormData") || "{}");
      const patientId = localStorage.getItem("childId");

      if (!patientId) {
        alert("❌ ไม่พบรหัสผู้ป่วย กรุณาเลือกเด็กใหม่");
        localStorage.setItem("isSubmitting", "false");
        return;
      }

      const allData = {
        patient_id: patientId,
        ...general,
        ...caregiver,
        ...nutrition,
        ...sanitation,
      };

      const requiredKeys = [
        "Guardian", "Vitamin_A_Intake_First_8_Weeks", "Sanitary_Disposal",
        "Mom_wash_hand_before_or_after_cleaning_children", "Mom_wash_hand_before_or_after_feeding_the_child",
        "Child_wash_hand_before_or_after_eating_food", "Child_wash_hand_before_or_after_visiting_the_toilet",
        "Last_Month_Weight_Check", "Weighed_Twice_Check_in_Last_3_Months",
        "Given_Anything_to_Drink_in_First_6_Months", "Still_Breastfeeding",
        "Is_Respondent_Biological_Mother", "Breastfeeding_Count_DayandNight",
        "Received_Vitamin_or_Mineral_Supplements", "Received_Plain_Water",
        "Infant_Formula_Intake_Count_Yesterday", "Received_Animal_Milk",
        "Received_Animal_Milk_Count", "Received_Juice_or_Juice_Drinks",
        "Received_Yogurt", "Received_Yogurt_Count", "Received_Thin_Porridge",
        "Received_Tea", "Received_Other_Liquids", "Received_Grain_Based_Foods",
        "Received_Orange_Yellow_Foods", "Received_White_Root_Foods",
        "Received_Dark_Green_Leafy_Veggies", "Received_Ripe_Mangoes_Papayas",
        "Received_Other_Fruits_Vegetables", "Received_Meat", "Received_Eggs",
        "Received_Fish_Shellfish_Seafood", "Received_Legumes_Nuts_Foods",
        "Received_Dairy_Products", "Received_Oil_Fats_Butter",
        "Received_Sugary_Foods", "Received_Chilies_Spices_Herbs",
        "Received_Grubs_Snails_Insects", "Received_Other_Solid_Semi_Solid_Food",
        "Received_Salt", "Number_of_Times_Eaten_Solid_Food"
      ];

      // เติมค่าที่ขาด = 0
      requiredKeys.forEach((key) => {
        if (!(key in allData)) {
          allData[key] = 0;
        }
      });

      localStorage.setItem("latestPredictionData", JSON.stringify(allData));
      localStorage.setItem("isSubmitting", "false");
      navigate("/prediction-result");
    }}
  >
    ✅ บันทึกข้อมูลทั้งหมดลงระบบเพื่อวิเคราะห์ภาวะทุพโภชนาการ
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
      </div>
      {showConfirmPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>ยืนยันการบันทึกข้อมูล</h3>

      <ul className="popup-list">
        {pendingSubmitGroup !== null &&
          caregiverGroups[pendingSubmitGroup].questions.map((q) => (
            <li className="popup-row" key={q.key}>
              <span className="popup-label">{q.label}</span>
              <span
                className={`popup-value ${formData[q.key] ? "success" : "error"}`}
              >
                {formData[q.key] ? "เป็น" : "ไม่เป็น"}
              </span>
            </li>
          ))}
      </ul>

      <div className="popup-actions">
        <button
          className="cancel"
          onClick={() => {
            setShowConfirmPopup(false);
            setPendingSubmitGroup(null);
          }}
        >
          ❌ ยกเลิก
        </button>
       <button
  className="confirm"
  onClick={() => {
    setShowConfirmPopup(false);
    handleGroupComplete(pendingSubmitGroup); // ✅ บันทึกกลุ่ม
    setPendingSubmitGroup(null);
    navigate(nextPage); // ✅ ไปหน้าถัดไป
  }}
>
  ✅ ยืนยันบันทึก ➜
</button>

      </div>
    </div>
  </div>
)}
      <Footer />
    </div>
  );
}

export default CaregiverForm;
