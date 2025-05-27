import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import "./ManageDepartment.css";

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
    <div className="manage-department-container">
      <header>
        <h1 className="main-title-custom">การจัดการข้อมูลหมอ</h1>
      </header>

      <div className="action-header">
        <h2>รายชื่อหมอ</h2>
        <div className="actions">
          <button
            className="add-child-button"
            onClick={() => navigate("/add-doctor")}
          >
            + เพิ่มเด็กใหม่
          </button>
          <button className="filter-button">ล่าสุด</button>
        </div>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="ค้นหารายชื่อ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">ค้นหา</button>
      </div>

      <table className="patient-table">
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
              <td className="action-buttons">
                <button
                  className="icon-button edit"
                  title="แก้ไข"
                  onClick={() => navigate(`/edit-doctor/${d.id}`)}
                >
                  <FaEdit />
                </button>
                <button className="icon-button delete" title="ลบ">
                  <FaTrashAlt />
                </button>
                <button
                  className="icon-button view"
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

      <div className="load-more-container">
        <button className="load-more">เพิ่มเติม</button>
      </div>

      <div className="back-to-dashboard-container">
        <button
          className="back-to-dashboard-button"
          onClick={() => navigate("/admin-dashboard")}
        >
          ย้อนกลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

export default ManageDoctorDepartment;
