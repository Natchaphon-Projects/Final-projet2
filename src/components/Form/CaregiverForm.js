import React, { useState, useEffect } from "react";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const nutritionGroups = [
  {
    groupTitle: "ผู้ตอบแบบสอบถามมีความสัมพันธ์อย่างไรกับเด็ก",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Guardian", label: "เป็นผู้ดูแลเด็กด้วยตัวเองใช่หรือไม่", type: "checkbox" },
      { key: "Is_Respondent_Biological_Mother", label: "เป็นมารดาผู้ให้กำเนิดหรือไม่", type: "checkbox" },
    ],
  },
  
];

function NutritionForm() {
  const [formData, setFormData] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [completion, setCompletion] = useState(0);

  const toggleGroup = (index) => {
    setExpandedGroup(expandedGroup === index ? null : index);
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    const totalQuestions = nutritionGroups.reduce((sum, group) => sum + group.questions.length, 0);
    const answered = Object.keys(formData).filter((k) => formData[k] !== false && formData[k] !== "").length;
    setCompletion(Math.round((answered / totalQuestions) * 100));
  }, [formData]);

  const handleSubmit = () => {
    console.log("🟢 ข้อมูลที่ส่ง:", formData);
  };

  return (
    <div className="dashboard-container">
      <Header />
      <div className="nutrition-form-container">
        <div className="nutrition-card">
          <h2 className="nutrition-title">แบบสอบถามข้อมูลโภชนาการของเด็ก</h2>
          <p className="nutrition-subtitle">กรุณาตอบคำถามเกี่ยวกับการได้รับสารอาหารของเด็ก</p>

          <div className="progress-section">
            <span className="progress-label">ความคืบหน้า: {completion}%</span>
            <div className="progress-bar-wrapper">
              <div className="progress-bar-fill" style={{ width: `${completion}%` }} />
            </div>
          </div>

          {nutritionGroups.map((group, index) => (
            <div className="accordion-group" key={index}>
              <button className="accordion-toggle" onClick={() => toggleGroup(index)}>
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

                  {group.questions.some((q) => q.type === "number") && (
                    <div className="number-grid">
                      {group.questions.map(({ key, label, type }) =>
                        type === "number" ? (
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
                        ) : null
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          <button className="submit-btn" onClick={handleSubmit}>บันทึกข้อมูล</button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NutritionForm;
