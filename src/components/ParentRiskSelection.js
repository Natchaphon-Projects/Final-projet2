import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import "./ParentRiskSelection.css";

function ParentRiskSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const hnNumber = location.state?.hnNumber || localStorage.getItem("hnNumber");

  const [children, setChildren] = useState([]);

useEffect(() => {
  if (hnNumber) {
    axios
      .get(`http://localhost:5000/children-by-parent/${hnNumber}`)
      .then((res) => {
        console.log("🎯 เด็กที่โหลดได้:", res.data); // เช็กใน console
        setChildren(res.data);
      })
      .catch((err) => console.error("โหลดรายชื่อเด็กไม่สำเร็จ", err));
  } else {
    console.warn("⚠️ hnNumber ไม่พบใน state หรือ localStorage");
  }
}, [hnNumber]);

  const handleChildSelect = (child) => {
    // บันทึก hn ของเด็กใน localStorage เพื่อใช้ใน Groupdatainput
    localStorage.setItem("childHn", child.hn);
    localStorage.setItem("childId", child.patient_id);
    navigate("/parent-risk-assessment"); // ไปหน้า GroupedDataInput
  };

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-main center-content">
        <h2>เลือกเด็กที่ต้องการประเมิน</h2>
        <div className="children-grid">
          {children.map((child) => (
            <div className="child-card" key={child.patient_id} onClick={() => handleChildSelect(child)}>
              <h3>{`${child.prefix_name_child} ${child.first_name_child} ${child.last_name_child}`}</h3>
              <p>HN: {child.hn}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ParentRiskSelection;