const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// เชื่อมต่อฐานข้อมูล MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",          // แก้ให้ตรงกับของคุณ
  password: "root",          // แก้ให้ตรงกับของคุณ
  database: "patient_db" // ฐานข้อมูลชื่อ patient_db
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database.");
  }
});


// ดึงรายชื่อทั้งหมด
app.get("/patients", (req, res) => {
  db.query("SELECT * FROM patients", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// เพิ่มผู้ป่วย
app.post("/patients", (req, res) => {
  const { hn, name, age, gender, parent } = req.body;
  db.query(
    "INSERT INTO patients (hn, name, age, gender, parent) VALUES (?, ?, ?, ?, ?)",
    [hn, name, age, gender, parent],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json({ id: results.insertId, ...req.body });
    }
  );
});

// แก้ไขข้อมูลผู้ป่วย
app.put("/patients/:id", (req, res) => {
  const { hn, name, age, gender, parent } = req.body;
  db.query(
    "UPDATE patients SET hn = ?, name = ?, age = ?, gender = ?, parent = ? WHERE id = ?",
    [hn, name, age, gender, parent, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "อัปเดตสำเร็จ" });
    }
  );
});

// ลบผู้ป่วย
app.delete("/patients/:id", (req, res) => {
  db.query("DELETE FROM patients WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "ลบสำเร็จ" });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
