// 🔄 เพิ่มฟีเจอร์เพิ่มวันทำงานหลายรายการแบบ dynamic
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt, FaSearch, FaPlus } from "react-icons/fa";
import axios from "axios";
import "./ManageDoctorDepartment.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

const ManageDoctorDepartment = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    hn: "",
    prefix: "",
    name: "",
    lastName: "",
    phone: "",
    specialist: "",
    workSchedules: [{ day: "", time: "" }] // ✅ ใช้ array สำหรับหลายรายการ
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await axios.get("/api/doctors");
      setDoctors(res.data);
    } catch (err) {
      console.error("โหลดข้อมูลหมอผิดพลาด", err);
    }
  };

  const handleAddSchedule = () => {
    setFormData({
      ...formData,
      workSchedules: [...formData.workSchedules, { day: "", time: "" }]
    });
  };

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

  const handleRemoveSchedule = (index) => {
    const newSchedules = [...formData.workSchedules];
    newSchedules.splice(index, 1);
    setFormData({ ...formData, workSchedules: newSchedules });
  };

  const weekdaysOrder = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

  const handleScheduleChange = (index, field, value) => {
    const newSchedules = [...formData.workSchedules];
    newSchedules[index][field] = value;
    setFormData({ ...formData, workSchedules: newSchedules });
  };

  const handleAdd = () => {
    const lastDoctor = [...doctors].sort((a, b) => parseInt(b.hn_number) - parseInt(a.hn_number))[0];
    const newHN = lastDoctor ? (parseInt(lastDoctor.hn_number) + 1).toString().padStart(5, "0") : "00001";

    setEditingDoctor(null);
    setFormData({
      hn: newHN,
      prefix: "",
      name: "",
      lastName: "",
      phone: "",
      specialist: "",
      workSchedules: [{ day: "", time: "" }]
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (
      !formData.prefix ||
      !formData.name ||
      !formData.lastName ||
      !formData.phone ||
      !formData.specialist ||
      formData.workSchedules.some(w => !w.day || !w.time)
    ) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วนทุกช่องก่อนบันทึก");
      return;
    }

    const workDay = formData.workSchedules.map(w => w.day).join(" , ");
    const workTime = formData.workSchedules.map(w => w.time).join(" , ");

    const payload = {
      hn_number: formData.hn,
      prefix: formData.prefix,
      firstName: formData.name,
      lastName: formData.lastName,
      phone: formData.phone,
      specialist: formData.specialist,
      workDay,
      workTime
    };

    try {
      if (editingDoctor) {
        await axios.put(`/api/doctors/${editingDoctor.doctor_id}`, payload);
      } else {
        await axios.post("/api/doctors", payload);
      }
      alert("บันทึกข้อมูลหมอสำเร็จ");
      setShowModal(false);
      setEditingDoctor(null);
      loadDoctors();
    } catch (err) {
      console.error("❌ Error saving doctor:", err);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleEdit = (doctor) => {
    const days = doctor.work_day?.split(" , ") || [""];
    const times = doctor.work_time?.split(" , ") || [""];
    const workSchedules = days.map((d, i) => ({ day: d, time: times[i] || "" }));

    setEditingDoctor(doctor);
    setFormData({
      hn: doctor.hn_number,
      prefix: doctor.prefix_name_doctor,
      name: doctor.first_name_doctor,
      lastName: doctor.last_name_doctor,
      phone: doctor.phone_number,
      specialist: doctor.specialist,
      workSchedules
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("❌ คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลหมอคนนี้?")) {
      await axios.delete(`/api/doctors/${id}`);
      alert("ลบข้อมูลสำเร็จ");
      loadDoctors();
    }
  };

  const filteredDoctors = doctors.filter((d) =>
    d.first_name_doctor?.includes(searchTerm) ||
    d.last_name_doctor?.includes(searchTerm) ||
    d.specialist?.includes(searchTerm)
  );

  return (
    <div className="dashboard-container">
      <Header currentPage="manage-doctor-department" />
      <div className="manage-wrapper">
        <div className="search-header">
          <div className="left">
            <h2>ค้นหาหมอ</h2>
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="ค้นหาชื่อ, นามสกุล, หรือความเชี่ยวชาญ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

      
        <div className="table-title">
          <h3>รายชื่อหมอ <span>ทั้งหมด {filteredDoctors.length} คน</span></h3>
          <button className="add-btn" onClick={handleAdd}>
            <FaPlus /> เพิ่มหมอใหม่
          </button>
        </div>

        <div className="table-scroll-wrapper">
          <table className="modern-table">
            <thead>
              <tr>
                <th>HN</th>
                <th>ชื่อ</th>
                <th>ความเชี่ยวชาญ</th>
                <th>วัน/เวลาเข้าทำงาน</th>
                <th>เบอร์โทร</th>
                <th>การจัดการ</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((d) => (
                <tr key={d.doctor_id}>
                  <td>{d.hn_number}</td>
                  <td>{d.prefix_name_doctor} {d.first_name_doctor} {d.last_name_doctor}</td>
                  <td>{d.specialist}</td>
                  <td>
                    {(() => {
                      const days = d.work_day?.split(" , ") || [];
                      const times = d.work_time?.split(" , ") || [];
                      const combined = days.map((day, i) => ({ day, time: times[i] || "" }));

                      const sorted = combined.sort((a, b) => {
                        return weekdaysOrder.indexOf(a.day) - weekdaysOrder.indexOf(b.day);
                      });

                      return sorted.map((item, i) => (
                        <div key={i}>{item.day} {item.time}</div>
                      ));
                    })()}
                  </td>
                  <td>{d.phone_number?.replace(/^(\d{3})(\d{3})(\d+)/, "$1-$2-$3")}</td>
                  <td className="actions">
                    <button className="icon edit" onClick={() => handleEdit(d)}><FaEdit /></button>
                    <button className="icon delete" onClick={() => handleDelete(d.doctor_id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h3 style={{ textAlign: "center" }}>
                {editingDoctor ? "✏️ แก้ไขข้อมูลหมอ" : "➕ เพิ่มหมอใหม่"}
              </h3>

              <input className="text-input" disabled value={formData.hn} />

              <div className="form-row">
                <select className="form-input prefix-select" value={formData.prefix} onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}>
                  <option value="">คำนำหน้า</option>
                  <option value="นพ.">นพ.</option>
                  <option value="พญ.">พญ.</option>
                </select>
                <input className="text-input name-input" placeholder="ชื่อ" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, "") })} />
                <input className="text-input name-input" placeholder="นามสกุล" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value.replace(/[^ก-๙a-zA-Z\s]/g, "") })} />
              </div>

              <div className="form-row">
                <input className="text-input name-input" placeholder="เบอร์โทร (เช่น 081-234-5678)" value={formatPhoneNumber(formData.phone)} maxLength={12} onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} />
                <input className="text-input name-input" placeholder="ความเชี่ยวชาญ" value={formData.specialist} onChange={(e) => setFormData({ ...formData, specialist: e.target.value })} />
              </div>

              {/* 🔁 หลายวันทำงาน */}
              {formData.workSchedules.map((schedule, index) => (
                <div className="form-row align-center" key={index}>
                  <select
                    className="text-input name-input"
                    value={schedule.day}
                    onChange={(e) => handleScheduleChange(index, "day", e.target.value)}
                  >
                    <option value="">เลือกวัน</option>
                    <option value="ศุกร์">อาทิตย์</option>
                    <option value="จันทร์">จันทร์</option>
                    <option value="อังคาร">อังคาร</option>
                    <option value="พุธ">พุธ</option>
                    <option value="พฤหัสบดี">พฤหัสบดี</option>
                    <option value="ศุกร์">ศุกร์</option>
                    <option value="ศุกร์">เสาร์</option>
                  </select>
                  <input
                    className="text-input name-input"
                    placeholder="เวลา เช่น 09:00-16:00"
                    value={schedule.time}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9:-]/g, "");
                      handleScheduleChange(index, "time", value);
                    }}
                  />

                  {/* ถังขยะ */}
                  {formData.workSchedules.length > 1 && (
                    <button className="icon delete" onClick={() => handleRemoveSchedule(index)}>
                      <FaTrashAlt />
                    </button>
                  )}
                </div>
              ))}
              <button className="confirm-btn" onClick={handleAddSchedule}>+ เพิ่มวันทำงาน</button>

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

export default ManageDoctorDepartment;
