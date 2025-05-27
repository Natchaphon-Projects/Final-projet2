import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Recommendations.module.css"; // Import CSS Modules

function Recommendations() {
  const navigate = useNavigate();

  const recommendations = [
    "บริโภคผักและผลไม้หลากหลายทุกมื้ออาหารเพื่อเพิ่มวิตามินและแร่ธาตุ",
    "ดื่มน้ำสะอาดวันละ 8-10 แก้วเพื่อรักษาความชุ่มชื้นของร่างกาย",
    "เพิ่มโปรตีนในมื้ออาหาร เช่น เนื้อสัตว์ไม่ติดมัน ปลา หรือถั่ว",
    "ลดการบริโภคน้ำตาลและอาหารที่มีไขมันอิ่มตัวสูง",
    "ออกกำลังกายอย่างสม่ำเสมอ อย่างน้อย 30 นาทีต่อวัน",
    "พักผ่อนอย่างเพียงพอวันละ 7-8 ชั่วโมงเพื่อให้ร่างกายฟื้นฟู",
    "ปรึกษาแพทย์หรือนักโภชนาการเพื่อแผนการดูแลสุขภาพที่เหมาะสม",
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>คำแนะนำเพื่อสุขภาพ</h1>
        <p className={styles.subtitle}>ดูแลสุขภาพของคุณเพื่อป้องกันภาวะทุพโภชนาการ</p>
      </header>
      <main className={styles.main}>
        <div className={styles.list}>
          {recommendations.map((tip, index) => (
            <div key={index} className={styles.card}>
              <img
                src={`/assets/health-tip-${index + 1}.png`}
                alt={`Health Tip ${index + 1}`}
                className={styles.image}
              />
              <p className={styles.text}>{tip}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className={styles.footer}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/parent-dashboard")}
        >
          ย้อนกลับ
        </button>
      </footer>
    </div>
  );
}

export default Recommendations;
