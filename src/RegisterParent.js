import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterParent.css";

function RegisterParent() {
  const [form, setForm] = useState({
    hn_number: "",
    prefix: "",
    firstName: "",
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

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestHN = async () => {
      try {
        const res = await axios.get("http://localhost:5000/last-parent-hn");
        const lastHN = res.data.last_hn || "00000";
        const newHN = (parseInt(lastHN) + 1).toString().padStart(5, "0");
        setForm((prev) => ({ ...prev, hn_number: newHN }));
      } catch (err) {
        console.error("โหลด HN ไม่สำเร็จ", err);
      }
    };
    fetchLatestHN();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let filtered = value;
    if (name === "firstName" || name === "lastName") {
      filtered = value.replace(/[0-9]/g, ""); // ห้ามกรอกเลข
    } else if (name === "phone") {
      filtered = value.replace(/\D/g, "").slice(0, 10);
      if (filtered.length > 3 && filtered.length <= 6) {
        filtered = `${filtered.slice(0, 3)}-${filtered.slice(3)}`;
      } else if (filtered.length > 6) {
        filtered = `${filtered.slice(0, 3)}-${filtered.slice(3, 6)}-${filtered.slice(6)}`;
      }
    } else if (name === "houseNo") {
      filtered = value.replace(/[^0-9/]/g, "");
    } else if (name === "moo") {
      filtered = value.replace(/\D/g, "");
    } else if (name === "postalCode") {
      filtered = value.replace(/\D/g, "");
    } else if (name === "province") {
      filtered = value.replace(/[^ก-๙a-zA-Z\s]/g, "");
    }

    setForm({ ...form, [name]: filtered });
  };

  const handleSubmit = async () => {
    const requiredFields = [
      "prefix",
      "firstName",
      "lastName",
      "phone",
      "houseNo",
      "moo",
      "subDistrict",
      "district",
      "province",
      "postalCode"
    ];

    const missingFields = requiredFields.filter((field) => !form[field]);
    if (missingFields.length > 0) {
      const fieldNames = {
        prefix: "คำนำหน้า",
        firstName: "ชื่อ",
        lastName: "นามสกุล",
        phone: "เบอร์โทรศัพท์",
        houseNo: "บ้านเลขที่",
        moo: "หมู่",
        subDistrict: "แขวง/ตำบล",
        district: "เขต/อำเภอ",
        province: "จังหวัด",
        postalCode: "รหัสไปรษณีย์"
      };

      const missingLabels = missingFields.map((field) => fieldNames[field]).join(", ");
      alert(`กรุณากรอกข้อมูล: ${missingLabels}`);
      return;
    }

    try {
      setLoading(true);
      const payload = { ...form, status: "pending" };
      const res = await axios.post("http://localhost:5000/register", payload);
      alert(res.data.message || "ส่งคำขอสมัครเรียบร้อยแล้ว");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการสมัคร");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page-wrapper">
      <div className="register-card">
        <div className="icon-circle">
          <span className="icon">👪</span>
        </div>
        <h1>สมัครผู้ปกครอง</h1>
        <p className="subtext">กรอกข้อมูลเพื่อใช้เข้าสู่ระบบและรับบริการ</p>

        <div className="form-row">
          {/* HN */}
          <input
            value={form.hn_number}
            disabled
            placeholder="หมายเลข HN (อัตโนมัติ)"
            className="input-field hn-field"
          />

          {/* คำนำหน้า */}
          <select
            name="prefix"
            onChange={handleChange}
            value={form.prefix}
            className="input-field prefix-field"
          >
            <option value="">คำนำหน้า</option>
            <option value="นาย">นาย</option>
            <option value="นาง">นาง</option>
            <option value="นางสาว">นางสาว</option>
          </select>

          {/* ชื่อ */}
          <div className="input-with-star-register name-field">
            <input
              name="firstName"
              placeholder="ชื่อ"
              value={form.firstName}
              onChange={handleChange}
              className="input-field"
            />
            {!form.firstName && <span className="required-star-register">*</span>}
          </div>

          {/* นามสกุล */}
          <div className="input-with-star-register name-field">
            <input
              name="lastName"
              placeholder="นามสกุล"
              value={form.lastName}
              onChange={handleChange}
              className="input-field"
            />
            {!form.lastName && <span className="required-star-register">*</span>}
          </div>
        </div>


        <div className="input-with-star-register">
          <input
            name="phone"
            placeholder="เบอร์โทรศัพท์"
            value={form.phone}
            onChange={handleChange}
            className="input-field"
          />
          {/* แสดง * เฉพาะเมื่อยังไม่ได้กรอกข้อมูล */}
          {!form.phone && <span className="required-star-register">*</span>}
        </div>

        <div className="form-section-title">ที่อยู่ (ไม่จำเป็นต้องกรอกทั้งหมด)</div>

        <div className="form-row">
          {/* นามสกุล */}
          <div className="input-with-star-register name-field">
            <input
              name="houseNo"
              placeholder="บ้านเลขที่"
              value={form.houseNo}
              onChange={handleChange}
              className="input-field"
            />
            {!form.houseNo && <span className="required-star-register">*</span>}
          </div>
          <div className="input-with-star-register name-field">
            <input
              name="moo"
              placeholder="หมู่"
              value={form.moo}
              onChange={handleChange}
              className="input-field short"
            />
            {!form.moo && <span className="required-star-register">*</span>}
          </div>
          <div className="input-with-star-register name-field">
            <input
              name="alley"
              placeholder="ตรอก/ซอย"
              value={form.alley}
              onChange={handleChange}
              className="input-field"
            />

          </div>
        </div>

        <div className="form-row">
          <div className="input-with-star-register name-field">
            <input
              name="street"
              placeholder="ถนน"
              value={form.street}
              onChange={handleChange}
              className="input-field"
            />

          </div>
          <div className="input-with-star-register name-field">
            <input
              name="subDistrict"
              placeholder="แขวง/ตำบล"
              value={form.subDistrict}
              onChange={handleChange}
              className="input-field"
            />
            {!form.subDistrict && <span className="required-star-register">*</span>}
          </div>
          <div className="input-with-star-register name-field">
            <input
              name="district"
              placeholder="เขต/อำเภอ"
              value={form.district}
              onChange={handleChange}
              className="input-field"
            />
            {!form.district && <span className="required-star-register">*</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="input-with-star-register name-field">
            <input
              name="province"
              placeholder="จังหวัด"
              value={form.province}
              onChange={handleChange}
              className="input-field"
            />
            {!form.province && <span className="required-star-register">*</span>}
          </div>
          <div className="input-with-star-register name-field">
            <input
              name="postalCode"
              placeholder="รหัสไปรษณีย์"
              value={form.postalCode}
              onChange={handleChange}
              className="input-field"
            />
            {!form.postalCode && <span className="required-star-register">*</span>}
          </div>
        </div>

        <button
          className="register-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "กำลังส่งคำขอ..." : "ส่งคำขอสมัคร"}
        </button>
      </div>
    </div>
  );
}

export default RegisterParent;
