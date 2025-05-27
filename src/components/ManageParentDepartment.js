import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSearch } from "react-icons/fa";
import "./ManageDepartment.css";

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
    <div className="manage-department-container">
      <header>
        <h1 className="main-title-custom">การจัดการข้อมูลผู้ปกครอง</h1>
      </header>

      <div className="action-header">
        <h2>รายชื่อผู้ปกครอง</h2>
        <div className="actions">
          <button className="add-child-button" onClick={() => navigate("/add-parent")}>
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
              <td className="action-buttons">
                <button
                  className="icon-button edit"
                  title="แก้ไข"
                  onClick={() => navigate(`/edit-parent/${p.id}`)}
                >
                  <FaEdit />
                </button>
                <button className="icon-button delete" title="ลบ">
                  <FaTrashAlt />
                </button>
                <button
                  className="icon-button view"
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

export default ManageParentDepartment;
