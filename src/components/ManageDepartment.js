import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa"; // เปลี่ยนจาก FaSearch เป็น FaEye
import "./ManageDepartment.css";

function ManageDepartment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    { id: "65111", name: "ด.ช. ไม้ ตะพง", age: "3 ขวบ", gender: "ชาย", parent: "นาย ชัย รง" },
    { id: "65112", name: "ด.ช. อาย ผิวขาว", age: "2 ขวบ", gender: "ชาย", parent: "นาย แดง ขาว" },
    { id: "65113", name: "ด.ช. บิน ซุปเปอร์ฮีโร่", age: "3 ขวบ", gender: "ชาย", parent: "นาย บิน บิ๋ง" },
    { id: "65114", name: "ด.ช. ตี้ เดอะแฟช", age: "3 ขวบ", gender: "ชาย", parent: "นาย เลย์ บักคิว" },
    { id: "65115", name: "ด.ช. ทีมพศา โครตคน", age: "2 ขวบ", gender: "ชาย", parent: "นาย ชาเขียว มะนาว" }
  ];

  const filteredPatients = patients.filter(
    (p) =>
      p.id.includes(searchTerm) ||
      p.name.includes(searchTerm) ||
      p.parent.includes(searchTerm)
  );

  return (
    <div className="manage-department-container">
      <header>
        <h1 className="main-title-custom">การจัดการข้อมูลเด็ก</h1>
      </header>
      
      <div className="action-header">
        <h2>รายชื่อเด็ก</h2>
        <div className="actions">
          <button className="add-child-button" onClick={() => navigate("/add-patient")}>
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
            <th>HN</th>
            <th>ชื่อ</th>
            <th>อายุ</th>
            <th>เพศ</th>
            <th>ผู้ปกครอง</th>
            <th>การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {filteredPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td title={p.name}>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td title={p.parent}>{p.parent}</td>
              <td className="action-buttons">
                <button
                  className="icon-button edit"
                  title="แก้ไข"
                  onClick={() => navigate(`/edit-patient/${p.id}`)}
                >
                  <FaEdit />
                </button>
                <button className="icon-button delete" title="ลบ">
                  <FaTrashAlt />
                </button>
                <button
                  className="icon-button view"
                  title="ดูข้อมูล"
                  onClick={() => navigate(`/view-patient/${p.id}`)}
                >
                  <FaEye /> {/* 👁️ ใช้แทน FaSearch */}
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
        <button className="back-to-dashboard-button" onClick={() => navigate("/admin-dashboard")}>
          ย้อนกลับหน้าหลัก
        </button>
      </div>
    </div>
  );
}

export default ManageDepartment;
