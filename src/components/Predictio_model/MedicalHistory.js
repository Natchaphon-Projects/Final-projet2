import React from "react";
import "./MedicalHistory.css";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import {
  Calendar, Clock, Heart, Smile, Stethoscope, Baby, Star, Sun,
  Cloud, Rainbow, Sparkles, TreePine, Flower2, Music, Zap, Candy, Gift, Crown
} from "lucide-react";

const medicalHistory = [
  { id: 1, date: "7/6/2568", time: "18:55", status: "ปกติ", type: "ตรวจภาวะทุพโภชนาการ", doctor: "หมอน้อง", isLatest: true },
  { id: 2, date: "5/6/2568", time: "14:30", status: "กรุณาพบแพทย์", type: "ตรวจภาวะทุพโภชนาการ", doctor: "หมอใจดี" },
  { id: 3, date: "3/6/2568", time: "10:15", status: "ปกติ", type: "ตรวจภาวะทุพโภชนาการ", doctor: "หมอน้อง" },
  { id: 4, date: "1/6/2568", time: "16:45", status: "ปกติ", type: "ตรวจภาวะทุพโภชนาการ", doctor: "หมอสมหวัง" },
  { id: 5, date: "28/5/2568", time: "11:20", status: "กรุณาพบแพทย์", type: "ตรวจภาวะทุพโภชนาการ", doctor: "หมอใจดี" },
];

const childName = "น้องน้ำใส";

const MedicalHistory = () => {
  const normalCount = medicalHistory.filter(r => r.status === "ปกติ").length;
  const abnormalCount = medicalHistory.length - normalCount;
  const latest = medicalHistory.find(r => r.isLatest);

  return (
    <>
      <Header />
      <main className="mh-page">
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

        <h1 className="mh-title-box">
          <Stethoscope className="icon pulse green-icon" />
          <span className="mh-title-text">ประวัติการตรวจ</span>
          <Baby className="icon bounce green-icon" />
        </h1>

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

        <div className="space-y-4">
          {medicalHistory.map((record, index) => (
            <div key={record.id} className={`mh-card ${record.isLatest ? 'latest' : ''}`}>
              <div className="mh-row">
                <div><Calendar className="icon-inline" /> <b>วันที่:</b> {record.date}</div>
                <div><Clock className="icon-inline" /> <b>เวลา:</b> {record.time}</div>
                <div><Stethoscope className="icon-inline" /> <b>แพทย์:</b> {record.doctor}</div>
                <div className={`status ${record.status === "ปกติ" ? "normal" : "alert"}`}>
                  {record.status === "ปกติ" ? (
                    <><Smile className="icon-inline" /> ปกติ</>
                  ) : (
                    <><Heart className="icon-inline pink" /> กรุณาพบแพทย์</>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mh-summary">
          <div className="box green">
            <Smile className="box-icon" />
            <div className="box-label">สถานะปกติ</div>
            <div className="count">{normalCount} ครั้ง</div>
          </div>
          <div className="box orange">
            <Heart className="box-icon" />
            <div className="box-label">ต้องติดตาม</div>
            <div className="count">{abnormalCount} ครั้ง</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MedicalHistory;
