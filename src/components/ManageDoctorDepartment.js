import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye, FaSearch, FaPlus } from "react-icons/fa";
import "./ManageDepartment.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function ManageDoctorDepartment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    {
      id: "D001",
      name: "พญ. นภัส สุวรรณ",
      specialty: "กุมารเวชศาสตร์",
      dutyTime: "2025-05-20T10:00:00",
      phone: "089-123-4567",
    },
    {
      id: "D002",
      name: "นพ. วิทยา ธรรมโชติ",
      specialty: "โภชนาการเด็ก",
      dutyTime: "2025-05-20T13:30:00",
      phone: "090-234-5678",
    },
    {
      id: "D003",
      name: "พญ. อารียา พงษ์ภักดี",
      specialty: "พัฒนาการเด็ก",
      dutyTime: "2025-05-21T09:00:00",
      phone: "091-345-6789",
    },
    {
      id: "D004",
      name: "นพ. กิตติศักดิ์ บุญรอ",
      specialty: "โรคติดเชื้อในเด็ก",
      dutyTime: "2025-05-22T14:00:00",
      phone: "092-456-7890",
    },
    {
      id: "D005",
      name: "พญ. ศิริพร เรืองจิต",
      specialty: "สาธารณสุขชุมชนเด็ก",
      dutyTime: "2025-05-23T08:30:00",
      phone: "093-567-8901",
    },
  ];

  const filteredDoctors = doctors.filter(
    (d) =>
      d.id.includes(searchTerm) ||
      d.name.includes(searchTerm) ||
      d.specialty.includes(searchTerm)
  );

  function formatThaiDate(datetimeStr) {
    const date = new Date(datetimeStr);
    const days = ["อาทิตย์", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];
    const day = days[date.getDay()];
    const dateNum = date.getDate();
    const monthNames = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `วัน ${day} ที่: ${dateNum} ${month} ${year}`;
  }

  function formatThaiTime(datetimeStr) {
    const date = new Date(datetimeStr);
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `เวลา: ${hour}:${minute} น.`;
  }

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-department" /> 

      <div className="manage-wrapper">

        <div className="search-header">
          <div className="left">
            <h2>ค้นหาข้อมูลหมอ</h2>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหา รหัส, ชื่อ, หรือความเชี่ยวชาญ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-title">
          <h3>รายชื่อหมอ <span>{filteredDoctors.length} คน</span></h3>
          <button className="add-btn" onClick={() => navigate("/add-doctor")}>
            <FaPlus /> เพิ่มหมอใหม่
          </button>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>ความเชี่ยวชาญ</th>
              <th>เวรถัดไป</th>
              <th>เบอร์โทร</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((d) => (
              <tr key={d.id}>
                <td title={d.name}>{d.name}</td>
                <td>{d.specialty}</td>
                <td>
                  <div>{formatThaiDate(d.dutyTime)}</div>
                  <div>{formatThaiTime(d.dutyTime)}</div>
                </td>
                <td>{d.phone}</td>
                <td className="actions">
                  <button
                    className="icon edit"
                    title="แก้ไข"
                    onClick={() => navigate(`/edit-doctor/${d.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button className="icon delete" title="ลบ">
                    <FaTrashAlt />
                  </button>
                  <button
                    className="icon view"
                    title="ดูข้อมูล"
                    onClick={() => navigate(`/view-doctor/${d.id}`)}
                  >
                    <FaEye />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="pagination-container">
          <button disabled>ย้อนกลับ</button>
          <button className="active">1</button>
          <button disabled>ถัดไป</button>
        </div>


      </div>
    </div>
  );
}

export default ManageDoctorDepartment;
