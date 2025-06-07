import React, { useState, useEffect } from "react";
import "./NutritionForm.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios"; // ✅ เพิ่มเพื่อเชื่อมต่อ backend
import { useRef } from "react";


const nutritionGroups = [
  {
    groupTitle: "การบริโภคนมของเด็ก",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Still_Breastfeeding", label: "ขณะนี้เด็กยังคงได้รับนมแม่อยู่", type: "checkbox" },
      { key: "Received_Animal_Milk", label: "ได้รับนมที่ไม่ใช่นมแม่ เช่น นมวัว หรือนมแพะ ", type: "checkbox" },
      { key: "Received_Yogurt", label: "ได้รับโยเกิร์ตหรืออาหารที่มีส่วนผสมของโยเกิร์ต", type: "checkbox" },
      { key: "Received_Dairy_Products", label: "ได้รับผลิตภัณฑ์จากนมหรือไม่", type: "checkbox" },
    ],
  },
  {
    groupTitle: "มีการบริโภคเครื่องดื่มประเภทเหล่านี้หรือไม่",
    groupNote: "หากมีการบริโภคให้ติ๊กถูกในช่องสี่เหลี่ยม ☐",
    questions: [
      { key: "Given_Anything_to_Drink_in_First_6_Months", label: "ได้ดื่มอะไรก็ตามในช่วง 6 เดือนแรก", type: "checkbox" },
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
      { key: "Received_Thin_Porridge", label: "ได้รับโจ๊กหรือข้าวต้มที่เหลวหรือใส เช่น โจ๊กข้าวหรือโจ๊กธัญพืช", type: "checkbox" },
      { key: "Received_Grain_Based_Foods", label: "อาหารที่ทำจากธัญพืช เช่น ขนมปัง ข้าว เส้นก๋วยเตี๋ยว", type: "checkbox" },
      { key: "Received_Orange_Yellow_Foods", label: "อาหารผักเนื้อสีส้ม/เหลืองเข้ม เช่น ฟักทอง แครอท", type: "checkbox" },
      { key: "Received_White_Root_Foods", label: "อาหารประเภทหัวที่มีแป้งและเนื้อสีขาว เช่น มันเทศขาว มันเผือก", type: "checkbox" },
      { key: "Received_Dark_Green_Leafy_Veggies", label: "ได้รับผักใบเขียวเข้ม เช่น ผักโขม คะน้า", type: "checkbox" },
      { key: "Received_Ripe_Mangoes_Papayas", label: "ได้รับอาหารมะละกอหรือมะม่วงสุก", type: "checkbox" },
      { key: "Received_Other_Fruits_Vegetables", label: "ได้รับผลไม้/ผักอื่นๆนอกเหนือจากที่กล่าว", type: "checkbox" },
      { key: "Received_Meat", label: "ได้รับเนื้อสัตว์ประเภทต่างๆ", type: "checkbox" },
      { key: "Received_Eggs", label: "ได้รับอาหารที่มีส่วนผสมของไข่", type: "checkbox" },
      { key: "Received_Fish_Shellfish_Seafood", label: "ได้รับอาหารทะเล เช่น ปลา กุ้ง หอย", type: "checkbox" },
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
    groupTitle: "จำนวนครั้ง",
    groupNote: "✏️ โปรดกรอกจำนวนครั้งเป็นตัวเลข",
    questions: [
      { key: "Infant_Formula_Intake_Count_Yesterday", label: "จำนวนครั้งการบริโภคนมผง", type: "number" },
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
      }
    ],
  },
];

function NutritionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const groupRefs = useRef([]);

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
  const [patientId, setPatientId] = useState(null); // ✅ เพิ่ม
  const [childData, setChildData] = useState(null); // ✅ เพิ่ม
  const [showConfirmPopup, setShowConfirmPopup] = useState(false);
const [pendingSubmitGroup, setPendingSubmitGroup] = useState(null);


const [finalGroupCompleted, setFinalGroupCompleted] = useState(false);

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("nutritionFormData");
    return saved ? JSON.parse(saved) : {};
  });
  useEffect(() => {
    localStorage.setItem("nutritionFormData", JSON.stringify(formData));
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

  const isAllCountFieldsEmpty = () => {
  return (
    (formData.Infant_Formula_Intake_Count_Yesterday === "" || formData.Infant_Formula_Intake_Count_Yesterday === undefined) &&
    (formData.Breastfeeding_Count_DayandNight === "" || formData.Breastfeeding_Count_DayandNight === undefined) &&
    (formData.Received_Animal_Milk_Count === "" || formData.Received_Animal_Milk_Count === undefined) &&
    (formData.Received_Yogurt_Count === "" || formData.Received_Yogurt_Count === undefined)
  );
};

  const handleGroupComplete = (index) => {
    const group = nutritionGroups[index];

    const requiredKeys = group.questions.map(q => q.key);

    const optionalKeys = [
  "Infant_Formula_Intake_Count_Yesterday",
  "Breastfeeding_Count_DayandNight",
  "Received_Animal_Milk_Count",
  "Received_Yogurt_Count",
];

    const isComplete = requiredKeys.every(key => {
  if (optionalKeys.includes(key)) return true;

  const value = formData[key];
  const question = group.questions.find(q => q.key === key);

  if (question.type === "number") {
    return value !== "" && value !== undefined && parseFloat(value) >= 0;
  } else if (question.type === "dropdown") {
    return value && value !== "";
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

  // ✅ Scroll ไปยังกลุ่มถัดไป
  setTimeout(() => {
    groupRefs.current[index + 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 300);
} else {
  setExpandedGroup(-1);
}


      localStorage.setItem("nutritionCompletedGroups", JSON.stringify(newCompleted));

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

  // กำหนด default เป็น 0 ถ้าเว้นว่าง
const dataToSend = {
  patient_id: patientId,
  ...formData,
  Infant_Formula_Intake_Count_Yesterday: formData.Infant_Formula_Intake_Count_Yesterday || 0,
  Breastfeeding_Count_DayandNight: formData.Breastfeeding_Count_DayandNight || 0,
  Received_Animal_Milk_Count: formData.Received_Animal_Milk_Count || 0,
  Received_Yogurt_Count: formData.Received_Yogurt_Count || 0,
  created_at: new Date().toISOString(),
};


    
    axios.post("http://localhost:5000/predictions", dataToSend)
      .then(() => {
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว");
      })
      .catch((err) => {
        console.error("❌ บันทึกข้อมูลล้มเหลว", err);
      });
  };
 useEffect(() => {
  const savedCompleted = localStorage.getItem("nutritionCompletedGroups");
  const parsedCompleted = savedCompleted ? JSON.parse(savedCompleted) : [];
  setCompletedGroups(parsedCompleted);

  // ✅ หากมีกลุ่มที่ยังไม่กรอก ให้เปิดกลุ่มแรกที่ยังไม่ได้กรอก
  const firstIncompleteIndex = nutritionGroups.findIndex((_, index) => !parsedCompleted.includes(index));
  setExpandedGroup(firstIncompleteIndex !== -1 ? firstIncompleteIndex : -1); // ถ้าทุกกลุ่มกรอกหมดแล้ว ไม่ต้องเปิดอะไร
}, []);



  useEffect(() => {
    const totalGroups = nutritionGroups.length;
    const completedCount = completedGroups.length;
    const percent = Math.round((completedCount / totalGroups) * 100);
    setCompletion(percent);

    // อัปเดตลง localStorage ด้วย (เหมือน GroupedDataInput)
    localStorage.setItem("nutritionProgress", percent.toString());
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

{showConfirmPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h3>📋 ตรวจสอบข้อมูลก่อนบันทึก</h3>
      <ul className="popup-list">
        {nutritionGroups.flatMap(group => group.questions).map(({ key, label, type }) => {
          const value = formData[key];
          const getDisplayText = (key, value) => value
            ? "✅ บริโภค"
            : "❌ ไม่ได้บริโภค";
          return (
            <li key={key} className="popup-row">
              <span className="popup-label">{label}</span>
              <span className={`popup-value ${type === "checkbox" ? (value ? "success" : "error") : ""}`}>
                {type === "checkbox" ? getDisplayText(key, value) : value || "-"}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="popup-actions">
        <button className="cancel" onClick={() => setShowConfirmPopup(false)}>❌ ยกเลิก</button>
        <button className="confirm" onClick={() => {
  setShowConfirmPopup(false);
  handleGroupComplete(pendingSubmitGroup);
  handleSubmit();
  navigate(nextPage); // ✅ เพิ่มเพื่อไปหน้าถัดไปอัตโนมัติ
}}>

          ✅ ยืนยันบันทึก ➜
        </button>
      </div>
    </div>
  </div>
)}


      <div className="nutrition-form-container">
        <div className="nutrition-card">
          {childData && (
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
              <h3>แบบฟอร์มของ: {childData.prefix_name_child} {childData.first_name_child} {childData.last_name_child}</h3>
              <p>HN: {childData.hn}</p>
            </div>
          )}

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
            <div className="accordion-group" key={index} ref={(el) => (groupRefs.current[index] = el)} >
              
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
                                  min="0"
                                  value={formData[key] || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === "" || Number(value) >= 0) {
                                      handleChange(key, value);
                                    }
                                  }}
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
  required
  value={formData[key] || ""}
  onChange={(e) => handleChange(key, e.target.value)}
  className="number-input"
>
  <option value="" disabled>-- เลือกตัวเลือก --</option>
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

             {index === nutritionGroups.length - 1 ? (
  <>
  <button
 className={`complete-btn ${
  completedGroups.length < nutritionGroups.length - 1 || !formData.Number_of_Times_Eaten_Solid_Food
    ? "disabled-btn"
    : ""
}`}

  onClick={() => {
    if (!formData.Number_of_Times_Eaten_Solid_Food) return;

    handleGroupComplete(index);
    setFinalGroupCompleted(true);
    setPendingSubmitGroup(index);
    setShowConfirmPopup(true);
  }}
>
  บันทึก
</button>

{(completedGroups.length < nutritionGroups.length - 1 || !formData.Number_of_Times_Eaten_Solid_Food) && (
  <span className="warning-inline">

    ⚠️ กรุณาทำแบบสอบถามให้ครบทุกกลุ่ม และกรอก “จำนวนมื้ออาหารแข็ง” ก่อนกดบันทึก
  </span>
)}



  </>
) : (
  <button className="complete-btn" onClick={() => handleGroupComplete(index)}>
    ถัดไป ➜
  </button>
)}





                </div>
              )}
            </div>
          ))}

           {completedGroups.length === nutritionGroups.length && totalProgress === 100 && (

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
      <Footer />
    </div>
  );
}

export default NutritionForm;
