import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Plus } from "lucide-react";
import "./ManageDepartment.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length >= 7) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (digits.length >= 4) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  } else {
    return digits;
  }
};


const ManageParentDepartment = () => {
  const [parents, setParents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingParent, setEditingParent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    hn: "",
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
    if (!formData.hn ||
      !formData.prefix ||
      !formData.name ||
      !formData.lastName ||
      !formData.phone ||
      !formData.houseNo ||
      !formData.moo ||
      !formData.alley ||
      !formData.street ||
      !formData.subDistrict ||
      !formData.district ||
      !formData.province ||
      !formData.postalCode
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const payload = {
      hn_number: formData.hn,
      prefix: formData.prefix,
      name: formData.name,
      lastName: formData.lastName,
      phone: formData.phone,
      houseNo: formData.houseNo,
      moo: formData.moo,
      alley: formData.alley,
      street: formData.street,
      subDistrict: formData.subDistrict,
      district: formData.district,
      province: formData.province,
      postalCode: formData.postalCode
    };

    try {
      if (editingParent) {
        await axios.put(`http://localhost:5000/parents/${editingParent.parent_id}`, payload);
      } else {
        await axios.post("http://localhost:5000/parents", payload);
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
      hn: "",
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
    const lastParent = [...parents].sort((a, b) => parseInt(b.hn_number) - parseInt(a.hn_number))[0];
    const newHN = lastParent ? (parseInt(lastParent.hn_number) + 1).toString().padStart(5, "0") : "00001";

    setEditingParent(null);
    resetForm();
    setFormData((prev) => ({ ...prev, hn: newHN }));
    setShowModal(true);
  };

  const handleEdit = (parent) => {
  setEditingParent(parent);
  setFormData({
    hn: parent.hn_number || "",
    prefix: parent.prefix_name_parent || "",
    name: parent.first_name_parent || "",
    lastName: parent.last_name_parent || "",
    phone: parent.phone_number || "",
    houseNo: parent.houseNo || "",
    moo: parent.moo || "",
    alley: parent.alley || "",
    street: parent.street || "",
    subDistrict: parent.subDistrict || "",
    district: parent.district || "",
    province: parent.province || "",
    postalCode: parent.postalCode || ""
  });
  setShowModal(true);
};

  const handleDelete = async (id) => {
    if (window.confirm("❌ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลผู้ปกครองนี้?")) {
      await axios.delete(`http://localhost:5000/parents/${id}`);
      alert("ลบข้อมูลสำเร็จ");
      loadParents();
    }
  };

  const filteredParents = parents.filter((p) =>
    p.parent_name?.includes(searchTerm) || p.phone_number?.includes(searchTerm) || p.parent_address?.includes(searchTerm)
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
              <th>HN</th>
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
                  <td>{p.hn_number}</td>
                  <td>{p.parent_name}</td>
                  <td>{p.phone_number?.replace(/^(\d{3})(\d{3})(\d+)/, "$1-$2-$3")}</td>
                  <td>
                    {childrenArray.length > 0 ? (
                      childrenArray.map((child, index) => {
                        const rel = relationshipsArray[index] || "ตอนนี้ยังไม่มีเด็กในความดูแล";
                        return (
                          <div key={index}>
                            <strong> {rel}</strong> ของ <strong>{child}</strong>
                          </div>
                        );
                      })
                    ) : (
                      <span style={{ color: "#999" }}>ตอนนี้ยังไม่มีเด็กในความดูแล</span>
                    )}
                  </td>
                  <td>
                    <div>
                      {p.houseNo && `บ้านเลขที่ ${p.houseNo} `}
                      {p.moo && `หมู่ ${p.moo} `}
                      {p.alley && `ซอย ${p.alley} `}
                      {p.street && `ถนน ${p.street} `}
                    </div>
                    <div>
                      {p.subDistrict && `ตำบล ${p.subDistrict} `}
                      {p.district && `อำเภอ ${p.district} `}
                      {p.province && `จังหวัด ${p.province} `}
                      {p.postalCode && `รหัสไปรษณีย์ ${p.postalCode}`}
                    </div>
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

              {/* ✅ แถวที่ 1: HN */}

              <input className="text-input" disabled value={formData.hn} />


              {/* ✅ แถวที่ 2: คำนำหน้า + ชื่อ + นามสกุล + เบอร์โทร */}
              <div className="form-row">
                <select
                  className="form-input prefix-select"
                  value={formData.prefix}
                  onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                >
                  <option value="">เลือกคำนำหน้า</option>
                  <option value="นาย">นาย</option>
                  <option value="นาง">นาง</option>
                  <option value="นางสาว">นางสาว</option>
                </select>

                <input
                  className="text-input name-input"
                  placeholder="ชื่อ"
                  value={formData.name}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, "");
                    setFormData({ ...formData, name: value });
                  }}
                />

                <input
                  className="text-input name-input"
                  placeholder="นามสกุล"
                  value={formData.lastName}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, "");
                    setFormData({ ...formData, lastName: value });
                  }}
                />

                <input
                  className="text-input name-input"
                  placeholder="เบอร์โทร (เช่น 081-234-5678)"
                  value={formatPhoneNumber(formData.phone)}
                  maxLength={12}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: digits });
                  }}
                />
              </div>


              <div className="address-row">
                <input
                  className="text-input"
                  placeholder="บ้านเลขที่"
                  value={formData.houseNo}
                  onChange={(e) => {
                    const onlyValid = e.target.value.replace(/[^0-9/]/g, ""); // ✅ อนุญาตเฉพาะเลขกับ "/"
                    setFormData({ ...formData, houseNo: onlyValid });
                  }}
                />


                <input
                  className="text-input"
                  placeholder="หมู่"
                  value={formData.moo}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                    setFormData({ ...formData, moo: digitsOnly });
                  }}
                />

                <input
                  className="text-input"
                  placeholder="ซอย"
                  value={formData.alley}
                  onChange={(e) => setFormData({ ...formData, alley: e.target.value })}
                />
                <input
                  className="text-input"
                  placeholder="ถนน"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
              <div className="address-row">
                <input
                  className="text-input"
                  placeholder="ตำบล"
                  value={formData.subDistrict}
                  onChange={(e) => setFormData({ ...formData, subDistrict: e.target.value })}
                />
                <input
                  className="text-input"
                  placeholder="อำเภอ"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                />
                <input
                  className="text-input"
                  placeholder="จังหวัด"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
                <input
                  className="text-input"
                  placeholder="รหัสไปรษณีย์"
                  value={formData.postalCode}
                  maxLength={5}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, ""); // เอาเฉพาะตัวเลข
                    setFormData({ ...formData, postalCode: digitsOnly });
                  }}
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
