import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search, Edit, Trash2, Eye, Plus } from "lucide-react";
import "./ManageDepartment.css";

const API_URL = "http://localhost:5000/patients";

const ManageDepartment = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPatient, setEditingPatient] = useState(null);
  const [viewingPatient, setViewingPatient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hn: "",
    childPrefix: "ด.ช.",
    name: "",
    age: "",
    gender: "ชาย",
    parentPrefix: "นาย",
    parent: ""
  });

  const itemsPerPage = 5;

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลผิดพลาด", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("❌ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลเด็กคนนี้?")) {
      await axios.delete(`${API_URL}/${id}`);
      loadPatients();
    }
  };

  const handleSave = async () => {
    if (!formData.hn || !formData.name || !formData.age || !formData.parent) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    if (!["1", "2", "3", "4", "5"].includes(formData.age)) {
      alert("กรุณาเลือกอายุระหว่าง 1-5 เดือน");
      return;
    }
    if (!/^\d{1,5}$/.test(formData.hn)) {
      alert("HN ต้องเป็นตัวเลขไม่เกิน 5 หลัก");
      return;
    }

    const payload = {
      ...formData,
      name: `${formData.childPrefix} ${formData.name}`,
      parent: `${formData.parentPrefix} ${formData.parent}`,
      age: `${formData.age} เดือน`
    };

    if (editingPatient) {
      await axios.put(`${API_URL}/${editingPatient.id}`, payload);
    } else {
      await axios.post(API_URL, payload);
    }
    setShowModal(false);
    setEditingPatient(null);
    setFormData({ hn: "", childPrefix: "ด.ช.", name: "", age: "", gender: "ชาย", parentPrefix: "นาย", parent: "" });
    loadPatients();
  };

  const handleEdit = (patient) => {
    const rawAge = patient.age.replace(" เดือน", "");
    const [childPrefix, ...nameParts] = patient.name.split(" ");
    const [parentPrefix, ...parentParts] = patient.parent.split(" ");
    setEditingPatient(patient);
    setFormData({
      hn: patient.hn,
      childPrefix,
      name: nameParts.join(" "),
      age: rawAge,
      gender: patient.gender,
      parentPrefix,
      parent: parentParts.join(" ")
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingPatient(null);
    setFormData({ hn: "", childPrefix: "ด.ช.", name: "", age: "", gender: "ชาย", parentPrefix: "นาย", parent: "" });
    setShowModal(true);
  };

  const handleView = (patient) => {
    setViewingPatient(patient);
  };

  const filteredPatients = patients.filter((p) =>
    p.hn?.includes(searchTerm) || p.name?.includes(searchTerm) || p.parent?.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPatients = filteredPatients.slice(startIndex, startIndex + itemsPerPage);

  return (
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
        <h3>
          รายชื่อเด็ก <span>{filteredPatients.length} คน</span>
        </h3>
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
          {currentPatients.map((p) => (
            <tr key={p.id}>
              <td>{p.hn}</td>
              <td>{p.name}</td>
              <td>{p.age}</td>
              <td>{p.gender}</td>
              <td>{p.parent}</td>
              <td className="actions">
                <button className="icon view" onClick={() => handleView(p)}><Eye /></button>
                <button className="icon edit" onClick={() => handleEdit(p)}><Edit /></button>
                <button className="icon delete" onClick={() => handleDelete(p.id)}><Trash2 /></button>
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

            <input className="form-input" placeholder="HN (ไม่เกิน 5 หลัก)" maxLength={5} value={formData.hn} onChange={(e) => setFormData({ ...formData, hn: e.target.value })} />

            <div className="form-row">
              <select className="form-input prefix-select" value={formData.childPrefix} onChange={(e) => setFormData({ ...formData, childPrefix: e.target.value })}>
                <option value="ด.ช.">ด.ช.</option>
                <option value="ด.ญ.">ด.ญ.</option>
              </select>
              <input className="form-input name-input" placeholder="ชื่อเด็ก" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>

            <select className="form-input" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })}>
              <option value="">เลือกอายุ (เดือน)</option>
              {[1, 2, 3, 4, 5].map((m) => (
                <option key={m} value={m}>{m} เดือน</option>
              ))}
            </select>

            <select className="form-input" value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
              <option value="ชาย">ชาย</option>
              <option value="หญิง">หญิง</option>
            </select>

            <div className="form-row">
              <select className="form-input prefix-select" value={formData.parentPrefix} onChange={(e) => setFormData({ ...formData, parentPrefix: e.target.value })}>
                <option value="นาย">นาย</option>
                <option value="นางสาว">นางสาว</option>
                <option value="นาง">นาง</option>
              </select>
              <input className="form-input name-input" placeholder="ชื่อผู้ปกครอง" value={formData.parent} onChange={(e) => setFormData({ ...formData, parent: e.target.value })} />
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
            <p><strong>HN:</strong> {viewingPatient.hn}</p>
            <p><strong>ชื่อ:</strong> {viewingPatient.name}</p>
            <p><strong>อายุ:</strong> {viewingPatient.age}</p>
            <p><strong>เพศ:</strong> {viewingPatient.gender}</p>
            <p><strong>ผู้ปกครอง:</strong> {viewingPatient.parent}</p>
            <button className="cancel-btn" onClick={() => setViewingPatient(null)}>ปิด</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartment;