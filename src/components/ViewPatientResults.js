import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ViewPatientResults.css";
import dek1 from "../assets/dek1.jpg";
import dek2 from "../assets/dek2.jpg";
import dek3 from "../assets/dek3.jpg";

function ViewPatientResults() {
  const navigate = useNavigate();
  const currentDate = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const patients = [
    {
      id: 1,
      name: "ศุวิชญ์ หนูวงศ์",
      date: "2024-11-30T14:30:00",
      profile: dek1,
      bmi: 10.03,
      status: "ผอม เสี่ยงมากกว่าปกติ",
    },
    {
      id: 2,
      name: "พฤฒิภณ ปริศิริประภา",
      date: "2024-11-29T10:15:00",
      profile: dek2,
      bmi: 12.5,
      status: "น้ำหนักปกติ",
    },
    {
      id: 3,
      name: "ศุวิชญ์ หนูวงศ์",
      date: "2024-11-25T09:00:00",
      profile: dek3,
      bmi: 8.9,
      status: "ผอมมาก",
    },
  ];

  const sortedPatients = [...patients].sort((a, b) =>
    sortOrder === "desc"
      ? new Date(b.date) - new Date(a.date)
      : new Date(a.date) - new Date(b.date)
  );

  const filteredPatients = sortedPatients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleViewDetails = (patient) => {
    navigate(`/patient-assessment/${patient.id}`, { state: { patient } });
  };

  const statusCount = {
    "น้ำหนักปกติ": 0,
    "อ้วน": 0,
    "น้ำหนักมากเกินไป": 0,
    "ภาวะทุพโภชนาการเฉียบพลันรุนแรง": 0,
    "แคระแกร็น": 0,
    "น้ำหนักน้อยเกินไป": 0,
  };

  patients.forEach((p) => {
    if (statusCount.hasOwnProperty(p.status)) {
      statusCount[p.status]++;
    }
  });

  return (
    <div className="view-results-container">
      <h2>ดูผลลัพธ์การประเมินของผู้ป่วย</h2>
      <p className="subtitle">ระบบติดตามและประเมินสุขภาพผู้ป่วยแบบครบวงจร</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total">
          <span>ผู้ป่วยทั้งหมด</span>
          <strong>{patients.length}</strong>
        </div>
        <div className="card normal">
          <span>ปกติ</span>
          <strong>{statusCount["น้ำหนักปกติ"]}</strong>
        </div>
        <div className="card fat">
          <span>อ้วน</span>
          <strong>{statusCount["อ้วน"]}</strong>
        </div>
        <div className="card over">
          <span>น้ำหนักมากเกินไป</span>
          <strong>{statusCount["น้ำหนักมากเกินไป"]}</strong>
        </div>
        <div className="card sam">
          <span>ภาวะทุพโภชนาการเฉียบพลันรุนแรง</span>
          <strong>{statusCount["ภาวะทุพโภชนาการเฉียบพลันรุนแรง"]}</strong>
        </div>
        <div className="card stunt">
          <span>แคระแกร็น</span>
          <strong>{statusCount["แคระแกร็น"]}</strong>
        </div>
        <div className="card under">
          <span>น้ำหนักน้อยเกินไป</span>
          <strong>{statusCount["น้ำหนักน้อยเกินไป"]}</strong>
        </div>
      </div>

      <form className="filter-container">
        <div className="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" height="20" viewBox="0 0 24 24" width="20">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M21 21l-4.35-4.35M4 11a7 7 0 1114 0 7 7 0 01-14 0z" />
          </svg>
          <input
            type="text"
            placeholder="ค้นหาและกรองข้อมูล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label>
            วันที่:
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              max={currentDate}
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
            {paginatedPatients.map((patient) => {
              const dateTime = new Date(patient.date);
              return (
                <tr key={patient.id}>
                  <td>{patient.name}</td>
                  <td>{dateTime.toLocaleDateString("th-TH")}</td>
                  <td>{dateTime.toLocaleTimeString("th-TH", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}</td>
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

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={currentPage === i + 1 ? "active" : ""}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewPatientResults;
