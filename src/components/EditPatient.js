import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./EditPatient.css";

export default function EditPatient() {
  const navigate = useNavigate();

  const initialData = {
    ep_childName: "ด.ช. สมชาย ใจดี",
    ep_dob: "2017-08-15",
    ep_gender: "ชาย",
    ep_weight: 20,
    ep_height: 115,
    ep_disease_allergy: true,
    ep_disease_other: "หืดหอบ",
    ep_food_milk: true,
    ep_food_other: "",
    ep_drug_allergy: "พาราเซตามอล",
    ep_parents: [
      { name: "นายสมบัติ ใจดี", phone: "0812345678" },
      { name: "นางสมหญิง ใจดี", phone: "0898765432" }
    ]
  };

  const [formData, setFormData] = useState(initialData);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleParentChange = (index, key, value) => {
    const updatedParents = [...formData.ep_parents];
    updatedParents[index][key] = value;
    setFormData((prev) => ({ ...prev, ep_parents: updatedParents }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/manage-department");
  };

  const handleCancel = () => {
    navigate("/manage-department");
  };

  const handleAddParent = () => {
    setFormData((prev) => ({
      ...prev,
      ep_parents: [...prev.ep_parents, { name: "", phone: "" }]
    }));
  };

  const handleRemoveParent = (index) => {
    const updated = [...formData.ep_parents];
    updated.splice(index, 1);
    setFormData((prev) => ({ ...prev, ep_parents: updated }));
  };

  return (
    <div className="edit-patient-container">
      <form onSubmit={handleSubmit} className="edit-form">
        <h2 className="form-title">ฟอร์มเพิ่ม / แก้ไขข้อมูลเด็ก</h2>

        <div className="form-row">
          <label>ชื่อเด็ก:</label>
          <input
            type="text"
            name="ep_childName"
            value={formData.ep_childName}
            onChange={(e) => handleChange("ep_childName", e.target.value)}
            placeholder="เช่น ด.ช. สมชาย ใจดี"
          />
        </div>

        <div className="form-row">
          <label>วันเกิด:</label>
          <input
            type="date"
            name="ep_dob"
            value={formData.ep_dob}
            onChange={(e) => handleChange("ep_dob", e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>เพศ:</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="ep_gender"
                value="ชาย"
                checked={formData.ep_gender === "ชาย"}
                onChange={() => handleChange("ep_gender", "ชาย")}
              />
              ชาย
            </label>
            <label>
              <input
                type="radio"
                name="ep_gender"
                value="หญิง"
                checked={formData.ep_gender === "หญิง"}
                onChange={() => handleChange("ep_gender", "หญิง")}
              />
              หญิง
            </label>
          </div>
        </div>

        <div className="form-row">
          <label>น้ำหนัก (kg):</label>
          <input
            type="number"
            name="ep_weight"
            value={formData.ep_weight}
            onChange={(e) => handleChange("ep_weight", e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>ส่วนสูง (cm):</label>
          <input
            type="number"
            name="ep_height"
            value={formData.ep_height}
            onChange={(e) => handleChange("ep_height", e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>โรคประจำตัว:</label>
          <div className="checkbox-flex-group">
            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.ep_disease_allergy}
                  onChange={(e) => handleChange("ep_disease_allergy", e.target.checked)}
                />
                ภูมิแพ้
              </label>
            </div>
            <div className="checkbox-item with-input">
              <label>
                <input type="checkbox" checked={!!formData.ep_disease_other} readOnly />
                อื่นๆ
              </label>
              <input
                type="text"
                value={formData.ep_disease_other}
                onChange={(e) => handleChange("ep_disease_other", e.target.value)}
                placeholder="ระบุโรคอื่นๆ เช่น หืดหอบ"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <label>แพ้อาหาร:</label>
          <div className="checkbox-flex-group">
            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.ep_food_milk}
                  onChange={(e) => handleChange("ep_food_milk", e.target.checked)}
                />
                แพ้นม
              </label>
            </div>
            <div className="checkbox-item with-input">
              <label>
                <input type="checkbox" checked={!!formData.ep_food_other} readOnly />
                อื่นๆ
              </label>
              <input
                type="text"
                value={formData.ep_food_other}
                onChange={(e) => handleChange("ep_food_other", e.target.value)}
                placeholder="ระบุอาหารที่แพ้"
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <label>แพ้ยา:</label>
          <input
            type="text"
            name="ep_drug_allergy"
            value={formData.ep_drug_allergy}
            onChange={(e) => handleChange("ep_drug_allergy", e.target.value)}
            placeholder="โปรดระบุชื่อยา"
          />
        </div>

        <div className="form-row">
          <label>ผู้ปกครอง:</label>
          <div className="parent-group">
            {formData.ep_parents.map((parent, index) => (
              <div key={index} className="parent-entry">
                <input
                  type="text"
                  name={`ep_parent_name_${index}`}
                  value={parent.name}
                  onChange={(e) => handleParentChange(index, "name", e.target.value)}
                  placeholder="ชื่อ"
                />
                <input
                  type="text"
                  name={`ep_parent_phone_${index}`}
                  value={parent.phone}
                  onChange={(e) => handleParentChange(index, "phone", e.target.value)}
                  placeholder="เบอร์"
                />
                {index > 0 && (
                  <button type="button" onClick={() => handleRemoveParent(index)} className="remove-btn">
                    ลบ
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddParent} className="blue-button">
              เพิ่มผู้ปกครอง
            </button>
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="green-button">
            บันทึก
          </button>
          <button type="button" onClick={handleCancel} className="red-button">
            ยกเลิก
          </button>
        </div>
      </form>
    </div>
  );
}
