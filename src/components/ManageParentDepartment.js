import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import "./ManageDepartment.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/parents-with-children";

const ManageParentDepartment = () => {
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingParent, setEditingParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
  prefix: "",
  name: "",
  lastName: "",
  phone: "",
  houseNo: "",
  moo: "",
  alley: "",
  street: "",
  subDistrict: "",
  district: "",
  province: "",
  postalCode: ""
});

  const itemsPerPage = 5;

  useEffect(() => {
    loadParents();
  }, []);

  const loadParents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/parents-with-children");
      setParents(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลผู้ปกครองผิดพลาด", err);
    }
  };

  const handleSave = async () => {
    if (!formData.prefix || !formData.name || !formData.lastName || !formData.phone) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      if (editingParent) {
        await axios.put(`${API_URL}/${editingParent.id}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      alert("บันทึกข้อมูลผู้ปกครองสำเร็จ");
      setShowModal(false);
      setEditingParent(null);
      resetForm();
      loadParents();
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const resetForm = () => {
  setFormData({
    prefix: "",
    name: "",
    lastName: "",
    phone: "",
    houseNo: "",
    moo: "",
    alley: "",
    street: "",
    subDistrict: "",
    district: "",
    province: "",
    postalCode: ""
  });
};

  const handleAdd = () => {
    setEditingParent(null);
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (parent) => {
    setEditingParent(parent);
    setFormData({
      prefix: parent.prefix || "",
      name: parent.name || "",
      lastName: parent.lastName || "",
      phone: parent.phone || "",
      address: parent.address || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("❌ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ปกครองนี้?")) {
      await axios.delete(`${API_URL}/${id}`);
      alert("ลบข้อมูลสำเร็จ");
      loadParents();
    }
  };

  const filteredParents = parents.filter((p) =>
    p.parent_name?.includes(searchTerm) || p.phone_number?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredParents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentParents = filteredParents.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-parent-department" />

      <div className="manage-wrapper">
        <div className="search-header">
          <div className="left">
            <h2>ค้นหาผู้ปกครอง</h2>
            <div className="search-box">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, นามสกุล, หรือเบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-title">
          <h3>รายชื่อผู้ปกครอง <span>ทั้งหมด {filteredParents.length} คน</span></h3>
          <button className="add-btn" onClick={handleAdd}>
            <Plus /> เพิ่มผู้ปกครองใหม่
          </button>
        </div>

        <table className="modern-table">
          <thead>
            <tr>
              <th>ชื่อผู้ปกครอง</th>
              <th>เบอร์โทร</th>
              <th>เด็กในความดูแล</th>
              <th>ที่อยู่</th>
              <th>การจัดการ</th>
            </tr>
          </thead>  
          <tbody>
            {currentParents.map((p) => {
              // แปลง children และ relationships จาก string เป็น array
              const childrenArray = p.children ? p.children.split(", ").filter(Boolean) : [];
              const relationshipsArray = p.relationships ? p.relationships.split(", ").filter(Boolean) : [];

              return (
                <tr key={p.parent_id}>
                  <td>{p.parent_name}</td>
                  <td>{p.phone_number?.replace(/^(\d{3})(\d+)/, "$1-$2")}</td>
                  <td>
                    {childrenArray.length > 0 ? (
                      childrenArray.map((child, index) => (
                        <div key={index}>
                          {child} ({relationshipsArray[index] || "ไม่ระบุความสัมพันธ์"})
                        </div>
                      ))
                    ) : (
                      <span style={{ color: "#999" }}>ไม่มีข้อมูล</span>
                    )}
                  </td>
                  <td className="actions">
                    <button className="icon edit" onClick={() => handleEdit(p)}><Edit /></button>
                    <button className="icon delete" onClick={() => handleDelete(p.parent_id)}><Trash2 /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="pagination-container">
          <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>ย้อนกลับ</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => setCurrentPage(page)} className={currentPage === page ? "active" : ""}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>ถัดไป</button>
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 style={{ textAlign: "center" }}>
                {editingParent ? "✏️ แก้ไขข้อมูลผู้ปกครอง" : "➕ เพิ่มผู้ปกครองใหม่"}
              </h3>

              <select
                className="form-input"
                value={formData.prefix}
                onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
              >
                <option value="">เลือกคำนำหน้า</option>
                <option value="นาย">นาย</option>
                <option value="นาง">นาง</option>
                <option value="นางสาว">นางสาว</option>
              </select>

              <input
                className="text-input"
                placeholder="ชื่อ"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="text-input"
                placeholder="นามสกุล"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />

              <input
                className="text-input"
                placeholder="เบอร์โทร"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

             <div className="address-row">
              <input
                className="text-input"
                placeholder="บ้านเลขที่"
                value={formData.houseNo}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, houseNo: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="หมู่"
                value={formData.moo}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, moo: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="ซอย"
                value={formData.alley}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, alley: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="ถนน"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
              />
            </div>
            <div className="address-row">
              <input
                className="text-input"
                placeholder="ตำบล"
                value={formData.subDistrict}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, subDistrict: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="อำเภอ"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="จังหวัด"
                value={formData.province}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, province: e.target.value } })}
              />
              <input
                className="text-input"
                placeholder="รหัสไปรษณีย์"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, address: { ...formData.address, postalCode: e.target.value } })}
              />
            </div>

              <div className="button-group">
                <button className="confirm-btn" onClick={handleSave}>บันทึก</button>
                <button className="cancel-btn" onClick={() => setShowModal(false)}>ยกเลิก</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ManageParentDepartment;
