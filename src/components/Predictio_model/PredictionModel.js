import React, { useState } from "react";
import "./PredictionModel.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import smileIcon from "../../assets/happiness.png";
import sadIcon from "../../assets/sad.png";
import axios from "axios";

function PredictionModel() {
  const [latestPrediction, setLatestPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const featureKeys = [
    "Guardian", "Vitamin_A_Intake_First_8_Weeks", "Sanitary_Disposal",
    "Mom_wash_hand_before_or_after_cleaning_children", "Mom_wash_hand_before_or_after_feeding_the_child",
    "Child_before_or_after_eating_food", "Child_wash_hand_before_or_after_eating_food",
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
      data[key] = Math.floor(Math.random() * 3); // 0,1,2
    });
    return data;
  };

  const handlePredict = async () => {
    setLoading(true);
    const inputData = getRandomData();
    console.log("📦 กำลังส่งข้อมูลไปยัง API:", inputData);

    try {
      const response = await axios.post("http://localhost:8000/prediction", inputData);
      console.log("✅ ผลลัพธ์จาก API:", response.data);

      const result = response.data.prediction;
      const now = new Date();
      const formattedDate = now.toLocaleDateString("th-TH");
      const formattedTime = now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });

      setLatestPrediction({
        status: result === "Normal" ? "สุขภาพดีปกติ 😊" : `ผลลัพธ์: ${result}`,
        date: formattedDate,
        time: formattedTime,
        isNormal: result === "Normal",
      });
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาด:", error);
      alert("เกิดข้อผิดพลาดในการทำนายผล");
    }

    setLoading(false);
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="page-content">
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
                <p className="status-message">{latestPrediction.status}</p>
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
            onClick={handlePredict}
            disabled={loading}
          >
            {loading ? "กำลังทำนาย..." : "สุ่มข้อมูลและทำนาย"}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default PredictionModel;
