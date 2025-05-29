import React, { useState, useEffect } from "react";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";

const nutritionGroups = [
  {
    groupTitle: "ผลิตภัณฑ์เกี่ยวกับนมเหล่านี้หรือไม่",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Still_Breastfeeding", label: "ขณะนี้เด็กยังคงได้รับนมแม่อยู่", type: "checkbox" },
      { key: "Infant_Formula_Intake_Count_Yesterday", label: "มีการบริโภคนมผง", type: "checkbox" },
      { key: "Received_Animal_Milk", label: "ได้รับนมที่ไม่ใช่นมแม่ เช่น นมวัว หรือนมแพะ ", type: "checkbox" },
      { key: "Received_Yogurt", label: "ได้รับโยเกิร์ตหรืออาหารที่มีส่วนผสมของโยเกิร์ต", type: "checkbox" },
      { key: "Received_Dairy_Products", label: "ได้รับผลิตภัณฑ์จากนมหรือไม่", type: "checkbox" },
    ],
  },
  {
    groupTitle: "มีการบริโภคเครื่องดื่มประเภทเหล่านี้หรือไม่",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Received_Plain_Water", label: "ได้รับน้ำเปล่า", type: "checkbox" },
      { key: "Received_Juice_or_Juice_Drinks", label: "ได้รับน้ำผลไม้", type: "checkbox" },
      { key: "Received_Tea", label: "ได้รับชาหรือเครื่องดื่มผสมคาเฟอีน", type: "checkbox" },
      { key: "Received_Other_Liquids", label: "ได้รับของเหลวอื่นๆ นอกเหนือจากนี้ เช่น น้ำอัดลม เป็นต้น", type: "checkbox" },
    ],
  },
  {
    groupTitle: "มีการบริโภคอาหารประเภทเหล่านี้หรือไม่",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Received_Grain_Based_Foods", label: "อาหารที่ทำจากธัญพืช เช่น ขนมปัง ข้าว เส้นก๋วยเตี๋ยว", type: "checkbox" },
      { key: "Received_Orange_Yellow_Foods", label: "อาหารผักเนื้อสีส้ม/เหลืองเข้ม เช่น ฟักทอง แครอท", type: "checkbox" },
      { key: "Received_White_Root_Foods", label: "อาหารประเภทหัวที่มีแป้งและเนื้อสีขาว เช่น มันเทศขาว มันเผือก", type: "checkbox" },
      { key: "Received_Dark_Green_Leafy_Veggies", label: "ได้รับผักใบเขียวเข้ม เช่น ผักโขม คะน้า", type: "checkbox" },
      { key: "Received_Other_Fruits_Vegetables", label: "ได้รับผลไม้/ผักอื่นๆนอกเหนือจากที่กล่าว", type: "checkbox" },
      { key: "Received_Meat", label: "ได้รับเนื้อสัตว์ประเภทต่างๆ", type: "checkbox" },
      { key: "Received_Eggs", label: "ได้รับอาหารที่มีส่วนผสมของไข่", type: "checkbox" },
      { key: "Received_Fish_Shellfish_Seafood", label: "ได้รับทะเล เช่น ปลา กุ้ง หอย", type: "checkbox" },
      { key: "Received_Legumes_Nuts_Foods", label: "ได้รับอาหารที่มีส่วนผสมของถั่วหรือทำจากถั่วต่างๆ", type: "checkbox" },
      { key: "Received_Oil_Fats_Butter", label: "ได้รับอาหารประเภทไขมันต่างๆ เช่น น้ำมัน เนย ไขมันสัตว์", type: "checkbox" },
      { key: "Received_Sugary_Foods", label: "ได้รับอาหารหวาน เช่น ช็อกโกแลต ลูกกวาด ขนมหวาน", type: "checkbox" },
      { key: "Received_Chilies_Spices_Herbs", label: "ได้รับเครื่องเทศ/สมุนไพรต่างๆหรือไม่", type: "checkbox" },
      { key: "Received_Grubs_Snails_Insects", label: "ได้รับอาหารที่มีส่วนผสมของตัวอ่อน/หอยทาก/หนอน", type: "checkbox" },
      { key: "Received_Other_Solid_Semi_Solid_Food", label: "ได้รับอาหารอื่นๆนอกจากอาหารเสริม", type: "checkbox" },
      { key: "Received_Salt", label: "ได้รับอาหารที่เติมเกลือหรือไม่", type: "checkbox" },
    ],
  },
  {
    groupTitle: "อาหารเสริม",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Received_Vitamin_or_Mineral_Supplements", label: "ได้รับอาหารเสริมวิตามินหรือแร่ธาตุ", type: "checkbox" },
      { key: "Vitamin_A_Intake_First_8_Weeks", label: "ได้รับวิตามินเอภายใน 8 สัปดาห์แรกที่เกิดหรือไม่", type: "checkbox" },
    ],
  },
  {
    groupTitle: "จำนวนครั้งในการบริโภคอาหารต่างๆ ",
    groupNote: "✏️ โปรดกรอกจำนวนครั้งเป็นตัวเลข",
    questions: [
      { key: "Breastfeeding_Count_DayandNight", label: "จำนวนครั้งให้นมทั้งวันและคืน", type: "number" },
      { key: "Received_Animal_Milk_Count", label: "จำนวนครั้งดื่มนมสัตว์", type: "number" },
      { key: "Received_Yogurt_Count", label: "จำนวนครั้งบริโภคโยเกิร์ต", type: "number" },
      {
        key: "Number_of_Times_Eaten_Solid_Food",
        label: "จำนวนมื้ออาหารแข็ง",
        type: "dropdown",
        options: [
          "1-2 มื้อ",
          "3-4 มื้อ",
          "4 มื้อขึ้นไป",
          "ไม่ได้บริโภค"
        ]
      },
    ],
  },
];

function NutritionForm() {
  const [formData, setFormData] = useState({});
  const [expandedGroup, setExpandedGroup] = useState(0);
  const [completedGroups, setCompletedGroups] = useState([]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleGroupComplete = (index) => {
    if (!completedGroups.includes(index)) {
      setCompletedGroups([...completedGroups, index]);
      if (index + 1 < nutritionGroups.length) {
        setExpandedGroup(index + 1);
      }
    }
  };

  const toggleGroup = (index) => {
    setExpandedGroup(index);
    setCompletedGroups((prev) => prev.filter((i) => i !== index));
  };

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

          {nutritionGroups.map((group, index) => (
            <div className="accordion-group" key={index}>
              <button className="accordion-toggle" onClick={() => toggleGroup(index)}>
                ✅ {completedGroups.includes(index) ? "[เสร็จแล้ว] " : ""}
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
                                  className="dropdown-select"
                                >
                                  <option value="">-- เลือกตัวเลือก --</option>
                                  {options.map((opt, idx) => (
                                    <option key={idx} value={opt}>
                                      {opt}
                                    </option>
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
                    ยืนยัน
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
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NutritionForm;
