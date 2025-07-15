import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./GroupedDataInput.css";
import clockwiseIcon from "../assets/clockwise.png";
import doneIcon from "../assets/done.png";
import foodIcon from "../assets/healthy-food.png";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import axios from "axios";


function Groupdatainput() {

  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false); // 🔒 ป้องกันคลิกซ้ำ

  const [groupProgress, setGroupProgress] = useState({
    general: 0,
    caregiver: 0,
    nutrition: 0,
    sanitation: 0,
  });

  const [totalProgress, setTotalProgress] = useState(0);
  const [childData, setChildData] = useState(null);


  // ดึงข้อมูลเด็กจาก childId
  useEffect(() => {
    const patientId = localStorage.getItem("childId");
    if (patientId) {
      axios.get(`/api/patients/${patientId}`)
        .then((res) => setChildData(res.data))
        .catch((err) => console.error("❌ โหลดข้อมูลเด็กล้มเหลว", err));
    }
  }, []);

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


  const handleFinalSubmit = async () => {
    if (isSubmitting) return; // ❌ ป้องกันคลิกซ้ำ
    setIsSubmitting(true);    // ✅ ล็อกการคลิกซ้ำ

    const general = JSON.parse(localStorage.getItem("generalFormData") || "{}");
    const caregiver = JSON.parse(localStorage.getItem("caregiverFormData") || "{}");
    const nutrition = JSON.parse(localStorage.getItem("nutritionFormData") || "{}");
    const sanitation = JSON.parse(localStorage.getItem("sanitationFormData") || "{}");

    const patientId = localStorage.getItem("childId");
    if (!patientId) {
      console.warn("❌ ไม่พบรหัสผู้ป่วย กรุณาเลือกเด็กใหม่ก่อน");
      setIsSubmitting(false);
      return;
    }

    try {
      const allData = {
        patient_id: patientId,
        ...general,
        ...caregiver,
        ...nutrition,
        ...sanitation,
      };

      // ✅ เติมค่าที่ขาด = 0
      requiredKeys.forEach((key) => {
        if (!(key in allData)) {
          allData[key] = 0;
        }
      });

      // ✅ เก็บไว้ให้ PredictionModel ใช้
      localStorage.setItem("latestPredictionData", JSON.stringify(allData));

      // ✅ เปลี่ยนหน้า
      navigate("/prediction-result");
    } catch (err) {
      console.error("❌ เกิดข้อผิดพลาด", err);
    } finally {
      setIsSubmitting(false); // ✅ ปลดล็อก
    }
  };



  // ✅ โหลด progress แบบเรียลไทม์
  useEffect(() => {
    const interval = setInterval(() => {
      const general = parseInt(localStorage.getItem("generalProgress") || "0");
      const caregiver = parseInt(localStorage.getItem("caregiverProgress") || "0");
      const nutrition = parseInt(localStorage.getItem("nutritionProgress") || "0");
      const sanitation = parseInt(localStorage.getItem("sanitationProgress") || "0");

      setGroupProgress({ general, caregiver, nutrition, sanitation });
    }, 1000); // อัปเดตทุก 1 วินาที

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const avg =
      (groupProgress.general +
        groupProgress.caregiver +
        groupProgress.nutrition +
        groupProgress.sanitation) / 4;
    setTotalProgress(avg);
  }, [groupProgress]);

  const groups = [
    {
      label: "ข้อมูลทั่วไป",
      description: "ข้อมูลพื้นฐานและข้อมูลทั่วไป",
      path: "/form/general",
      color: "#22c55e",
      buttonGradient: "gradient-general",
      progress: groupProgress.general,
    },
    {
      label: "ผู้เลี้ยงดูหลัก",
      description: "ข้อมูลผู้ดูแลและครอบครัว",
      path: "/form/caregiver",
      color: "#f59e0b",
      buttonGradient: "gradient-caregiver",
      progress: groupProgress.caregiver,
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
      <Header currentPage="form-nutrition" />

      <main className="dashboard-main center-content">

        {childData && (
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <h2>แบบประเมินสำหรับ:</h2>
            <h3 style={{ color: "#0ea5e9" }}>
              {childData.prefix_name_child} {childData.first_name_child} {childData.last_name_child}
            </h3>
            <p>HN: {childData.hn_number}</p>
          </div>
        )}



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