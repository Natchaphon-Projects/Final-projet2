const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// 🔌 เชื่อมต่อฐาน MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "child_malnutrition",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database.");
  }
});

// ✅ GET: ดึงข้อมแพทย์จาก HN
app.get("/doctors/:hn", (req, res) => {
  const hn = req.params.hn;
  const query = `
    SELECT d.prefix_name_doctor, d.first_name_doctor, d.last_name_doctor
    FROM doctor d
    JOIN users u ON d.users_id = u.users_id
    WHERE u.hn_number = ?
  `;
  db.query(query, [hn], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("Doctor not found");
    }
  });
});

app.get("/patients", (req, res) => {
  const query = `
    SELECT 
      p.patient_id AS id,
      p.hn_number,
      p.prefix_name_child AS childPrefix,
      p.birth_date AS birthDate,
      CONCAT(p.first_name_child, ' ', p.last_name_child) AS name,
      p.age,
      p.gender,
      pa.parent_id AS parent_id,
      CONCAT(pa.prefix_name_parent, ' ', pa.first_name_parent, ' ', pa.last_name_parent) AS parent,
      r.relationship
    FROM patient p
    LEFT JOIN relationship r ON p.patient_id = r.patient_id
    LEFT JOIN parent pa ON r.parent_id = pa.parent_id
    ORDER BY p.hn_number 
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ message: "DB Error" });
    }
    res.json(results);
  });
});

app.post("/patients", (req, res) => {
  const {
    hn_number,
    childPrefix,
    name,
    lastName,
    age,
    gender,
    birthDate,
    relationships // ✅ รับ array มา
  } = req.body;

  console.log("📥 Received payload:", req.body);

  const patientQuery = `
    INSERT INTO patient 
    (hn_number, prefix_name_child, first_name_child, last_name_child, birth_date, gender, age, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(
    patientQuery,
    [
      hn_number,
      childPrefix,
      name,
      lastName,
      birthDate,
      gender,
      age
    ],
    (err, results) => {
      if (err) return res.status(500).send(err);

      const newPatientId = results.insertId;

      if (!Array.isArray(relationships) || relationships.length === 0) {
        return res.status(400).json({ message: "❌ ต้องระบุข้อมูล relationships อย่างน้อยหนึ่งรายการ" });
      }

      const relQuery = `
        INSERT INTO relationship (patient_id, parent_id, relationship, created_at)
        VALUES ?
      `;

      // ✅ สร้าง array ของ [patient_id, parent_id, relationship, created_at]
      const relValues = relationships.map(rel => [
        newPatientId,
        rel.parent_id,
        rel.relationship,
        new Date()
      ]);

      db.query(relQuery, [relValues], (err2) => {
        if (err2) return res.status(500).send(err2);

        res.json({ id: newPatientId, message: "✅ เพิ่มข้อมูลเด็กพร้อมความสัมพันธ์ทั้งหมดสำเร็จ" });
      });
    }
  );
});



app.put("/patients/:id", (req, res) => {
  const {
    childPrefix,
    name,
    lastName,
    age,
    gender,
    birthDate,
    weight,
    height,
    allergies,
    congenital_disease,
    parent_id,
    relationship // <<== เพิ่มมา
  } = req.body;

  const patientQuery = `
    UPDATE patient
    SET prefix_name_child = ?, first_name_child = ?, last_name_child = ?,
        birth_date = ?, gender = ?, age = ?,
        weight = ?, height = ?, allergies = ?, congenital_disease = ?
    WHERE patient_id = ?
  `;

   db.query(patientQuery, [
    childPrefix,
    name,
    lastName,
    birthDate,
    gender,
    age,
    weight,
    height,
    allergies,
    congenital_disease,
    req.params.id
  ], (err) => {
    if (err) return res.status(500).send(err);

    // ✅ อัปเดต relationship
    const relQuery = `
      UPDATE relationship
      SET parent_id = ?, relationship = ?
      WHERE patient_id = ?
    `;

    db.query(relQuery, [parent_id, relationship, req.params.id], (err2) => {
      if (err2) return res.status(500).send(err2);

      res.json({ message: "✅ อัปเดตสำเร็จ" });
    });
  });
});

// ✅ DELETE: ลบ patient + relationship
app.delete("/patients/:id", (req, res) => {
  const patientId = req.params.id;

  // ต้องลบ relationship ก่อน → เพราะมี foreign key
  const deleteRelationshipQuery = `
    DELETE FROM relationship WHERE patient_id = ?
  `;

  db.query(deleteRelationshipQuery, [patientId], (err) => {
    if (err) return res.status(500).send(err);

    // แล้วค่อยลบ patient
    const deletePatientQuery = `
      DELETE FROM patient WHERE patient_id = ?
    `;

    db.query(deletePatientQuery, [patientId], (err2) => {
      if (err2) return res.status(500).send(err2);

      res.json({ message: "🗑️ ลบข้อมูลเด็กสำเร็จ" });
    });
  });
});



// ✅ POST: เพิ่มประวัติใหม่
app.post("/patients/:id/records", (req, res) => {
  const { visit_date, note } = req.body;
  const query = `
    INSERT INTO patient_records (patient_id, visit_date, note)
    VALUES (?, ?, ?)
  `;
  db.query(query, [req.params.id, visit_date, note], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId });
  });
});

// ✅ POST: Login ตรวจสอบ HN
app.post("/login", (req, res) => {
  const { hnNumber } = req.body;
  const query = `SELECT role FROM users WHERE hn_number = ?`;
  db.query(query, [hnNumber], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length > 0) {
      const { role } = results[0];
      res.json({ success: true, role });
    } else {
      res.status(401).json({ success: false, message: "HN ไม่ถูกต้อง" });
    }
  });
});

// ✅ GET: ข้อมูลผู้ปกครอง
app.get("/parents/:hn", (req, res) => {
  const hn = req.params.hn;
  const query = `
    SELECT first_name_parent, last_name_parent
    FROM parent
    WHERE hn_number = ?
  `;
  db.query(query, [hn], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Parent not found" });
    }
  });
});

// ✅ GET: รวมผล prediction (เรียงวันที่ได้)
app.get("/predictions", (req, res) => {
  const order = req.query.order === "asc" ? "ASC" : "DESC";
  const query = `
    SELECT 
      p.patient_id AS patientId,
      CONCAT(p.first_name_child, ' ', p.last_name_child) AS name,
      pr.created_at AS date,
      pr.Status_personal AS status
    FROM patient p
    JOIN prediction pr ON p.patient_id = pr.patient_id
    ORDER BY pr.created_at ${order}
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// ✅ GET: ดึงข้อมูลแอดมินจาก HN
app.get("/admins/:hn", (req, res) => {
  const hn = req.params.hn;
  const query = `
    SELECT prefix_name_admin, first_name_admin, last_name_admin
    FROM admins a
    JOIN users u ON a.users_id = u.users_id
    WHERE u.hn_number = ?
  `;
  db.query(query, [hn], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send("Admin not found");
    }
  });
});

app.get("/find-parent-id", (req, res) => {
  const name = req.query.name;
  const [prefix, first, last] = name.split(" ");
  const query = `
    SELECT parent_id FROM parent
    WHERE prefix_name_parent = ? AND first_name_parent = ? AND last_name_parent = ?
  `;
  db.query(query, [prefix, first, last], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    if (results.length > 0) {
      res.json({ parent_id: results[0].parent_id });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

app.post("/predictions/combined", (req, res) => {
  const data = req.body;
  const patientId = data.patient_id;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patient_id" });
  }

 // 🔍 หาโค้ดนี้ใน server.js
const weight = data.Weight;
const height = data.Height;
const visit_date = new Date().toISOString().split("T")[0];

// ✅ เพิ่มตัวแปรใหม่
const foodAllergy = data.Food_allergy || null;
const drugAllergy = data.Drug_allergy || null;
const disease = data.congenital_disease || null;

// ❗ ลบจาก data ก่อนส่งเข้า prediction
delete data.Weight;
delete data.Height;
delete data.Food_allergy;
delete data.Drug_allergy;
delete data.congenital_disease;


  // ✅ สร้าง query สำหรับ medical_records
 const insertMedical = `
  INSERT INTO medical_records (patient_id, visit_date, weight, height, Food_allergy, Drug_allergy, congenital_disease, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
`;

db.query(insertMedical, [patientId, visit_date, weight, height, foodAllergy, drugAllergy, disease], (err1) => {
  if (err1) {
    console.error("❌ Insert medical_records failed:", err1);
    return res.status(500).json({ error: "Insert medical_records failed" });
  }


    // ✅ เตรียมข้อมูลสำหรับ prediction
    const fields = Object.keys(data)
      .filter((key) => key !== "patient_id")
      .map((key) => `\`${key}\``)
      .join(", ");

    const values = Object.keys(data)
      .filter((key) => key !== "patient_id")
      .map((key) => mysql.escape(data[key]))
      .join(", ");

    const query = `
      INSERT INTO prediction (patient_id, ${fields}, created_at)
      VALUES (${mysql.escape(patientId)}, ${values}, NOW())
    `;

    db.query(query, (err2, result) => {
      if (err2) {
        console.error("❌ Insert prediction failed:", err2);
        return res.status(500).json({ error: "Insert prediction failed" });
      }

      res.status(201).json({ message: "✅ บันทึกข้อมูลสำเร็จ", prediction_id: result.insertId });
    });
  });
});



// ✅ GET: ข้อมูล users จาก hnNumber
app.get("/users/:hn", (req, res) => {
  const hn = req.params.hn;
  const query = `
    SELECT * FROM users
    WHERE hn_number = ?
  `;
  db.query(query, [hn], (err, results) => {
    if (err) return res.status(500).send("Database error");
    if (results.length > 0) {
      res.status(200).json(results[0]);
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.get("/find-patient-id", (req, res) => {
  const hn = req.query.hn;
  const query = `SELECT patient_id FROM patient WHERE hn_number = ?`;
  db.query(query, [hn], (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    if (results.length > 0) {
      res.json({ patient_id: results[0].patient_id });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

app.post("/medical-records", (req, res) => {
  const { patient_id, height, weight, visit_date } = req.body;

  const query = `
    INSERT INTO medical_records (patient_id, visit_date, height, weight, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  db.query(query, [patient_id, visit_date, height, weight], (err, result) => {
    if (err) {
      console.error("SQL Error:", err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(200).json({ message: "✅ บันทึกสำเร็จ", id: result.insertId });
  });
});

app.get("/children-by-parent/:hn", (req, res) => {
  const hn = req.params.hn;
  const query = `
    SELECT 
      p.patient_id,
      p.hn_number AS hn,
      p.prefix_name_child,
      p.first_name_child,
      p.last_name_child
    FROM parent pa
    JOIN relationship r ON pa.parent_id = r.parent_id
    JOIN patient p ON r.patient_id = p.patient_id
    WHERE pa.hn_number = ?
  `;
  db.query(query, [hn], (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ message: "DB error" });
    }
    res.json(results);
  });
});

app.get("/patients/:id", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT 
    patient_id,
    hn_number AS hn,
    prefix_name_child,
    first_name_child,
    last_name_child,
    age,
    gender
  FROM patient
  WHERE patient_id = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});


// ✅ GET: รายชื่อผู้ปกครองทั้งหมด (สำหรับ dropdown)
app.get("/parents", (req, res) => {
  const query = `
    SELECT parent_id AS id, prefix_name_parent AS prefix, first_name_parent AS name, last_name_parent AS lastName
    FROM parent
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: "DB Error" });
    res.json(results);
  });
});

// ✅ GET: รายชื่อผู้ปกครองพร้อมเด็กในความดูแล
app.get("/parents-with-children", (req, res) => {
 const query = `
    SELECT 
    pa.parent_id,
    CONCAT(pa.prefix_name_parent, ' ', pa.first_name_parent, ' ', pa.last_name_parent) AS parent_name,
    pa.houseNo, pa.moo, pa.alley, pa.street, pa.subDistrict, pa.district, pa.province, pa.postalCode,
    pa.phone_number,
    GROUP_CONCAT(CONCAT(p.prefix_name_child, ' ', p.first_name_child, ' ', p.last_name_child) SEPARATOR ', ') AS children,
    GROUP_CONCAT(r.relationship SEPARATOR ', ') AS relationships
  FROM parent pa
  LEFT JOIN relationship r ON pa.parent_id = r.parent_id
  LEFT JOIN patient p ON r.patient_id = p.patient_id
  GROUP BY pa.parent_id
  ORDER BY pa.parent_id;
`;

  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ SQL Error:", err);
      return res.status(500).json({ message: "DB Error" });
    }
    res.json(results);
  });
});




app.get("/patients/:id/records", (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT 
      m.weight,
      m.height,
      m.Food_allergy AS Food_allergy,
      m.Drug_allergy AS drug_allergy,
      m.congenital_disease,
      pt.hn_number,
      p.Status_personal AS status
    FROM medical_records m
    JOIN (
      SELECT * FROM prediction
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 1
    ) p ON m.patient_id = p.patient_id
<<<<<<< Updated upstream
    JOIN patient pt ON pt.patient_id = m.patient_id
=======
     JOIN patient pt ON pt.patient_id = m.patient_id
>>>>>>> Stashed changes
    WHERE m.patient_id = ?
    ORDER BY m.created_at DESC
    LIMIT 1;
  `;

  db.query(query, [id, id], (err, results) => {
    if (err) {
      console.error("❌ Error fetching medical record:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: "No records found" });
    }
  });
});






// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});

