import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RiskAssessment.css";
import sadFace from "../assets/sad.png";
import happyFace from "../assets/happiness.png";

const featureLabels = {
  Guardian: "เป็นบุคคลที่รับผิดชอบในการดูแล เด็กหรือไม่",
  Vitamin_A_Intake_First_8_Weeks: "เด็กได้รับวิตามินเอภายใน 8 สัปดาห์แรกหลังคลอดใช่หรือไม่",
  Sanitary_Disposal: "ระบุว่ามีการกำจัดอุจจาระของเด็กด้วยวิธีที่ถูกสุขลักษณะหรือไม่",
  Mom_wash_hand_before_or_after_cleaning_children: "แม่ล้างมือก่อนหรือหลังจากทำความสะอาดเด็กหรือไม่",
  Mom_wash_hand_before_or_after_feeding_the_child: "แม่ล้างมือก่อนหรือหลังจากป้อนอาหารเด็กหรือไม่",
  Child_before_or_after_eating_food: "เด็กล้างมือก่อนหรือหลังรับประทานอาหารหรือไม่",
  Child_wash_hand_before_or_after_eating_food: "เด็กล้างมือก่อนหรือหลังจากเข้าห้องน้ำหรือไม่",
  Last_Month_Weight_Check: "น้ำหนักของเด็กได้รับการตรวจในช่วงเดือนที่ผ่านมาใช่หรือไม่",
  Weighed_Twice_Check_in_Last_3_Months : "เด็กได้รับการชั่งน้ำหนักอย่างน้อยสองครั้งในช่วงสามเดือนที่ผ่านมาใช่หรือไม่",
  Given_Anything_to_Drink_in_First_6_Months: "เด็กได้รับอาหารหรือของเหลวใด ๆ นอกเหนือจากนมแม่ในช่วงหกเดือนแรกหลังคลอดหรือไม่",
  Still_Breastfeeding: "ขณะนี้เด็กยังคงได้รับนมแม่อยู่หรือไม่",
  Is_Respondent_Biological_Mother: "ผู้ตอบแบบสอบถามเป็นมารดาผู้ให้กำเนิดของเด็กหรือไม่",
  Breastfeeding_Count_DayandNight: "จำนวนครั้งที่เด็กได้รับการให้นมแม่ทั้งในตอนกลางวันและกลางคืนในช่วง 24 ชั่วโมงที่ผ่านมา",
  Received_Vitamin_or_Mineral_Supplements: "เด็กได้รับอาหารเสริมหรือวิตามินแร่ธาตุใด ๆ หรือไม่",
  Received_Plain_Water: "เด็กได้รับน้ำเปล่า (ที่ไม่ปรุงแต่ง ไม่หวาน) ดื่มหรือไม่",
  Infant_Formula_Intake_Count_Yesterday: "เด็กได้รับนมผงสำหรับทารกหรือไม่",
  Received_Animal_Milk: "เด็กได้รับนมจากสัตว์ เช่น นมวัวหรือนมแพะหรือไม่",
  Received_Animal_Milk_Count: "จำนวนครั้งที่เด็กดื่มนมจากสัตว์",
  Received_Juice_or_Juice_Drinks: "เด็กได้รับน้ำผลไม้หรือน้ำผลไม้ปรุงรสหวานดื่มหรือไม่",
  Received_Yogurt: "เด็กได้รับโยเกิร์ตสำหรับรับประทานหรือดื่มหรือไม่",
  Received_Yogurt_Count: "จำนวนครั้งที่เด็กบริโภคโยเกิร์ตเมื่อวานนี้ ทั้งในช่วงกลางวันหรือกลางคืน",
  Received_Thin_Porridge: "เด็กได้รับโจ๊กหรือข้าวต้มที่เหลวหรือใส (เช่น โจ๊กข้าวหรือโจ๊กธัญพืช) สำหรับรับประทานหรือดื่มหรือไม่",
  Received_Tea: "เด็กได้รับชาสำหรับดื่มหรือไม่ รวมถึงชาแบบชงหรือชาสำเร็จรูปทุกประเภท",
  Received_Other_Liquids: "เด็กได้รับของเหลวประเภทอื่นใดที่ยังไม่ได้กล่าวถึงหรือไม่ (เช่น เครื่องดื่มสมุนไพร เครื่องดื่มปรุงแต่งรส ฯลฯ)",
  Received_Grain_Based_Foods: "เด็กได้รับอาหารที่ทำจากธัญพืช เช่น ขนมปัง ข้าว เส้นก๋วยเตี๋ยว หรือโจ๊กข้นหรือไม่",
  Received_Orange_Yellow_Foods: "เด็กได้รับผักที่มีสีส้มหรือเหลืองเข้มซึ่งมีส่วนผสมของเบต้าแคโรทีน เช่น ฟักทอง แครอท สควอช หรือมันเทศเนื้อสีส้มหรือเหลืองหรือไม่",
  Received_White_Root_Foods: "เด็กได้รับอาหารประเภทหัวที่มีแป้งและเนื้อสีขาว เช่น มันเทศขาว มันเผือก มันสำปะหลัง หรืออาหารประเภทเดียวกันหรือไม่",
  Received_Dark_Green_Leafy_Veggies: "เด็กได้รับผักใบเขียวเข้ม เช่น ผักโขม คะน้า หรือผักใบเขียวประเภทอื่น ๆ หรือไม่",
  Received_Ripe_Mangoes_Papayas: "เด็กได้รับมะม่วงสุกหรือมะละกอสุกรับประทานหรือไม่",
  Received_Other_Fruits_Vegetables: "เด็กได้รับผลไม้หรือผักชนิดอื่น ๆ ที่ยังไม่ได้กล่าวถึงก่อนหน้านี้หรือไม่",
  Received_Meat: "เด็กได้รับเนื้อสัตว์ เช่น เนื้อวัว เนื้อหมู เนื้อแกะ เนื้อแพะ เนื้อไก่ หรือเนื้อเป็ด รับประทานหรือไม่",
  Received_Eggs: "เด็กได้รับไข่รับประทานหรือไม่",
  Received_Fish_Shellfish_Seafood: "เด็กได้รับปลาสด ปลาแห้ง หอย หรืออาหารทะเลประเภทอื่น ๆ รับประทานหรือไม่",
  Received_Legumes_Nuts_Foods: "เด็กได้รับอาหารที่ทำจากถั่วต่าง ๆ เช่น ถั่วเหลือง ถั่วลันเตา หรือถั่วเปลือกแข็งหรือไม่",
  Received_Dairy_Products: "เด็กได้รับผลิตภัณฑ์จากนม เช่น ชีส โยเกิร์ต หรือผลิตภัณฑ์นมอื่น ๆ เพื่อรับประทานหรือไม่",
  Received_Oil_Fats_Butter: "เด็กได้รับน้ำมัน ไขมัน เนย หรืออาหารที่ปรุงด้วยส่วนผสมเหล่านี้หรือไม่",
  Received_Sugary_Foods: "เด็กได้รับอาหารหวาน เช่น ช็อกโกแลต ลูกกวาด ขนมหวาน เบเกอรี่ เค้ก หรือของหวานประเภทอื่น ๆ หรือไม่",
  Received_Chilies_Spices_Herbs: "เด็กได้รับเครื่องปรุงรส เช่น พริก เครื่องเทศ สมุนไพร หรือผงปลา เพื่อเพิ่มรสชาติให้อาหารหรือไม่",
  Received_Grubs_Snails_Insects: "เด็กได้รับหนอน หอย แมลงหรือไม่",
  Received_Other_Solid_Semi_Solid_Food: "เด็กได้รับอาหารชนิดอื่นที่เป็นของแข็งหรือกึ่งของแข็งซึ่งยังไม่ได้กล่าวถึงหรือไม่ เช่น ขนมพื้นบ้าน เต้าหู้บด กล้วยบด หรือข้าวบดผสมวัตถุดิบต่าง ๆ",
  Received_Salt: "เด็กได้รับอาหารที่มีการเติมเกลือหรือไม่",
  Number_of_Times_Eaten_Solid_Food: "จำนวนครั้งที่เด็กกินอาหารที่ไม่ใช่ของเหลวหรือนมแม่ เช่น อาหารบด อาหารนุ่ม หรืออาหารที่ต้องเคี้ยว ในช่วง 24 ชั่วโมงที่ผ่านมา",
};

const radioFields = Object.keys(featureLabels).filter(
  (key) => !key.includes("_Count") && key !== "Number_of_Times_Eaten_Solid_Food"
);

const mealOptions = [
  { value: "1-2 meals", label: "1-2 มื้อ" },
  { value: "3-4 meals", label: "3-4 มื้อ" },
  { value: "more than 4 meals", label: "มากกว่า 4 มื้อ" },
  { value: "dont eat", label: "ไม่ได้กิน" },
];

function RiskAssessment() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("normal");
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.keys(featureLabels).map((key) => [key, ""]))
  );
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    console.log("🟢 ปุ่มถูกกดแล้ว");
    try {
      const formattedData = {};
      for (const [key, value] of Object.entries(formData)) {
        if (value === "True") {
          formattedData[key] = 1;
        } else if (value === "False") {
          formattedData[key] = 0;
        } else if (key === "Number_of_Times_Eaten_Solid_Food") {
          const mealMap = {
            "1-2 meals": 1,
            "3-4 meals": 2,
            "more than 4 meals": 3,
            "dont eat": 0,
          };
          formattedData[key] = mealMap[value] || 0;
        } else {
          formattedData[key] = value === "" ? 0 : Number(value);
        }
      }

      console.log("📦 formattedData ที่จะส่ง:", formattedData);

      const response = await fetch("http://127.0.0.1:5000/prediction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      console.log("✅ คำตอบจาก API:", data);

      const prediction = data.prediction || "error";
      setResult(prediction);
      setHistory((prev) => [...prev, { date: new Date().toLocaleString(), prediction }]);
    } catch (error) {
      console.error("❌ เกิดข้อผิดพลาดในการเรียก API:", error);
      setResult("error");
    }
  };

  const toggleMode = () => {
    setMode(mode === "normal" ? "doctor" : "normal");
  };

  const inputFields = Object.keys(featureLabels).filter(
    (key) => key.includes("_Count") || key === "Breastfeeding_Count_DayandNight"
  );

  return (
    <div className="assessment-container">
      <div className="card-container">
        <div className="card">
          <h2>ประเมินความเสี่ยงเบื้องต้น</h2>
          <button onClick={toggleMode} className="mode-toggle">
            โหมดปัจจุบัน: {mode === "normal" ? "ปกติ" : "ฟังผลจากแพทย์"}
          </button>
          <form>
            {Object.entries(featureLabels).map(([key, label]) =>
              radioFields.includes(key) ? (
                <label key={key}>
                  {label}
                  <div className="radio-group">
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="True"
                        checked={formData[key] === "True"}
                        onChange={handleChange}
                      />{" "}
                      ใช่
                    </label>
                    <label>
                      <input
                        type="radio"
                        name={key}
                        value="False"
                        checked={formData[key] === "False"}
                        onChange={handleChange}
                      />{" "}
                      ไม่ใช่
                    </label>
                  </div>
                </label>
              ) : null
            )}

            <label key="Number_of_Times_Eaten_Solid_Food">
              {featureLabels["Number_of_Times_Eaten_Solid_Food"]}
              <div className="radio-group">
                {mealOptions.map((opt) => (
                  <label key={opt.value}>
                    <input
                      type="radio"
                      name="Number_of_Times_Eaten_Solid_Food"
                      value={opt.value}
                      checked={formData["Number_of_Times_Eaten_Solid_Food"] === opt.value}
                      onChange={handleChange}
                    />{" "}
                    {opt.label}
                  </label>
                ))}
              </div>
            </label>

            {inputFields.map((key) => (
              <label key={key}>
                {featureLabels[key]}
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder="กรอกตัวเลข"
                />
              </label>
            ))}

            <div className="result-card">
              <h2>ผลการประเมิน</h2>
              {result ? (
                <div className="result">
                  {mode === "doctor" && result !== "Normal" ? (
                    <p>ระบบประมวลผลเรียบร้อย กรุณาฟังผลที่แพทย์ประจำตัวของท่าน</p>
                  ) : result === "Normal" ? (
                    <div className="result normal">
                      <p>ปกติ</p>
                      <img src={happyFace} alt="Normal" className="result-icon" />
                    </div>
                  ) : (
                    <div className="result warning">
                    <p>{result}</p>
                        <img src={sadFace} alt={result} className="result-icon" />
                          <p style={{ color: "#da0000", marginTop: "8px", fontWeight: "bold" }}>
                             กรุณาพบแพทย์
                         </p>
                  </div>

                  )}
                </div>
              ) : (
                <div className="result placeholder">
                  <p>กรุณากรอกข้อมูลและกดปุ่มประเมิน</p>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                console.log("🟢 กดปุ่มประเมิน");
                handleSubmit();
              }}
            >
              บันทึกและประเมิน
            </button>
            <button
              type="button"
              className="back-button"
              onClick={() => navigate("/parent-dashboard")}
            >
              ย้อนกลับ
            </button>
          </form>
        </div>

        <div className="card history-card">
          <h2>ประวัติการประเมิน</h2>
          {history.length === 0 ? (
            <p className="placeholder">ยังไม่มีประวัติการประเมิน</p>
          ) : (
            <ul>
              {history.map((entry, index) => (
                <li key={index}>
                  {entry.date} - ผล: {entry.prediction}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default RiskAssessment;
