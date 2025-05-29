const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🔌 เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "patient_db"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// 🔍 GET: รายชื่อผู้ป่วยทั้งหมด (แปลง birth_date → birthDate)
app.get("/patients", (req, res) => {
  const query = `
    SELECT id, hn, name, age, gender, parent, birth_date AS birthDate
    FROM patients
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ➕ POST: เพิ่มผู้ป่วยใหม่
app.post("/patients", (req, res) => {
  const { hn, name, age, gender, parent, birthDate } = req.body;
  const query = `
    INSERT INTO patients (hn, name, age, gender, parent, birth_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [hn, name, age, gender, parent, birthDate || null], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ id: results.insertId, ...req.body });
  });
});

// ✏️ PUT: แก้ไขข้อมูลผู้ป่วย
app.put("/patients/:id", (req, res) => {
  const { hn, name, age, gender, parent, birthDate } = req.body;
  const query = `
    UPDATE patients
    SET hn = ?, name = ?, age = ?, gender = ?, parent = ?, birth_date = ?
    WHERE id = ?
  `;
  db.query(query, [hn, name, age, gender, parent, birthDate || null, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "✅ อัปเดตสำเร็จ" });
  });
});

// 🗑️ DELETE: ลบผู้ป่วย
app.delete("/patients/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "🗑️ ลบสำเร็จ" });
  });
});

// 📖 GET: ดึงประวัติของผู้ป่วย
app.get("/patients/:id/records", (req, res) => {
  const patientId = req.params.id;
  const query = `
    SELECT * FROM patient_records
    WHERE patient_id = ?
    ORDER BY visit_date DESC
  `;
  db.query(query, [patientId], (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ➕ POST: เพิ่มประวัติใหม่ให้ผู้ป่วย
app.post("/patients/:id/records", (req, res) => {
  const patientId = req.params.id;
  const { visit_date, note } = req.body;
  const query = `
    INSERT INTO patient_records (patient_id, visit_date, note)
    VALUES (?, ?, ?)
  `;
  db.query(query, [patientId, visit_date, note], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
