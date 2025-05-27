import React from "react";
import '../styles.css';


function AddPatient() {
  return (
    <div className="form-container">
      <h2>เพิ่มข้อมูล</h2>
      <form>
        <label>
          HN ID:
          <input type="text" placeholder="ใส่ข้อมูล" />
        </label>
        <label>
          ชื่อ:
          <input type="text" placeholder="ใส่ข้อมูล" />
        </label>
        <label>
          ผู้ปกครอง:
          <input type="text" placeholder="ใส่ข้อมูล" />
        </label>
        <label>
          เบอร์โทรติดต่อ:
          <input type="text" placeholder="ใส่ข้อมูล" />
        </label>
        <label>
          ที่อยู่:
          <textarea placeholder="ใส่ข้อมูล" />
        </label>
        {/* ข้อมูลเพิ่มเติม */}
        <button type="submit">บันทึกข้อมูล</button>
      </form>
    </div>
  );
}

export default AddPatient;
