import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewPatientResults.css";
import dek1 from "../assets/dek1.jpg";
import dek2 from "../assets/dek2.jpg";
import dek3 from "../assets/dek3.jpg";

function ViewPatientResults() {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().slice(0, 10); // Get the current date in YYYY-MM-DD format
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" for latest first, "asc" for oldest first

  const patients = [
    {
      id: 1,
      name: "ศุวิชญ์ หนูวงศ์",
      date: "2024-11-30T14:30:00", // Include time
      profile: dek1,
      bmi: 10.03,
      status: "ผอม เสี่ยงมากกว่าปกติ",
      reasons: [
        "น้ำหนักและส่วนสูงอยู่ต่ำกว่ามาตรฐาน",
        "อาหารรับประทานไม่สมดุล",
        "การขาดโปรตีน",
      ],
      recommendations: ["เพิ่มโปรตีน", "เน้นการรับประทานไฟเบอร์"],
    },
    {
      id: 2,
      name: "พฤฒิภณ ปริศิริประภา",
      date: "2024-11-29T10:15:00", // Include time
      profile: dek2,
      bmi: 12.5,
      status: "น้ำหนักปกติ",
      reasons: ["สมดุลดี"],
      recommendations: ["รักษาสมดุลอาหาร", "ออกกำลังกายสม่ำเสมอ"],
    },
    {
      id: 3,
      name: "ศุวิชญ์ หนูวงศ์",
      date: "2024-11-25T09:00:00", // Include time
      profile: dek3,
      bmi: 8.9,
      status: "ผอมมาก",
      reasons: ["น้ำหนักต่ำกว่าเกณฑ์", "ขาดวิตามิน"],
      recommendations: ["ปรึกษาแพทย์", "เพิ่มอาหารที่มีพลังงานสูง"],
    },
  ];

  // Sort patients based on sortOrder
  const sortedPatients = [...patients].sort((a, b) => {
    if (sortOrder === "desc") {
      return new Date(b.date) - new Date(a.date);
    } else {
      return new Date(a.date) - new Date(b.date);
    }
  });

  const handleViewDetails = (patient) => {
    navigate(`/patient-assessment/${patient.id}`, { state: { patient } });
  };

  return (
    <div className="view-results-container">
      <h2>ดูผลลัพธ์การประเมินของผู้ป่วย</h2>
      <form className="filter-container">
        <div className="filter-item">
          <label>
            วันที่:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={currentDate} // Prevent selecting future dates
            />
          </label>
        </div>
        <div className="filter-item">
          <label>
            เข้าผลการรักษา:
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="desc">จากล่าสุด</option>
              <option value="asc">จากก่อนหน้า</option>
            </select>
          </label>
        </div>
      </form>

      <div className="patient-table">
        <table>
          <thead>
            <tr>
              <th>ชื่อผู้ป่วย</th>
              <th>วันที่</th>
              <th>เวลา</th>
              <th>สถานะ</th>
              <th>รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {sortedPatients.map((patient) => {
              const dateTime = new Date(patient.date);
              return (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{dateTime.toLocaleDateString("th-TH")}</td>
                  <td>{dateTime.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{patient.status}</td>
                  <td>
                    <button
                      className="view-button"
                      onClick={() => handleViewDetails(patient)}
                    >
                      กดเพื่อดู
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewPatientResults;
