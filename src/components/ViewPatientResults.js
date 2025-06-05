import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ViewPatientResults.css";

function ViewPatientResults() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // ดึงข้อมูลจาก backend พร้อม order
  useEffect(() => {
    axios
      .get(`http://localhost:5000/predictions?order=${sortOrder}`)
      .then((res) => setPatients(res.data))
      .catch((err) => console.error("โหลดข้อมูลไม่สำเร็จ", err));
  }, [sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusCount = {
    Normal: 0,
    Obesity: 0,
    Overweight: 0,
    SAM: 0,
    Stunting: 0,
    Underweight: 0,
  };

  patients.forEach((p) => {
    if (statusCount[p.status] !== undefined) {
      statusCount[p.status]++;
    }
  });

  const handleViewDetails = (patient) => {
    navigate(`/Recomendation/${patient.id}`, { state: { patient } });
  };

  return (
    <div className="view-results-container">
      <h2>ดูผลลัพธ์การประเมินของผู้ป่วย</h2>
      <p className="subtitle">ระบบติดตามและประเมินสุขภาพผู้ป่วยแบบครบวงจร</p>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card total"><span>All Patients</span><strong>{patients.length}</strong></div>
        <div className="card normal"><span>Normal</span><strong>{statusCount["Normal"]}</strong></div>
        <div className="card fat"><span>Obesity</span><strong>{statusCount["Obesity"]}</strong></div>
        <div className="card over"><span>Overweight</span><strong>{statusCount["Overweight"]}</strong></div>
        <div className="card sam"><span>SAM</span><strong>{statusCount["SAM"]}</strong></div>
        <div className="card stunt"><span>Stunting</span><strong>{statusCount["Stunting"]}</strong></div>
        <div className="card under"><span>Underweight</span><strong>{statusCount["Underweight"]}</strong></div>
      </div>

      {/* Filters */}
      <div className="filter-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="ค้นหาและกรองข้อมูล"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label htmlFor="sort">เรียงลำดับ:</label>
          <select
            id="sort"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">จากล่าสุด</option>
            <option value="asc">จากก่อนหน้า</option>
          </select>
        </div>
      </div>

      {/* Table */}
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
            {paginatedPatients.map((p) => {
              const date = new Date(p.date);
              return (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{date.toLocaleDateString("th-TH")}</td>
                  <td>{date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{p.status}</td>
                  <td>
                    <button className="view-button" onClick={() => handleViewDetails(p)}>กดเพื่อดู</button>
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
