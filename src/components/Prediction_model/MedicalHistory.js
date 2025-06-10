import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MedicalHistory.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import {
  Baby, Calendar, Clock, Heart, Music, Gift, Crown,
  Cloud, Star, TreePine, Zap, Smile, Stethoscope, Sun
} from "lucide-react";
import { CgDanger, FaChevronRight } from "react-icons/fa";



const MedicalHistory = () => {
const [childName, setChildName] = useState("ไม่ทราบชื่อ");
const [medicalHistory, setMedicalHistory] = useState([]);

const normalCount = medicalHistory.filter((r) => r.status === "ปกติ").length;

useEffect(() => {
  const patientId = localStorage.getItem("childId");

  if (!patientId) return;

  // ดึงชื่อเด็ก
  axios.get(`http://localhost:5000/patients/${patientId}`)
    .then((res) => {
      const child = res.data;
      setChildName(`${child.prefix_name_child}${child.first_name_child} ${child.last_name_child}`);
    })
    .catch((err) => console.error("โหลดชื่อเด็กล้มเหลว", err));

  // ดึงผลการประเมิน
  axios.get("http://localhost:5000/predictions?order=desc")
    .then((res) => {
      const all = res.data;
      const filtered = all.filter((item) => item.patientId?.toString() === patientId);
      const mapped = filtered.map((item, index) => ({
        id: index + 1,
        date: new Date(item.date).toLocaleDateString("th-TH"),
        time: new Date(item.date).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
        doctor: "หมอยังไม่ระบุ", // จะดึงจาก doctor_id ได้ในอนาคต
        status: item.status === "Normal" ? "ปกติ" : "กรุณาพบแพทย์",
        isLatest: index === 0
      }));
      setMedicalHistory(mapped);
    })
    .catch((err) => console.error("โหลดประวัติล้มเหลว", err));
}, []);

  const abnormalCount = medicalHistory.length - normalCount;
  const latest = medicalHistory.find((r) => r.isLatest);

  return (
    <>
      <Header currentPage="form-nutrition" />
      <main className="mh-page">

        {/* Floating icons */}
        <div className="floating-icons">
          <Heart className="floating-icon icon-heart pulse" />
          <Sun className="floating-icon icon-sun float" />
          <Music className="floating-icon icon-music bounce" />
          <TreePine className="floating-icon icon-tree pulse" />
          <Star className="floating-icon icon-star bounce" />
          <Cloud className="floating-icon icon-cloud float" />
          <Crown className="floating-icon icon-crown pulse" />
          <Gift className="floating-icon icon-gift bounce" />
          <Zap className="floating-icon icon-zap float" />
        </div>

        {/* Title */}
        <h1 className="mh-title-box">
          <Stethoscope className="icon pulse green-icon" />
          <span className="mh-title-text">ประวัติการตรวจ</span>
          <Baby className="icon bounce green-icon" />
        </h1>

        {/* TOP SECTION → 3 กล่อง */}
        <div className="mh-top-section">

          {/* Summary - Normal */}
          <div className="box green">
            <div className="box-icon">😊</div>
            <div className="box-label">สถานะปกติ</div>
            <div className="count">{normalCount} ครั้ง</div>
          </div>

          {/* Latest Box */}
          <div className="mh-latest-box">
            <div className="child-badge">
              <Baby className="icon-inline pink" />
              <span className="child-name-text">{childName}</span>
              <Heart className="icon-inline pink" />
            </div>
            <p className="last-check">
              <Clock className="icon-inline" /> การประเมินครั้งล่าสุด
              <Star className="icon-inline yellow" />
            </p>
            <div className="latest-info">
              <p><Calendar className="icon-inline" /> {latest?.date}</p>
              <p><Clock className="icon-inline" /> {latest?.time}</p>
            </div>
          </div>

          {/* Summary - ต้องติดตาม */}
          <div className="box orange">
            <div className="box-icon">💗</div>
            <div className="box-label">ต้องติดตาม</div>
            <div className="count">{abnormalCount} ครั้ง</div>
          </div>

        </div>

        {/* History cards */}
        <div className="space-y-4">
          {medicalHistory.map((item) => (
            <div key={item.id} className={`mh-card ${item.isLatest ? "latest" : ""}`}>
              <div className="mh-row">
                <div><Calendar className="icon-inline" /> <b>วันที่:</b> {item.date}</div>
                <div><Clock className="icon-inline" /> <b>เวลา:</b> {item.time}</div>
                <div><Stethoscope className="icon-inline" /> <b>แพทย์:</b> {item.doctor}</div>
                <div className={`status ${item.status === "ปกติ" ? "normal" : "alert"}`}>
                  {item.status === "ปกติ" ? (
                    <>
                      <Smile className="icon-inline" /> ปกติ
                    </>
                  ) : (
                    <>
                      <Heart className="icon-inline pink" /> กรุณาพบแพทย์
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
};

export default MedicalHistory;
