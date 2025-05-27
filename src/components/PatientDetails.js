import React from "react";
import "../styles.css";

function PatientDetails() {
  return (
    <div className="form-container">
      <h2>ประวัติส่วนตัว</h2>
      <p>เด็กชาย ศุวิชญ์ หนูวงศ์</p>
      <form>
        <label>อายุ: <input type="text" value="4" readOnly /></label>
        <label>น้ำหนัก: <input type="text" value="13 กก." readOnly /></label>
        <label>ส่วนสูง: <input type="text" value="90 ซม." readOnly /></label>
        <label>เพศ: <input type="text" value="ชาย" readOnly /></label>
        <label>โรคประจำตัว: <input type="text" value="โรคโลหิตจาง" readOnly /></label>
        <button>บันทึกข้อมูล</button>
      </form>
    </div>
  );
}

export default PatientDetails;
