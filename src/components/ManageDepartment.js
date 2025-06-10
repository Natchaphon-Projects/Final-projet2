import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import "./ManageDepartment.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const API_URL = "http://localhost:5000/patients";

const ManageDepartment = () => {
  const [patients, setPatients] = useState([]);
  const [parents, setParents] = useState([]); // 🔥 รายชื่อผู้ปกครอง
  const [relationship, setRelationship] = useState("");
  const [customRelationship, setCustomRelationship] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  const [formData, setFormData] = useState({
    childPrefix: "",
    name: "",
    lastName: "",
    age: "",
    gender: "",
    birthDate: "",
    parentId: null
  });

  const itemsPerPage = 5;

  useEffect(() => {
    loadPatients();
    loadParents();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลผิดพลาด", err);
    }
  };

  const loadParents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/parents");
      setParents(res.data);
    } catch (err) {
      console.error("โหลดผู้ปกครองผิดพลาด", err);
    }
  };

  const formatAgeText = (months) => {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) {
      return `${years} ปี ${remainingMonths} เดือน`;
    } else {
      return `${remainingMonths} เดือน`;
    }
  };

  const calculateAgeInText = (dob) => {
    const birth = new Date(dob);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
    }

    if (months < 0) {
      years -= 1;
      months += 12;
    }

    if (years > 0 && months > 0) {
      return `${years} ปี ${months} เดือน`;
    } else if (years > 0) {
      return `${years} ปี`;
    } else {
      return `${months} เดือน`;
    }
  };

  const extractMonths = (ageText) => {
    const yearMatch = ageText.match(/(\d+)\s*ปี/);
    const monthMatch = ageText.match(/(\d+)\s*เดือน/);
    const years = yearMatch ? parseInt(yearMatch[1]) : 0;
    const months = monthMatch ? parseInt(monthMatch[1]) : 0;
    return years * 12 + months;
  };

  const handleSave = async () => {
    if (
  !formData.hn ||
  !formData.name ||
  !formData.lastName ||
  !birthDate ||  // ✅ เพิ่มเช็ค birthDate
  !formData.age ||
  !formData.gender ||
  !formData.childPrefix ||
  !formData.parentId ||
  !relationship ||
  (relationship === "อื่นๆ" && customRelationship.trim() === "") // ✅ ถ้าเลือก "อื่นๆ" → ต้องกรอกด้วย
) {
  alert("กรุณากรอกข้อมูลให้ครบถ้วน");
  return;
}

  const totalMonths = extractMonths(formData.age);
    const payload = {
      hn_number: formData.hn,  // ✅ เปลี่ยนจาก hn → hn_number
      childPrefix: formData.childPrefix,
      name: formData.name,
      lastName: formData.lastName,
      age: totalMonths,
      gender: formData.gender,
      birthDate,
      parent_id: formData.parentId,
      relationship: relationship === "อื่นๆ" ? customRelationship : relationship
    };

    try {
      if (editingPatient) {
        await axios.put(`${API_URL}/${editingPatient.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      alert("บันทึกข้อมูลเด็กสำเร็จ");
      setShowModal(false);
      setEditingPatient(null);
      resetForm();
      loadPatients();
    } catch (err) {
      console.error("❌ Error saving data:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const resetForm = () => {
  setFormData({
    id: null,
    hn: "",
    childPrefix: "",
    name: "",
    lastName: "",
    age: "",
    gender: "",
    birthDate: "",
    parentId: null
  });
  setRelationship("");
  setCustomRelationship("");
  setBirthDate("");
};

  const handleAdd = () => {
    const lastPatient = [...patients].sort((a, b) => parseInt(b.hn_number) - parseInt(a.hn_number))[0];
    const newHN = lastPatient ? (parseInt(lastPatient.hn_number) + 1).toString().padStart(5, "0") : "00001";

    setEditingPatient(null);
    setViewingPatient(null);
    resetForm();
    setFormData((prev) => ({ ...prev, hn: newHN }));
    setShowModal(true);
  };

  const handleEdit = (patient) => {
    console.log("DEBUG patient", patient);   // ✅ เพิ่มตรงนี้

    const rawAge = formatAgeText(patient.age);
    const formattedDate = patient.birthDate ? new Date(patient.birthDate).toISOString().split("T")[0] : "";

    setEditingPatient(patient);
    setBirthDate(formattedDate);
    setFormData({
      hn: patient.hn_number,
      childPrefix: patient.childPrefix || "",
      name: patient.name?.split(" ")[0] || "",
      lastName: patient.name?.split(" ")[1] || "",
      age: rawAge,
      gender: patient.gender,
      birthDate: formattedDate,
      parentId: patient.parent_id || null
    });
    setRelationship(patient.relationship || "");
    setCustomRelationship(patient.relationship === "อื่นๆ" ? patient.relationship_detail || "" : "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("❌ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลเด็กคนนี้?")) {
      await axios.delete(`${API_URL}/${id}`);
      alert("ลบข้อมูลสำเร็จ");
      loadPatients();
    }
  };

  const handleView = (patient) => {
    setViewingPatient(patient);
  };

  const filteredPatients = patients.filter((p) =>
    p.hn_number?.includes(searchTerm) || p.name?.includes(searchTerm) || p.parent?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);
  console.log("Current Page:", currentPage, "Patients:", currentPatients);

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-department" />  

    <div className="manage-wrapper">
    
      <div className="search-header">
        <div className="left">
          <h2>ค้นหาข้อมูลเด็ก</h2>
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="ค้นหา HN, ชื่อ, หรือผู้ปกครอง..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="table-title">
        <h3>รายชื่อเด็ก <span>ทั้งหมด {filteredPatients.length} คน</span></h3>
        <button className="add-btn" onClick={handleAdd}>
          <Plus /> เพิ่มเด็กใหม่
        </button>
      </div>

      <table className="modern-table">
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
          
          {Object.values(
            currentPatients.reduce((acc, p) => {
              if (!acc[p.hn_number]) {
                acc[p.hn_number] = {
                  ...p,
                  parents: [{ name: p.parent, relationship: p.relationship }]
                };
              } else {
                acc[p.hn_number].parents.push({
                  name: p.parent,
                  relationship: p.relationship
                });
              }
              return acc;
            }, {})
          ).map((child) => (
            <tr key={child.id}>
              <td>{child.hn_number}</td>
              <td>{`${child.childPrefix || ""} ${child.name}`}</td>
              <td>{formatAgeText(child.age)}</td>
              <td>{child.gender}</td>
              <td>
                {child.parents.map((parent, idx) =>
                  parent.name ? (
                    <div key={idx}>
                      {parent.name} ({parent.relationship || "-"})
                    </div>
                  ) : null
                )}
              </td>
              <td className="actions">
                <button className="icon view" onClick={() => handleView(child)}>
                  <Eye />
                </button>
                <button className="icon edit" onClick={() => handleEdit(child)}>
                  <Edit />
                </button>
                <button className="icon delete" onClick={() => handleDelete(child.id)}>
                  <Trash2 />
                </button>
              </td>
            </tr>
          ))}
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
              {editingPatient ? "✏️ แก้ไขข้อมูลเด็ก" : "➕ เพิ่มเด็กใหม่"}
            </h3>

            <input className="form-input" disabled value={formData.hn} />

            <div className="form-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  
              <select
                className="form-input"
                style={{ flex: "1" }}
                value={formData.childPrefix}
                onChange={(e) => {
                  const prefix = e.target.value;
                  let gender = formData.gender;

                  if (prefix === "ด.ช.") gender = "ชาย";
                  else if (prefix === "ด.ญ.") gender = "หญิง";

                  setFormData({ ...formData, childPrefix: prefix, gender });
                }}
              >
                <option value="">คำนำหน้า</option>
                <option value="ด.ช.">ด.ช.</option>
                <option value="ด.ญ.">ด.ญ.</option>
              </select>

              <select
                className="form-input"
                style={{ flex: "1" }}
                value={formData.gender}
                onChange={(e) => {
                  const gender = e.target.value;
                  let prefix = formData.childPrefix;

                  if (gender === "ชาย") prefix = "ด.ช.";
                  else if (gender === "หญิง") prefix = "ด.ญ.";

                  setFormData({ ...formData, gender, childPrefix: prefix });
                }}
              >
                <option value="">เลือกเพศ</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>

              <input
                className="text-input name-input"
                style={{ flex: "2" }}
                placeholder="ชื่อเด็ก"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />

              <input
                className="text-input name-input"
                style={{ flex: "2" }}
                placeholder="นามสกุลเด็ก"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>

            <div className="form-row">
              <input
                type="date"
                className="form-input"
                value={birthDate}
                onChange={(e) => {
                  const dob = e.target.value;
                  setBirthDate(dob);
                  const ageText = calculateAgeInText(dob);
                  setFormData({ ...formData, age: ageText });
                }}
                min={new Date(new Date().setFullYear(new Date().getFullYear() - 5)).toISOString().split("T")[0]}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 0)).toISOString().split("T")[0]}
              />
              <input
                className="form-input age-display"
                type="text"
                value={formData.age || ""}
                disabled
                readOnly
              />
            </div>

          
           <div className="form-row" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <select
                className="form-input"
                style={{ flex: "2" }} // dropdown ผู้ปกครอง → กว้าง 2 ส่วน
                value={formData.parentId || ""}
                onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
              >
                <option value="">เลือกผู้ปกครอง</option>
                {parents.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {`${parent.prefix} ${parent.name} ${parent.lastName}`}
                  </option>
                ))}
              </select>

              <select
                className="form-input"
                style={{ flex: "1" }} // dropdown ความสัมพันธ์ → กว้าง 1 ส่วน
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
              >
                <option value="">เลือกความสัมพันธ์</option>
                <option value="แม่">แม่</option>
                <option value="พ่อ">พ่อ</option>
                <option value="ปู่">ปู่</option>
                <option value="ย่า">ย่า</option>
                <option value="ตา">ตา</option>
                <option value="ยาย">ยาย</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>

              {relationship === "อื่นๆ" && (
                <input
                  className=" text-input"
                  style={{ flex: "1" }} // ช่องกรอกอื่นๆ → กว้าง 1 ส่วน
                  placeholder="กรอกความสัมพันธ์อื่นๆ"
                  value={customRelationship}
                  onChange={(e) => setCustomRelationship(e.target.value)}
                />
              )}
            </div>

            <div className="button-group">
              <button className="confirm-btn" onClick={handleSave}>บันทึก</button>
              <button className="cancel-btn" onClick={() => setShowModal(false)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}

      {viewingPatient && (
        <div className="modal">
          <div className="modal-content">
            <h3 style={{ textAlign: "center" }}>👁️ ข้อมูลเด็ก</h3>
            <p><strong>HN:</strong> {viewingPatient.hn_number}</p>
            <p><strong>ชื่อ:</strong> {viewingPatient.name}</p>
            <p><strong>อายุ:</strong> {formatAgeText(viewingPatient.age)}</p>
            <p><strong>เพศ:</strong> {viewingPatient.gender}</p>
            <p><strong>ผู้ปกครอง:</strong> {viewingPatient.parent}</p>
            <button className="cancel-btn" onClick={() => setViewingPatient(null)}>ปิด</button>
          </div>
        </div>
      )}

    </div>
    <Footer />
    </div>
    
  );
};

export default ManageDepartment;
