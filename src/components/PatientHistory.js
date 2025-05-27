import React from "react";
import "./PatientHistory.css";
import clockIcon from "../assets/clock.png"; // นำเข้าไอคอน clock.png

const patients = [
  {
    id: 1,
    name: "เด็กชาย ศุวิชญ์ หนูวงศ์",
    latestVisit: "30/11/2567",
    history: ["รับการรักษาเมื่อ 30/11/2567", "รับการรักษาเมื่อ 15/11/2567"],
  },
];

function PatientHistory() {
  const selectedPatient = patients[0]; // Display the first patient by default

  return (
    <div className="history-container">
      <div className="left-column">
        <header className="header">
          <h1>ประวัติย้อนหลัง</h1>
          <p>View Patient History</p>
        </header>

        {/* รายละเอียดผู้ป่วย */}
        <div className="patient-details">
          <h2>ประวัติของ: {selectedPatient.name}</h2>
          <p>การเข้ารักษาล่าสุด: {selectedPatient.latestVisit}</p>
        </div>

        {/* ปุ่มหน้าแรกและย้อนกลับ */}
        <div className="card-footer">
          <button
            onClick={() => (window.location.href = "http://localhost:3000/doctor-dashboard")}
            className="back-button"
          >
            หน้าแรก
          </button>
          <button
            onClick={() => window.history.back()}
            className="back-button"
          >
            ย้อนกลับ
          </button>
        </div>
      </div>

      {/* ประวัติการรักษา */}
      <div className="right-column">
        <div className="patient-history-details">
          <h2>ประวัติการรักษา:</h2>
          <ul>
            {selectedPatient.history.map((entry, index) => (
              <li key={index} className="history-item">
                <img src={clockIcon} alt="Clock Icon" className="history-icon" />
                <span className="history-text">{entry}</span>
                <button
                  className="view-detail-button"
                  onClick={() => alert(`รายละเอียด: ${entry}`)}
                >
                  ดูรายละเอียด
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PatientHistory;
