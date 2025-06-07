import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import "./ManageDepartment.css";
import Header from "../components/layout/Header"; // ใช้ header เดียวกัน
import Footer from "../components/layout/Footer";

function ManageParentDepartment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const parents = [
    { id: "P001", name: "นาย ชัย รง", phone: "089-123-4567", child: "ด.ช.ไม้", relation: "พ่อ" },
    { id: "P002", name: "นาย แดง ขาว", phone: "090-234-5678", child: "ด.ช.อาย", relation: "พ่อ" },
    { id: "P003", name: "นาย มั่น ม่วง", phone: "091-345-6789", child: "ด.ช.บิน", relation: "พ่อ" },
    { id: "P004", name: "นาย เลย์ บาบีคิว", phone: "092-456-7890", child: "ด.ช.ตี้", relation: "พ่อ" },
    { id: "P005", name: "นาย ชาเขียว มะนาว", phone: "093-567-8901", child: "ด.ช.ทีมพศ", relation: "พ่อ" }
  ];

  const filteredParents = parents.filter(
    (p) =>
      p.id.includes(searchTerm) ||
      p.name.includes(searchTerm) ||
      p.child.includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-department" /> 

      <div className="manage-wrapper">

        <div className="search-header">
          <div className="left">
            <h2>ค้นหาข้อมูลผู้ปกครอง</h2>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหา รหัส, ชื่อ, หรือชื่อเด็ก..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-title">
          <h3>รายชื่อผู้ปกครอง <span>{filteredParents.length} คน</span></h3>
          <button className="add-btn" onClick={() => navigate("/add-parent")}>
            <FaPlus /> เพิ่มผู้ปกครอง
          </button>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>เบอร์โทร</th>
              <th>เด็กในความดูแล</th>
              <th>ความสัมพันธ์</th>
              <th>การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredParents.map((p) => (
              <tr key={p.id}>
                <td title={p.name}>{p.name}</td>
                <td>{p.phone}</td>
                <td>{p.child}</td>
                <td>{p.relation}</td>
                <td className="actions">
                  <button
                    className="icon edit"
                    title="แก้ไข"
                    onClick={() => navigate(`/edit-parent/${p.id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon delete"
                    title="ลบ"
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="icon view"
                    title="ดูข้อมูล"
                    onClick={() => navigate(`/view-parent/${p.id}`)}
                  >
                    <FaSearch />
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

export default ManageParentDepartment;
