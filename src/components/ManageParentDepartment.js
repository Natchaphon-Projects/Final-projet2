import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import "./ManageDepartment.css";
import Header from "../components/layout/Header"; // ใช้ header เดียวกัน
import Footer from "../components/layout/Footer";

function ManageParentDepartment() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [parents, setParents] = useState([]);

  // โหลดข้อมูลผู้ปกครองจริง
  useEffect(() => {
    fetch("http://localhost:5000/parents-with-children")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ Parents loaded:", data);
        setParents(data);
      })
      .catch((err) => console.error("❌ โหลดข้อมูลผู้ปกครองผิดพลาด", err));
  }, []);

  const filteredParents = parents.filter(
    (p) =>
      p.parent_id.toString().includes(searchTerm) ||
      p.parent_name.includes(searchTerm) ||
      (p.children && p.children.includes(searchTerm))
  );

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-parents" />

      <div className="manage-wrapper">

        <div className="search-header">
          <div className="left">
            <h2>ค้นหาข้อมูลผู้ปกครอง</h2>
            <div className="search-box">
              <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="ค้นหารายชื่อ"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">ค้นหา</button>
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
              <tr key={p.parent_id}>
                <td title={p.parent_name}>{p.parent_name}</td>
                <td>{p.phone_number || "-"}</td>
                <td className="wrap-children">
                  {p.children
                    ? p.children.split(", ").map((child, index) => (
                        <div key={index}>{child}</div>
                      ))
                    : "-"}
                  </td>
                <td>{p.relationships || "-"}</td>
                <td className="actions">
                  <button
                    className="icon edit"
                    title="แก้ไข"
                    onClick={() => navigate(`/edit-parent/${p.parent_id}`)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="icon delete"
                    title="ลบ"
                    onClick={() => alert("ลบยังไม่ทำจ้า")}
                  >
                    <FaTrashAlt />
                  </button>
                  <button
                    className="icon view"
                    title="ดูข้อมูล"
                    onClick={() => navigate(`/view-parent/${p.parent_id}`)}
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
    </div>
     <Footer />
     </div>
  );
};

export default ManageParentDepartment;