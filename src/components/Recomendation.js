import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import React, { useState } from 'react';
import './Recomendation.css';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WeightChart from '../components/chart/WeightChart';
import HeightChart from '../components/chart/HeightChart';
import Sunglasscat from '../assets/cat-sunglass.jpg';
import { useLocation } from "react-router-dom";

const valueMap = {
  // ✅ dropdown
  Number_of_Times_Eaten_Solid_Food: {
    label: "จำนวนมื้ออาหารแข็ง",
    values: {
      0: "ไม่ได้บริโภค",
      1: "1-2 มื้อ",
      2: "3-4 มื้อ",
      3: "4 มื้อขึ้นไป"
    }
  },

  // ✅ checkbox
  Guardian: {
    label: "บุคคลที่ดูแลเด็กเป็นมารดาผู้ให้กำเนิดหรือไม่",
    values: { 0: "ไม่ใช่มารดาผู้ให้กำเนิด", 1: "เป็นมารดาผู้ให้กำเนิด" }
  },
  Is_Respondent_Biological_Mother: {
    label: "ผู้ตอบแบบสอบถามเป็นมารดาผู้ให้กำเนิดหรือไม่",
    values: { 0: "ไม่ใช่มารดาผู้ให้กำเนิด", 1: "เป็นมารดาผู้ให้กำเนิด" }
  },
  Last_Month_Weight_Check: {
    label: "น้ำหนักได้รับการตรวจในเดือนที่ผ่านมา",
    values: { 0: "ไม่ได้ตรวจ", 1: "ตรวจแล้ว" }
  },
  Weighed_Twice_Check_in_Last_3_Months: {
    label: "ตรวจน้ำหนักอย่างน้อย 2 ครั้งใน 3 เดือน",
    values: { 0: "ไม่ครบ 2 ครั้ง", 1: "ครบ 2 ครั้ง" }
  },

  // ✅ checkbox บริโภค
  Still_Breastfeeding: { label: "ได้รับนมแม่", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Yogurt: { label: "ได้รับโยเกิร์ต", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Thin_Porridge: { label: "ได้รับโจ๊กหรือข้าวต้มเหลว", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Grain_Based_Foods: { label: "ได้รับอาหารธัญพืช", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Orange_Yellow_Foods: { label: "ได้รับผัก/ฟักทองสีส้มเหลือง", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_White_Root_Foods: { label: "ได้รับมันเทศ/หัวเผือก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Dark_Green_Leafy_Veggies: { label: "ได้รับผักใบเขียวเข้ม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Ripe_Mangoes_Papayas: { label: "ได้รับมะม่วง/มะละกอสุก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Fruits_Vegetables: { label: "ได้รับผลไม้/ผักอื่นๆ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Meat: { label: "ได้รับเนื้อสัตว์", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Eggs: { label: "ได้รับไข่", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Fish_Shellfish_Seafood: { label: "ได้รับอาหารทะเล", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Legumes_Nuts_Foods: { label: "ได้รับถั่ว", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Oil_Fats_Butter: { label: "ได้รับน้ำมัน/เนย", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Sugary_Foods: { label: "ได้รับของหวาน", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Chilies_Spices_Herbs: { label: "ได้รับเครื่องเทศ/สมุนไพร", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Grubs_Snails_Insects: { label: "ได้รับแมลง/หอยทาก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Solid_Semi_Solid_Food: { label: "ได้รับอาหารอื่นๆ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Salt: { label: "ได้รับเกลือ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Animal_Milk: { label: "ได้รับนมวัว/แพะ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Dairy_Products: { label: "ได้รับผลิตภัณฑ์นม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Given_Anything_to_Drink_in_First_6_Months: { label: "ดื่มของเหลวใน 6 เดือนแรก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Plain_Water: { label: "ได้รับน้ำเปล่า", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Juice_or_Juice_Drinks: { label: "ได้รับน้ำผลไม้", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Tea: { label: "ได้รับชา/คาเฟอีน", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Liquids: { label: "ได้รับน้ำอื่นๆ เช่น น้ำอัดลม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Vitamin_or_Mineral_Supplements: { label: "ได้รับวิตามิน/แร่ธาตุ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Vitamin_A_Intake_First_8_Weeks: { label: "ได้รับวิตามินเอใน 8 สัปดาห์แรก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },

  // ✅ สุขอนามัย
  Sanitary_Disposal: { label: "ถ่ายอุจจาระถูกสุขลักษณะ", values: { 0: "ไม่ถูกสุขลักษณะ", 1: "ถูกสุขลักษณะ" } },
  Child_wash_hand_before_or_after_eating_food: { label: "เด็กล้างมือก่อน/หลังทานข้าว", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Child_wash_hand_before_or_after_visiting_the_toilet: { label: "เด็กล้างมือก่อน/หลังเข้าห้องน้ำ", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Mom_wash_hand_before_or_after_cleaning_children: { label: "แม่ล้างมือก่อน/หลังทำความสะอาดเด็ก", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Mom_wash_hand_before_or_after_feeding_the_child: { label: "แม่ล้างมือก่อน/หลังให้อาหารเด็ก", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },

  // ✅ number
  Infant_Formula_Intake_Count_Yesterday: { label: "จำนวนครั้งการบริโภคนมผง" },
  Breastfeeding_Count_DayandNight: { label: "จำนวนครั้งให้นมทั้งวันและคืน" },
  Received_Animal_Milk_Count: { label: "จำนวนครั้งดื่มนมสัตว์" },
  Received_Yogurt_Count: { label: "จำนวนครั้งบริโภคโยเกิร์ต" }
};


function Recomendation() {
  const [topFeatures, setTopFeatures] = useState([]);
  const [globalAverages, setGlobalAverages] = useState({});
  const location = useLocation();
  const patient = location.state?.patient;
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [showFullTable, setShowFullTable] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8000/shap/local/${id}`)
        .then(res => {
          console.log("SHAP Local:", res.data);
          if (Array.isArray(res.data.top_features)) {
            const sorted = res.data.top_features.sort((a, b) => b.shap - a.shap);
            setTopFeatures(sorted);
          } else {
            setTopFeatures([]);
          }
        })
        .catch(() => {
          console.log("⚠️ ดึง SHAP local ไม่สำเร็จ");
          setTopFeatures([]);
        });
    }

    if (record?.status) {
      axios.get(`http://localhost:8000/shap/global/${record.status}`)
        .then(res => setGlobalAverages(res.data))
        .catch(() => console.log("⚠️ ดึง SHAP global ไม่สำเร็จ"));
    }
  }, [id, record?.status]);


  const [selectedOption, setSelectedOption] = useState("ประวัติการตรวจครั้งอื่น");



  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/patients/${id}/records`)
        .then((res) => {
          console.log("📦 ข้อมูลล่าสุดที่ได้:", res.data); // ตรวจสอบข้อมูลจริง
          setRecord(res.data); // ✅ ไม่ต้อง .data[0] แล้ว เพราะ backend ส่ง object มาแล้ว
        })
        .catch((err) => console.error("โหลดประวัติไม่สำเร็จ", err));
    }
  }, [id]);


  if (!patient) {
    return (
      <div style={{ padding: 20 }}>
        <h2>ไม่พบข้อมูลผู้ป่วย</h2>
        <p>กรุณากลับไปหน้าเดิมแล้วเลือกผู้ป่วยอีกครั้ง</p>
      </div>
    );
  }

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };


const displayedFeatures = showFullTable ? topFeatures : topFeatures.slice(0, 5);


  return (
    <div className="dashboard-container">
      <Header />
      <div className="recommendation-page">

        {/* Page Title */}
        <div className="recommendation-title">
          ดูผลลัพธ์การประเมินของผู้ป่วย
        </div>

        {/* Patient Info + Graph */}
        <div className="recommendation-patient-wrapper">

          {/* ซ้าย: Patient Section */}
          <div className="recommendation-patient-section">


            {/* ซ้าย: รูป + ชื่อ + ปุ่ม */}
            <div className="patient-profile">
              <div className="patient-health-badge">ข้อมูลสุขภาพ</div>
              <div className="patient-date">
                วันที่ {new Date().toLocaleDateString('th-TH')}


              </div>
              <img
                src={Sunglasscat}
                alt="Patient Avatar"
                className="patient-icon-image"
              />

              <div className="patient-name-large">{patient.name || "ไม่ทราบชื่อ"}</div>



            </div>

            {/* ขวา: Grid 2 columns */}
            <div className="patient-main-info">

              <div className="patient-info-grid-two">
                <div className="info-card">
                  <div className="label">HN:</div>
                  <div className="value">{record?.hn_number || "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">เพศ:</div>
                  <div className="value">{patient.gender || "--"}</div>
                </div>
                <div className="info-card">
                  <div className="label">อายุ:</div>
                  <div className="value">{patient.age || "--"}</div>
                </div>
                <div className="info-card">
                  <div className="label">น้ำหนัก:</div>
                  <div className="value">{record?.weight ? `${record.weight} กก.` : "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">ส่วนสูง:</div>
                  <div className="value">{record?.height ? `${record.height} ซม.` : "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">โรคประจำตัว:</div>
                  <div className="value">{record?.congenital_disease || "--"}</div>
                </div>

              </div>

            </div>

          </div>


          {/* ขวา: Graph */}
          <div className="patient-graph-section">
            <WeightChart />
          </div>
          <div className="patient-graph-section">
            <HeightChart />
          </div>
        </div>

        {/* Action Buttons */}
        {/* ✅ Dropdown ด้านซ้าย */}

        <div className="recommendation-action-buttons">
          <div className="dropdown-wrapper">
            <select className="recommendation-dropdown">
              <option value="">ประวัติการตรวจครั้งอื่น</option>
              <option value="history">ประวัติ</option>
              <option value="checkup">การตรวจสุขภาพ</option>
              <option value="edit">แก้ไขข้อมูล</option>
            </select>
          </div>

          <div className="action-buttons-wrapper">
            <button className="recommendation-action-btn">ดูประวัติเพิ่มเติม</button>
            <button className="recommendation-action-btn">ดูประวัติการตรวจย้อนหลัง</button>
            <button className="recommendation-action-btn">แก้ไขข้อมูลการซักประวัติ</button>
          </div>
        </div>

        {/* Assessment Status */}
        {record?.status && (
          <div className="recommendation-status">
            <div className="status-text">
              อยู่ในเกณฑ์ : {record.status}
            </div>

            <div className="status-subtext">Assessment Status</div>
          </div>
        )}

        {/* ผลการตรวจ Section */}
        <div className="recommendation-result-section">

          <div className="result-header-row">
            <div className="result-title">ผลการตรวจ :</div>

            <div className="info-card">
              <div className="label">แพ้อาหาร:</div>
              <div className="value">{record?.Food_allergy || "--"}</div>
            </div>

            <div className="info-card">
              <div className="label">แพ้ยา:</div>
              <div className="value">{record?.drug_allergy || "--"}</div>
            </div>



          </div>

          {/* Wrapper → 2 ตาราง */}
          <div className="result-table-wrapper">

            {/* ตารางซ้าย (3/4) */}
            <div className="result-table-block left">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>ข้อมูล</th>
                    <th>พฤติกรรมของผู้ป่วย</th>
                    <th>ค่ามาตรฐาน</th>
                    <th>คำแนะนำ</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFeatures.map((item, index) => {
                    const featureLabel = valueMap[item.feature]?.label || item.feature;
                    const patientValue = valueMap[item.feature]?.values?.[item.value] ?? item.value;
                    const standardValue = globalAverages[item.feature] !== undefined ? globalAverages[item.feature] : "--";

                    return (
                      <tr key={index}>
                        <td>{featureLabel}</td>
                        <td>
                          <span className="badge">{patientValue}</span>
                        </td>
                        <td>
                          <span className="badge-green">
  {valueMap[item.feature]?.values?.[standardValue] ?? standardValue}
</span>

                        </td>
                      </tr>
                    );
                  })}



                  {showFullTable && null}

                </tbody>
              </table>

              {/* ปุ่ม toggle */}
              <div style={{ margin: '16px 0', textAlign: 'center' }}>
                <button
                  className="recommendation-action-btn"
                  onClick={() => setShowFullTable(!showFullTable)}
                >
                  {showFullTable ? 'ซ่อนเพิ่มเติม' : 'แสดงเพิ่มเติม'}
                </button>
              </div>
            </div>

            {/* ตารางขวา (1/4) */}
            <div className="result-table-block right">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>สาเหตุที่สนับสนุนให้เกิด</th>
                  </tr>
                </thead>
                {Array.isArray(topFeatures) ? (
                  (showFullTable ? topFeatures : topFeatures.slice(0, 5)).map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.feature}</strong><br />
                        ค่าผู้ป่วย: {item.value}<br />
                        ค่ามาตรฐาน: {globalAverages[item.feature] || "--"}<br />
                        shap: {item.shap.toFixed(3)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td>ไม่พบข้อมูล SHAP</td>
                  </tr>
                )}

              </table>
              <div className="recommendation-feedback-section">
                <div className="feedback-title">ข้อเสนอแนะ / บันทึกเพิ่มเติม</div>
                <textarea
                  className="feedback-textarea"
                  placeholder="พิมพ์ข้อเสนอแนะหรือบันทึกเพิ่มเติมที่นี่..."
                  rows="5"
                ></textarea>
                <button className="feedback-submit-btn">บันทึกข้อเสนอแนะ</button>
              </div>

            </div>

          </div> {/* end .result-table-wrapper */}

        </div> {/* end .recommendation-result-section */}

      </div> {/* end .recommendation-page */}
      <Footer />
    </div>
  );
}

export default Recomendation;
