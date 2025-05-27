import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./PatientAssessmentResult.css";
import editIcon from "../assets/edit.png";
import historyIcon from "../assets/history.png";

function PatientAssessmentResult() {
  const location = useLocation();
  const navigate = useNavigate();

  const patient = location.state?.patient || {
    id: "HN001",
    name: "ศุวิชญ์ หนูวงศ์",
    age: 7,
    gender: "ชาย",
    profile: "https://via.placeholder.com/150",
    weight: 25,
    height: 110,
    bloodPressure: "110/70",
    allergies: ["นมวัว", "ถั่วลิสง"],
    chronicDiseases: ["โรคหอบหืด"],
    medicalHistory: ["ได้รับวัคซีนครบถ้วน"],
    bmi: 13.4,
    status: "น้ำหนักต่ำกว่าเกณฑ์",
    mealsPerDay: 2,
    sleepHours: 8,
    bowelMovements: 1,
    reasons: [
      "น้ำหนักและส่วนสูงอยู่ต่ำกว่ามาตรฐาน",
      "อาหารไม่ครบ 5 หมู่",
      "ขาดวิตามินดี",
    ],
    recommendations: [
      "เสริมอาหารที่มีโปรตีน",
      "เพิ่มปริมาณไฟเบอร์ในมื้ออาหาร",
      "พบแพทย์เพื่อปรึกษา",
    ],
  };

  const [doctorNote, setDoctorNote] = useState("");
  const [shapPlotUrl, setShapPlotUrl] = useState(null);
  const [shapSample, setShapSample] = useState(null);

  const handleSaveNote = () => {
    alert(`บันทึกคำแนะนำของแพทย์เรียบร้อย: ${doctorNote}`);
    setDoctorNote("");
  };

  // โหลด SHAP plot จาก backend เมื่อเปิดหน้านี้
  useEffect(() => {
    fetch("http://localhost:5000/shap-beeswarm")
      .then((res) => res.json())
      .then((data) => {
        setShapPlotUrl("http://localhost:5000" + data.plot_url);
        setShapSample(data.sample_data);
      })
      .catch((err) => {
        console.error("❌ ไม่สามารถโหลด SHAP plot ได้", err);
      });
  }, []);

  return (
    <div className="assessment-result-container">
      <h2>ดูผลลัพธ์การประเมินของผู้ป่วย</h2>

      {/* Patient Info Section */}
      <div className="patient-header">
        <img src={patient.profile} alt={patient.name} className="patient-photo" />
        <div className="patient-info">
          <h3>{patient.name}</h3>
          <p>HN: {patient.id}</p>
          <p>อายุ: {patient.age} ปี</p>
          <p>เพศ: {patient.gender}</p>
          <p>น้ำหนัก: {patient.weight} กก.</p>
          <p>ส่วนสูง: {patient.height} ซม.</p>
          <p>ความดันโลหิต: {patient.bloodPressure}</p>
          <p>โรคประจำตัว: {patient.chronicDiseases?.join(", ") || "ไม่มี"}</p>
          <p>ภูมิแพ้: {patient.allergies?.join(", ") || "ไม่มี"}</p>
          <p>ประวัติทางการแพทย์: {patient.medicalHistory?.join(", ")}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="patient-actions">
        <button className="action-button" onClick={() => navigate("/edit-assessment/1")}>
          <img src={editIcon} alt="Edit" className="action-icon" />
          <span>แก้ไขข้อมูลการซักประวัติ</span>
        </button>
        <button className="action-button" onClick={() => navigate("/patient-history")}>
          <img src={historyIcon} alt="History" className="action-icon" />
          <span>ดูประวัติย้อนหลังผู้ป่วย</span>
        </button>
      </div>

      {/* BMI Section */}
      <div className="bmi-section">
        <h3>BMI = {patient.bmi}</h3>
        <p>อยู่ในเกณฑ์: {patient.status}</p>
      </div>

      {/* SHAP Plot */}
      {shapPlotUrl && (
        <div className="shap-section">
          <h3>SHAP วิเคราะห์คุณลักษณะ:</h3>
          <img src={shapPlotUrl} alt="SHAP Beeswarm Plot" className="chart-image" />
          <div className="shap-description">
            <p><strong>ข้อมูลที่สุ่มมาจาก index:</strong> {shapSample?.index}</p>
            <ul>
              {Object.entries(shapSample || {}).map(([key, val]) =>
                key !== "index" ? (
                  <li key={key}>
                    <strong>{key}</strong>: {val}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
      )}

      {/* ตรวจสุขภาพ */}
      <div className="test-results-section">
        <h3>ผลการตรวจ:</h3>
        <table className="results-table">
          <thead>
            <tr>
              <th>Test</th>
              <th>Results</th>
              <th>Reference Interval</th>
              <th>LOW</th>
              <th>NORMAL</th>
              <th>HIGH</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>BMI</td>
              <td>{patient.bmi}</td>
              <td>15.05</td>
              <td><div className="bar low active"></div></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>ปริมาณรับประทานอาหาร</td>
              <td>{patient.mealsPerDay}</td>
              <td>3 ครั้ง / วัน</td>
              <td></td>
              <td><div className="bar normal active"></div></td>
              <td></td>
            </tr>
            <tr>
              <td>การนอนหลับ</td>
              <td>{patient.sleepHours}</td>
              <td>9-11 ชม. / วัน</td>
              <td><div className="bar low active"></div></td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>การขับถ่าย</td>
              <td>{patient.bowelMovements}</td>
              <td>1-2 ครั้ง / วัน</td>
              <td></td>
              <td><div className="bar normal active"></div></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* คำแนะนำทั่วไป */}
      <div className="recommendation-section">
        <h3>คำแนะนำ:</h3>
        <ul>
          {patient.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* บันทึกของแพทย์ */}
      <div className="doctor-note-section">
        <h3>คำแนะนำจากแพทย์:</h3>
        <div className="doctor-note-container">
          <div className="doctor-note-display">
            <h4>คำแนะนำที่บันทึก:</h4>
            <p>{doctorNote || "ยังไม่มีคำแนะนำที่บันทึก"}</p>
          </div>
          <div className="doctor-note-input">
            <textarea
              value={doctorNote}
              onChange={(e) => setDoctorNote(e.target.value)}
              placeholder="กรอกคำแนะนำสำหรับผู้ป่วย"
              className="doctor-note-textarea"
            />
            <button onClick={handleSaveNote} className="save-button">
              บันทึก
            </button>
          </div>
        </div>
      </div>

      {/* กลับหน้าหลัก */}
      <button className="back-button" onClick={() => navigate("/view-results")}>
        ย้อนกลับ
      </button>
    </div>
  );
}

export default PatientAssessmentResult;
