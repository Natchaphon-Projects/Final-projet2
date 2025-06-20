import React, { useState } from "react";
import "./PredictionModel.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import smileIcon from "../../assets/happiness.png";
import sadIcon from "../../assets/sad.png";
import axios from "axios";
import { FaUserAlt } from "react-icons/fa"; // ใช้ไอคอน
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { FaHeartbeat } from "react-icons/fa";
import { useEffect } from "react"; // อย่าลืมเพิ่มถ้ายังไม่มี
import { useNavigate } from "react-router-dom";
import labelMappings from "../../model/label_mappings_True.json";

const normalizeValue = (value) => {
  if (typeof value === "boolean") {
    return value ? "True" : "False"; // 🟢 ให้ตรงกับ JSON ที่ใช้ "True" / "False"
  }

  const str = String(value).trim().toLowerCase();

  // รองรับหลากหลาย input และคืนค่าให้ตรงกับ label_mappings
  if (["true", "yes", "1", "01", "on", "ใช่"].includes(str)) return "True";
  if (["false", "no", "0", "00", "off", "ไม่ใช่"].includes(str)) return "False";

  return value; // ถ้าไม่เข้าเงื่อนไข ให้คืนค่าดั้งเดิม
};


const preprocessWithLabelMappings = (data) => {
  const transformed = {};

  Object.entries(data).forEach(([key, value]) => {
    // ถ้ามี mapping สำหรับ key นี้
    if (labelMappings[key]) {
      const mapping = labelMappings[key].mapping;

      // แปลง string เป็น lower case ก่อน map
      const normalized = normalizeValue(value);
      const mappedValue = mapping[normalized];

      transformed[key] = mappedValue !== undefined ? mappedValue : 0; // fallback = 0
    } else if (!isNaN(value) && value !== "") {
      transformed[key] = Number(value);
    } else if (typeof value === "boolean") {
      transformed[key] = value ? 1 : 0;
    } else {
      transformed[key] = value;
    }
  });

  return transformed;
};

const reversePreprocessData = (data) => {
  const reversed = {};

  Object.entries(data).forEach(([key, value]) => {
    if (labelMappings[key]) {
      const mapping = labelMappings[key].mapping;

      // ย้อนกลับ mapping เป็น True/False แบบ string
      const reverseMap = Object.entries(mapping).reduce((acc, [text, num]) => {
        if (text.toLowerCase() === "true") acc[num] = "True";
        else if (text.toLowerCase() === "false") acc[num] = "False";
        else acc[num] = text;
        return acc;
      }, {});

      reversed[key] = reverseMap[Number(value)] ?? String(value);
    } else {
      reversed[key] = value;
    }
  });

  return reversed;
};


function PredictionModel() {
  const [latestPrediction, setLatestPrediction] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const data = localStorage.getItem("latestPredictionData");
    if (data) {
      const parsed = JSON.parse(data); // ✅ สร้างตัวแปร parsed ให้ถูกต้องก่อน
      handlePredict(parsed); // ✅ เรียกแค่ครั้งเดียว
    }
  }, []);


  const featureKeys = [
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

  const getRandomData = () => {
    const data = {};
    featureKeys.forEach((key) => {
      data[key] = Math.floor(Math.random() * 3);
    });
    return data;
  };

  const handlePredict = async (customData = null) => {
    setLoading(true);
    const inputData = customData || getRandomData();
    const extraMedicalData = {
      Weight: inputData.Weight || null,
      Height: inputData.Height || null,
      Food_allergy: inputData.Food_allergies || "", // ✅ เปลี่ยนจาก Food_allergies เป็น Food_allergy
      Drug_allergy: inputData.Drug_allergy || "",
      congenital_disease: inputData.congenital_disease || ""
    };



    const transformedData = preprocessWithLabelMappings(inputData);
    // ✅ ลบ field ที่ไม่ควรส่งเข้า prediction
    delete transformedData.Weight;
    delete transformedData.Height;
    delete transformedData.Food_allergy;
    delete transformedData.Drug_allergy;
    delete transformedData.congenital_disease;

    console.log("🔍 ข้อมูลที่ก่อน transformedData:", inputData);
    const filteredData = {};
    featureKeys.forEach((key) => {
      if (key in transformedData) {
        filteredData[key] = transformedData[key];
      }
    });
    
     // ✅ พิมพ์ข้อมูลที่จะส่งให้ backend
    console.log("🔍 ข้อมูลที่ส่งไป predict:", filteredData);

    try {
      const response = await axios.post(
        "http://localhost:8000/prediction",
        JSON.stringify(filteredData),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );



      const result = response.data.prediction; // เช่น "Obesity", "SAM", ฯลฯ
      const now = new Date();
      const formattedDate = now.toLocaleDateString("th-TH");
      const formattedTime = now.toLocaleTimeString("th-TH", {
        hour: "2-digit", minute: "2-digit"
      });

      // ✅ เก็บผลลัพธ์เข้า SQL ด้วย
      const patientId = localStorage.getItem("childId");
      await axios.post("http://localhost:5000/predictions/combined", {
        patient_id: patientId,
        ...reversePreprocessData(filteredData),
        ...extraMedicalData,
        Status_personal: result
      });


      // ✅ แสดงผลบนหน้าเว็บ
      setLatestPrediction({
        status: result === "Normal" ? "ปกติ" : "กรุณาพบแพทย์",
        date: formattedDate,
        time: formattedTime,
        isNormal: result === "Normal",
      });
    } catch (error) {
      console.error("❌ ข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการทำนายผล");
    }

    setLoading(false);
  };



  return (
    <div className="dashboard-container">
      <Header currentPage="form-nutrition" />

      <div className="page-content">
        <div className="dashboard-grid">
          {/* ซ้าย */}
          <div className="side-wrapper">
            <div className="side-card system-card">
              <h3 className="card-title text-green">
                <FaHeartbeat className="icon-left" />
                ข้อมูลระบบ
              </h3>


              <div className="info-row">
                <span className="label">ระบบ AI:</span>
                <span className="value green-text-bold">
                  <span className="dot green" /> พร้อมใช้งาน
                </span>
              </div>


              <div className="info-row">
                <span className="label">ความแม่นยำ:</span>
                <span className="value green-text-bold">90.65%</span>
              </div>


              <div className="info-row">
                <span className="label">เวอร์ชัน:</span>
                <span className="value highlight">1.0.1</span>
              </div>
            </div>


            {/* ✅ คำแนะนำสำคัญ ย้ายมาฝั่งซ้าย */}
            <div className="side-card recommend-card">
              <h3 className="recommend-title">
                <span className="recommend-icon">📈</span> {/* หรือใช้ <FaArrowUp /> */}
                คำแนะนำสำคัญ
              </h3>
              <ul className="recommend-list">
                <li>ตรวจสอบสุขภาพเด็กอย่างสม่ำเสมอ</li>
                <li>ให้อาหารครบ 5 หมู่</li>
                <li>ปฏิบัติตามคำแนะนำของแพทย์</li>
              </ul>
            </div>

          </div>

          {/* กลาง */}
          <div className="prediction-container">
            <h2 className="prediction-title">ผลการประเมิน</h2>

            {latestPrediction && (
              <>
                <div className="status-box">
                  <img
                    src={latestPrediction.isNormal ? smileIcon : sadIcon}
                    alt="Status Icon"
                    className="status-icon"
                  />
                  <p className={`status-message ${latestPrediction.isNormal ? "text-green" : "text-red"}`}>
                    {latestPrediction.status}
                  </p>
                </div>

                <div className="result-box">
                  <p className="section-title">ประเมินครั้งล่าสุด</p>
                  <div className="result-row">
                    <span className="label">วันที่</span>
                    <span className="value">{latestPrediction.date}</span>
                  </div>
                  <div className="result-row">
                    <span className="label">เวลา</span>
                    <span className="value">{latestPrediction.time}</span>
                  </div>
                </div>
              </>
            )}

            <button
              className="predict-btn"
              onClick={() => navigate("/parent-dashboard")}
            >
              🔙 กลับไปหน้าหลัก
            </button>

          </div>

          {/* ขวา */}
          <div className="side-wrapper">
            {/* ✅ สถิติการใช้งานยังอยู่ขวา */}
            <div className="side-card">
              <div className="usage-title">
                <FaUserAlt className="usage-icon" />
                สถิติการใช้งาน
              </div>
              <div className="usage-card">
                <p className="usage-count">1,247</p>
                <p className="usage-label">ครั้งการประเมินทั้งหมด</p>
              </div>
            </div>

            {/* ✅ ติดต่อสอบถาม ย้ายมาขวา */}
            <div className="side-card contact-card">
              <div className="card-title text-pink">
                <FaPhoneAlt className="icon-red" />
                ติดต่อสอบถาม
              </div>

              <div className="contact-box">
                <FaPhoneAlt className="icon-red" />
                <div className="contact-info">
                  <strong>โทรศัพท์:</strong>
                  <p>02-xxx-xxxx</p>
                </div>
              </div>

              <div className="contact-box">
                <FaEnvelope className="icon-pink" />
                <div className="contact-info">
                  <strong>อีเมล:</strong>
                  <p>info@healthsystem.th</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PredictionModel;
