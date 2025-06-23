import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import './Recomendation.css';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import WeightChart from '../components/chart/WeightChart';
import HeightChart from '../components/chart/HeightChart';
import Sunglasscat from '../assets/cat-sunglass.jpg';
import { useLocation } from "react-router-dom";
import React, { useState, useEffect } from "react";
import {
  Activity,
  Stethoscope,
  ListChecks,
  FileBarChart2,
  TrendingUp,
  TrendingDown
} from "lucide-react";



const valueMap = {
  // ✅ dropdown
  Number_of_Times_Eaten_Solid_Food: {
    label: "จำนวนมื้ออาหารแข็ง",
    values: {
      0: "1-2 มื้อ",
      1: "3-4 มื้อ",
      2: "ไม่ได้บริโภค",
      3: "4 มื้อขึ้นไป"
    }
  },

  // ✅ checkbox
  Guardian: {
    label: "บุคคลที่ดูแลเด็กเป็นมารดาผู้ให้กำเนิดหรือไม่",
    values: { 0: "ไม่ใช่มารดาผู้ให้กำเนิด", 1: "เป็นมารดาผู้ให้กำเนิด" }
  },
  Is_Respondent_Biological_Mother: {
    label: "ผู้ตอบแบบสอบถามเป็นมารดาผู้ให้กำเนิดหรือไม่",
    values: { 0: "ไม่ใช่มารดาผู้ให้กำเนิด", 1: "เป็นมารดาผู้ให้กำเนิด" }
  },
  Last_Month_Weight_Check: {
    label: "น้ำหนักได้รับการตรวจในเดือนที่ผ่านมา",
    values: { 0: "ไม่ได้ตรวจ", 1: "ตรวจแล้ว" }
  },
  Weighed_Twice_Check_in_Last_3_Months: {
    label: "ตรวจน้ำหนักอย่างน้อย 2 ครั้งใน 3 เดือน",
    values: { 0: "ไม่ครบ 2 ครั้ง", 1: "ครบ 2 ครั้ง" }
  },

  // ✅ checkbox บริโภค
  Still_Breastfeeding: { label: "บริโภคนมแม่", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Yogurt: { label: "บริโภคโยเกิร์ต", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Thin_Porridge: { label: "บริโภคข้าวต้มเหลว", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Grain_Based_Foods: { label: "บริโภคอาหารธัญพืช", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Orange_Yellow_Foods: { label: "บริโภคผักเนื้อสีส้ม/เหลืองเข้ม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_White_Root_Foods: { label: "บริโภคอาหารประเภทหัวที่มีแป้งและเนื้อสีขาว", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Dark_Green_Leafy_Veggies: { label: "บริโภคผักใบเขียวเข้ม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Ripe_Mangoes_Papayas: { label: "บริโภคมะม่วง/มะละกอสุก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Fruits_Vegetables: { label: "บริโภคผลไม้/ผักอื่นๆ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Meat: { label: "บริโภคเนื้อสัตว์", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Eggs: { label: "บริโภคอาหารที่มีส่วนผสมของไข่", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Fish_Shellfish_Seafood: { label: "บริโภคอาหารทะเล", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Legumes_Nuts_Foods: { label: "บริโภคถั่ว", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Oil_Fats_Butter: { label: "บริโภคน้ำมัน/เนย", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Sugary_Foods: { label: "บริโภคของหวาน", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Chilies_Spices_Herbs: { label: "บริโภคเครื่องเทศ/สมุนไพร", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Grubs_Snails_Insects: { label: "บริโภคแมลง/หอยทาก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Solid_Semi_Solid_Food: { label: "บริโภคอาหารอื่นๆ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Salt: { label: "บริโภคอาหารที่มีเกลือผสม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Animal_Milk: { label: "บริโภคนมสัตว์", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Dairy_Products: { label: "บริโภคผลิตภัณฑ์ที่ทำจากนม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Given_Anything_to_Drink_in_First_6_Months: { label: "ดื่มของเหลวใน 6 เดือนแรก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Plain_Water: { label: "บริโภคน้ำเปล่า", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Juice_or_Juice_Drinks: { label: "บริโภคน้ำผลไม้", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Tea: { label: "บริโภคชา/คาเฟอีน", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Other_Liquids: { label: "บริโภคเครื่องดื่มอื่นๆ เช่น น้ำอัดลม", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Received_Vitamin_or_Mineral_Supplements: { label: "บริโภควิตามิน/แร่ธาตุ", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },
  Vitamin_A_Intake_First_8_Weeks: { label: "บริโภควิตามินเอใน 8 สัปดาห์แรก", values: { 0: "ไม่ได้บริโภค", 1: "บริโภค" } },

  // ✅ สุขอนามัย
  Sanitary_Disposal: { label: "ถ่ายอุจจาระถูกสุขลักษณะ", values: { 0: "ไม่ถูกสุขลักษณะ", 1: "ถูกสุขลักษณะ" } },
  Child_wash_hand_before_or_after_eating_food: { label: "เด็กล้างมือก่อน/หลังทานข้าว", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Child_wash_hand_before_or_after_visiting_the_toilet: { label: "เด็กล้างมือก่อน/หลังเข้าห้องน้ำ", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Mom_wash_hand_before_or_after_cleaning_children: { label: "แม่ล้างมือก่อน/หลังทำความสะอาดเด็ก", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },
  Mom_wash_hand_before_or_after_feeding_the_child: { label: "แม่ล้างมือก่อน/หลังให้อาหารเด็ก", values: { 0: "ไม่ล้างมือ", 1: "ล้างมือ" } },

  // ✅ number
  Infant_Formula_Intake_Count_Yesterday: { label: "จำนวนครั้งการบริโภคนมผงภายใน 1 วัน" },
  Breastfeeding_Count_DayandNight: { label: "จำนวนการบริโภคนมภายใน 1 วัน" },
  Received_Animal_Milk_Count: { label: "จำนวนครั้งที่ดื่มนมสัตว์ภายใน 1 วัน" },
  Received_Yogurt_Count: { label: "จำนวนครั้งบริโภคโยเกิร์ตภายใน 1 วัน" }
};

function normalizeTimestamp(ts) {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}




function Recomendation() {
  const [dotText, setDotText] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [topFeatures, setTopFeatures] = useState([]);
  const [globalAverages, setGlobalAverages] = useState({});
  const [privateNote, setPrivateNote] = useState("");
  const [publicNote, setPublicNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [weightHistory, setWeightHistory] = useState([]);   // ✅ ใส่ตรงนี้
  const [heightHistory, setHeightHistory] = useState([]);   // ✅ ใส่ตรงนี้
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const createdAt = location.state?.createdAt;
  const patient = location.state?.patient;
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [timestamps, setTimestamps] = useState([]);
  const [mostGlobalFeatures, setMostGlobalFeatures] = useState([]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/patients/${id}/records/timestamps`)
        .then(res => {
          setTimestamps(res.data); // เป็น array ของ created_at
        })
        .catch(err => console.error("❌ ดึง timestamps ไม่สำเร็จ:", err));
    }
  }, [id]);


  // ถ้าไม่มี createdAt และมี timestamps แล้ว → ดึง record ล่าสุด
  useEffect(() => {
    if (id && !createdAt && timestamps.length > 0) {
      const latest = normalizeTimestamp(timestamps[0]);
      setShapTime(latest);

      axios.get(`http://localhost:5000/patients/${id}/records`, {
        params: { created_at: latest }
      })
        .then((res) => {
          console.log("📦 record (ล่าสุด):", res.data);
          setRecord(res.data);
          setPrivateNote(res.data.private_note || "");
          setPublicNote(res.data.public_note || "");
        })
        .catch((err) => {
          console.error("❌ โหลด record ล่าสุดไม่สำเร็จ:", err);
        });
    }
  }, [id, createdAt, timestamps]);

  useEffect(() => {
    if (!record || !record.status) return;

    axios.get(`http://localhost:8000/shap/global/most/${record.status}`)
      .then(res => {
        const features = res.data?.top_features || [];

        setMostGlobalFeatures(features); // ✅ ยังเก็บไว้ใช้สำหรับตารางซ้าย

        // ✅ แยก top5 และ bottom5 ตามค่า max_shap
        const sortedDesc = [...features].sort((a, b) => b.max_shap - a.max_shap);
        const top5 = sortedDesc.slice(0, 5);

        const sortedAsc = [...features].sort((a, b) => a.max_shap - b.max_shap);
        const bottom5 = sortedAsc.slice(0, 5);

        setTopGlobalFeatures(top5);
        setBottomGlobalFeatures(bottom5);
      })
      .catch(() => {
        console.log("⚠️ ดึง SHAP global most ไม่สำเร็จ");
        setMostGlobalFeatures([]);
        setTopGlobalFeatures([]);
        setBottomGlobalFeatures([]);
      });
  }, [record]);

  useEffect(() => {
    if (timestamps.length > 0 && !shapTime) {
      setShapTime(timestamps[0]); // อันแรกคือล่าสุด เพราะ DESC
    }
  }, [timestamps]);

  const [showFullTable, setShowFullTable] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [topGlobalFeatures, setTopGlobalFeatures] = useState([]);
  const [bottomGlobalFeatures, setBottomGlobalFeatures] = useState([]);
  const [shapTime, setShapTime] = useState(null); // สำหรับเวลาที่จะส่งไป
  const normalizedTimestamps = timestamps.map(normalizeTimestamp);
  const normalizedShapTime = shapTime ? normalizeTimestamp(shapTime) : null;
  const combinedTimestamps = Array.from(new Set([...normalizedTimestamps, normalizedShapTime])).filter(Boolean);
  const sortedTimestamps = combinedTimestamps.sort((a, b) => new Date(b) - new Date(a));
  const statusMap = {
    Normal: "ปกติ",
    Obesity: "อ้วน",
    Overweight: "น้ำหนักมากเกินไป",
    SAM: "ภาวะทุพโภชนาการเฉียบพลันรุนแรง",
    Stunting: "แคระแกร็น",
    Underweight: "น้ำหนักน้อยเกินไป"
  };
  const [normalAverages, setNormalAverages] = useState({});
  useEffect(() => {
    if (id && shapTime) {
      axios.get(`http://localhost:8000/shap/local/${id}`, {
        params: { created_at: shapTime }
      })
        .then(res => {
          const sorted = res.data.top_features.sort((a, b) => b.shap - a.shap);
          setTopFeatures(sorted);
        })
        .catch(() => setTopFeatures([]));
    }
  }, [id, shapTime]);

  // // 👉 ดึง SHAP global จาก status ของ record
  // useEffect(() => {
  //   if (!record || !record.status) return;
  //   axios.get(`http://localhost:8000/shap/global/${record.status}`)
  //     .then(res => {
  //       const all = res.data.summary_by_feature || [];

  //       const sorted = [...all].sort((a, b) => b.mean_shap_at_mode - a.mean_shap_at_mode);
  //       const top5 = sorted.slice(0, 5);

  //       const bottom5 = [...all]
  //         .sort((a, b) => a.mean_shap_at_mode - b.mean_shap_at_mode)
  //         .slice(0, 5);

  //       setTopGlobalFeatures(top5);
  //       setBottomGlobalFeatures(bottom5);
  //     })
  //     .catch(() => console.log("⚠️ ดึง SHAP global ไม่สำเร็จ"));
  // }, [record]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:5000/patients/${id}/records/history`)
        .then((res) => {
          const historyData = res.data || [];
          console.log("📦 history data from API:", historyData);
          const weight = historyData
            .filter(item => item.weight && item.created_at)
            .map(item => {
              const parsedWeight = parseFloat(item.weight);
              return {
                date: item.created_at,  // <== เปลี่ยนตรงนี้
                weight: isNaN(parsedWeight) ? 0 : parsedWeight,
              };
            });

          const height = historyData
            .filter(item => item.height && item.created_at)
            .map(item => {
              const parsedHeight = parseFloat(item.height);
              return {
                date: item.created_at,  // <== เปลี่ยนตรงนี้
                height: isNaN(parsedHeight) ? 0 : parsedHeight,
              };
            });


          console.log("📊 weight array:", weight);
          console.log("📏 height array:", height);

          setWeightHistory(weight);
          setHeightHistory(height);
        })
        .catch(err => console.error("❌ ดึงประวัติกราฟไม่สำเร็จ:", err));
    }
  }, [id]);


  useEffect(() => {
    axios.get("http://localhost:8000/shap/only/normal")
      .then(res => {
        const normalData = res.data?.top_features || [];
        const map = {};
        normalData.forEach(item => {
          map[item.feature] = item.real_value_original ?? item.real_value;
        });
        setNormalAverages(map); // ✅ ใช้ state ใหม่
      })
      .catch(() => console.warn("⚠️ ดึง SHAP normal ไม่สำเร็จ"));
  }, []);


  const [selectedOption, setSelectedOption] = useState("ประวัติการตรวจครั้งอื่น");

  useEffect(() => {
    const allLoaded =
      record !== null &&
      topFeatures.length > 0 &&
      mostGlobalFeatures.length > 0 &&
      (topGlobalFeatures.length > 0 || bottomGlobalFeatures.length > 0) &&
      weightHistory.length > 0 &&
      heightHistory.length > 0 &&
      timestamps.length > 0;

    if (allLoaded) {
      setInitialLoading(false); // ✅ ปิด loading ได้เมื่อทุกอย่างเสร็จ
    }
  }, [
    record,
    topFeatures,
    mostGlobalFeatures,
    topGlobalFeatures,
    bottomGlobalFeatures,
    weightHistory,
    heightHistory,
    timestamps
  ]);


  useEffect(() => {
    if (id && createdAt) {
      // ➕ format datetime เป็น yyyy-MM-dd HH:mm:ss
      const dateObj = new Date(createdAt);
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dd = String(dateObj.getDate()).padStart(2, '0');
      const hh = String(dateObj.getHours()).padStart(2, '0');
      const mi = String(dateObj.getMinutes()).padStart(2, '0');
      const ss = String(dateObj.getSeconds()).padStart(2, '0');
      const formatted = `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;

      console.log("📌 createdAt formatted:", formatted);
      setShapTime(formatted);

      // ✅ ใช้ created_at นี้ในการดึง record เฉพาะรอบ
      axios.get(`http://localhost:5000/patients/${id}/records`, {
        params: { created_at: formatted }
      })
        .then((res) => {
          console.log("📦 record from created_at:", res.data);
          setRecord(res.data);
          setPrivateNote(res.data.private_note || "");
          setPublicNote(res.data.public_note || "");
        })

        .catch((err) => console.error("❌ โหลดข้อมูล record ไม่สำเร็จ:", err));
    }
  }, [id, createdAt]);

  useEffect(() => {
    if (id && !createdAt && timestamps.length > 0) {
      const latest = normalizeTimestamp(timestamps[0]); // ล่าสุด
      setShapTime(latest);

      axios.get(`http://localhost:5000/patients/${id}/records`, {
        params: { created_at: latest }
      })
        .then((res) => {
          setRecord(res.data);
          setPrivateNote(res.data.private_note || "");
          setPublicNote(res.data.public_note || "");
        })
        .catch((err) => {
          console.error("❌ โหลดข้อมูลล่าสุดไม่สำเร็จ:", err);
        });
    }
  }, [id, createdAt, timestamps]);


  useEffect(() => {
    if (id && shapTime) {
      setIsLoading(true); // 🌀 เริ่มโหลด

      const normalized = normalizeTimestamp(shapTime);
      // 🔁 โหลดข้อมูลผู้ป่วย ณ เวลานั้น
      axios.get(`http://localhost:5000/patients/${id}/records`, {
        params: { created_at: normalized }
      })
        .then((res) => {
          setRecord(res.data);

          // 🔁 โหลด SHAP local ใหม่
          return axios.get(`http://localhost:8000/shap/local/${id}`, {
            params: { created_at: shapTime }
          });
        })
        .then((res) => {
          const sorted = res.data.top_features.sort((a, b) => b.shap - a.shap);
          setTopFeatures(sorted);
        })
        .catch((err) => {
          console.error("❌ โหลดข้อมูล record หรือ SHAP ไม่สำเร็จ:", err);
          setRecord(null);
          setTopFeatures([]);
        })
        .finally(() => {
          setIsLoading(false); // ✅ จบโหลด
        });
    }
  }, [id, shapTime]);


  useEffect(() => {
    // เริ่มหมุนจุด ...
    const frames = ["", ".", "..", "..."];
    let index = 0;

    const interval = setInterval(() => {
      index = (index + 1) % frames.length;
      setDotText(frames[index]);
    }, 500); // ทุก 0.5 วิ

    return () => clearInterval(interval);
  }, []);

  if (initialLoading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #e0fff5, #f0fffc)',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Prompt', sans-serif"
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
          padding: '40px 30px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
          textAlign: 'center',
          animation: 'zoomIn 0.5s ease-out',
          minWidth: '320px'
        }}>
          <img
            src="/doctor-penguin.gif"
            alt="กำลังโหลด"
            style={{ width: 130, marginBottom: '20px' }}
          />
          <h2 style={{
            fontSize: '22px',
            fontWeight: '700',
            color: '#075e54',
            marginBottom: '10px'
          }}>
            กำลังโหลดผลการประเมิน
            <span style={{ marginLeft: 6 }}>{dotText}</span>
            <span style={{ visibility: 'hidden', marginLeft: 6 }}>...</span>
          </h2>
          <p style={{
            fontSize: '15px',
            color: '#444',
            lineHeight: '1.6'
          }}>
            กรุณารอสักครู่ ข้อมูลสุขภาพของผู้ป่วยกำลังมา...
          </p>
        </div>

        {/* CSS Animation */}
        <style>{`
          @keyframes zoomIn {
            0% {
              transform: scale(0.9);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }



  if (!patient) {
    return (
      <div style={{ padding: 20 }}>
        <h2>ไม่พบข้อมูลผู้ป่วย</h2>
        <p>กรุณากลับไปหน้าเดิมแล้วเลือกผู้ป่วยอีกครั้ง</p>
      </div>
    );
  }

  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsDropdownOpen(false);
  };

  const handleSaveNotes = () => {
    if (!id || !shapTime) return;  // ✅ ต้องมีเวลาที่ตรงกับใน DB
    setIsSaving(true);

    axios.put(`http://localhost:5000/patients/${id}/records/note`, {
      created_at: shapTime,  // ✅ ใช้เวลาที่ตรงกับ DB
      private_note: privateNote,
      public_note: publicNote
    })
      .then(() => {
        alert("✅ บันทึกสำเร็จแล้ว");
        return axios.get(`http://localhost:5000/patients/${id}/records`, {
          params: { created_at: shapTime }
        });
      })
      .then((res) => {
        setPrivateNote(res.data.private_note || "");
        setPublicNote(res.data.public_note || "");
      })
      .catch(() => {
        alert("❌ เกิดข้อผิดพลาดในการบันทึก");
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  // ✅ ใช้ topFeatures โดยตรง
  const displayedFeatures = showFullTable ? topFeatures : topFeatures.slice(0, 14);


  console.log("🧩 topFeatures:", topFeatures);
  console.log("🧮 displayedFeatures:", displayedFeatures);


  return (
    <div className="dashboard-container">
      <Header />
      <div className="recommendation-page">

        {/* Page Title */}
        <div className="recommendation-title">
          ดูผลลัพธ์การประเมินของผู้ป่วย
        </div>

        {isLoading && (
          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '18px', color: '#888' }}>
            🔄 กำลังโหลดข้อมูล...
          </div>
        )}


        {/* Patient Info + Graph */}
        <div className="recommendation-patient-wrapper">

          {/* ซ้าย: Patient Section */}
          <div className="recommendation-patient-section">


            {/* ซ้าย: รูป + ชื่อ + ปุ่ม */}
            <div className="patient-profile">
              <div className="patient-health-badge">ข้อมูลสุขภาพ</div>
              <div className="patient-date">
                วันที่ {shapTime ? new Date(shapTime).toLocaleString('th-TH', { dateStyle: 'long', timeStyle: 'short' }) : "--"}
              </div>




              <img
                src={Sunglasscat}
                alt="Patient Avatar"
                className="patient-icon-image"
              />

              <div className="patient-name-large">{patient.name || "ไม่ทราบชื่อ"}</div>



            </div>

            {/* ขวา: Grid 2 columns */}
            <div className="patient-main-info">

              <div className="patient-info-grid-two">
                <div className="info-card">
                  <div className="label">HN:</div>
                  <div className="value">{record?.hn_number || "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">เพศ:</div>
                  <div className="value">{patient.gender || "--"}</div>
                </div>
                <div className="info-card">
                  <div className="label">อายุ:</div>
                  <div className="value">{patient.age || "--"}</div>
                </div>
                <div className="info-card">
                  <div className="label">น้ำหนัก:</div>
                  <div className="value">{record?.weight ? `${record.weight} กก.` : "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">ส่วนสูง:</div>
                  <div className="value">{record?.height ? `${record.height} ซม.` : "--"}</div>
                </div>

                <div className="info-card">
                  <div className="label">โรคประจำตัว:</div>
                  <div className="value">{record?.congenital_disease || "--"}</div>
                </div>

              </div>

            </div>

          </div>


          {/* ขวา: Graph */}
          <WeightChart data={weightHistory} />
          <HeightChart data={heightHistory} />

        </div>

        {/* Action Buttons */}
        {/* ✅ Dropdown ด้านซ้าย */}

        <div className="recommendation-action-buttons">
          <div className="dropdown-wrapper">
            <select
              className="recommendation-dropdown"
              value={shapTime || ""}
              onChange={(e) => setShapTime(e.target.value)}
            >
              <option value="">-- เลือกวันที่และเวลา --</option>

              {sortedTimestamps.map((ts, idx) => (
                <option
                  key={idx}
                  value={ts}
                  style={{
                    backgroundColor: shapTime === ts ? "#d1fae5" : "white", // ✅ เขียวอ่อนถ้าเลือกอยู่
                  }}
                >
                  {new Date(ts).toLocaleString("th-TH")}
                </option>
              ))}
            </select>


          </div>

        </div>

        {/* Assessment Status */}
        {record?.status && (
          <div className="recommendation-status">
            <div className="status-text">
              อยู่ในเกณฑ์ : {statusMap[record?.status?.split(" ")[0]] || record.status}
            </div>


            <div className="status-subtext">Assessment Status</div>
          </div>
        )}

        {/* ผลการตรวจ Section */}
        <div className="recommendation-result-section">

          <div className="result-header-row">
            <div className="result-title">ผลการตรวจ :</div>

            <div className="allergy-card-group">
              <div className="allergy-card food">
                <div className="allergy-label">แพ้อาหาร:</div>
                <div className="allergy-value">{record?.Food_allergy || "ไม่มี"}</div>
              </div>

              <div className="allergy-card drug">
                <div className="allergy-label">แพ้ยา:</div>
                <div className="allergy-value">{record?.drug_allergy || "ไม่มี"}</div>
              </div>
            </div>
          </div>

          {/* Wrapper → 2 ตาราง */}
          <div className="result-table-wrapper">

            {/* ตารางซ้าย (3/4) */}
            <div className="result-table-block left">
              <table className="result-table">
                <thead>
                  <tr>
                    <th>ข้อมูล</th>
                    <th>พฤติกรรมของผู้ป่วย</th>
                    <th>ค่ามาตรฐานของเด็กภาวะปกติ</th>
                    <th>คำแนะนำ</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFeatures.map((item, index) => {
                    // ✅ แปลงชื่อ feature
                    const featureLabel = valueMap[item.feature]?.label || item.feature;

                    // ✅ ใช้ real_value (ค่าเดิมที่แปลงกลับจาก scaler)
                    const realValue = item.real_value;

                    // ✅ แปลค่าผู้ป่วยด้วย valueMap ถ้ามี
                    const patientValue =
                      valueMap[item.feature]?.values?.[realValue] ?? realValue;

                    // ✅ หาค่ามาตรฐานจาก globalAverages
                    // ✅ ใช้ globalAverages ที่ดึงมาจาก /shap/normal มาแทนค่ามาตรฐาน
                    let normalRaw = normalAverages[item.feature];

                    // ✅ พยายาม parse เป็นตัวเลข (รองรับกรณีค่ามาตรฐานเป็น float จาก scaler แล้ว invert)
                    if (normalRaw !== undefined && typeof normalRaw === 'string' && !isNaN(normalRaw)) {
                      normalRaw = parseFloat(normalRaw);
                    }

                    // ✅ แปลงค่ามาตรฐานเป็นภาษาไทย ถ้ามีใน valueMap
                    const standardValue =
                      valueMap[item.feature]?.values?.[String(normalRaw)] ??
                      valueMap[item.feature]?.values?.[normalRaw] ??
                      normalRaw ?? "--";


                    console.log("🧪 Feature Mapping Debug", {
                      feature: item.feature,
                      standardRaw: normalRaw,
                      patientValue,
                      valueMap: valueMap[item.feature]?.values,
                      mappedStandardValue: valueMap[item.feature]?.values?.[String(normalRaw)],
                    });


                    return (
                      <tr key={index}>
                        <td>{featureLabel}</td>
                        <td><span className="badge">{patientValue}</span></td>
                        <td><span className="badge-green">{standardValue}</span></td>
                        <td>
                          {(() => {
                            const normalVal = normalAverages[item.feature];
                            const globalFeature = mostGlobalFeatures.find(f => f.feature === item.feature);
                            const globalVal = globalFeature?.real_value_original;
                            const shap = item.shap;
                            const status = record?.status;
                            const statusName = statusMap[status?.split(" ")[0]] || status;

                            const featureLabel = valueMap[item.feature]?.label || item.feature;
                            const patientValue = valueMap[item.feature]?.values?.[realValue] ?? realValue;
                            const standardValueText = valueMap[item.feature]?.values?.[String(normalVal)] ?? valueMap[item.feature]?.values?.[normalVal] ?? normalVal;

                            const isStringStandard = typeof standardValueText === "string";
                            let msg = "";

                            // 🧠 1. เปรียบเทียบกับ global
                            if (
                              normalVal !== undefined &&
                              globalVal !== undefined &&
                              Number(normalVal) === Number(globalVal)
                            ) {
                              msg = <span style={{ color: "#FF0033" }}>ควรพิจารณาร่วมกับข้อมูลอื่น</span>;
                            }

                            // 🧠 2. คำแนะนำจาก shap
                            let shapNote = "";
                            if (shap > 0) {
                              shapNote = <>ส่งผลให้เป็น <span style={{ color: "#007bff" }}>{statusName}</span></>;
                            } else if (shap < 0) {
                              shapNote = <>ส่งผลให้ไม่เป็น <span style={{ color: "#007bff" }}>{statusName}</span></>;
                            } else {
                              shapNote = <>ไม่ส่งผลต่อ <span style={{ color: "#007bff" }}>{statusName}</span></>;
                            }

                            // 🧠 3. คำแนะนำจากการเปรียบเทียบพฤติกรรม
                            let behaviorNote = "";
                            if (isStringStandard) {
                              // → เป็นค่าข้อความ เช่น "บริโภค"
                              if (patientValue === standardValueText) {
                                behaviorNote = "ผู้ป่วยได้ปฏิบัติตามมาตรฐาน";
                              } else {
                                behaviorNote = "ผู้ป่วยไม่ได้ปฏิบัติตามมาตรฐาน";
                              }
                            } else {
                              const numericPatient = Number(realValue);
                              const numericStandard = Number(normalVal);

                              if (numericPatient < numericStandard) {
                                behaviorNote = `ควรบริโภค ${featureLabel} เพิ่มขึ้น`;
                              } else if (numericPatient > numericStandard) {
                                behaviorNote = `ควรบริโภค ${featureLabel} ลดลง`;
                              } else {
                                behaviorNote = `ผู้ป่วยปฏิบัติตามค่ามาตรฐานของเด็กปกติ`;
                              }
                            }

                            return (
                              <>
                                {behaviorNote} <br />
                                {shapNote} <br />
                                {msg && <span style={{ fontStyle: "italic", color: "#888" }}>{msg}</span>}
                              </>
                            );
                          })()}


                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </table>

              {/* ปุ่ม toggle */}
              <div style={{ margin: '16px 0', textAlign: 'center' }}>
                <button
                  className="recommendation-action-btn"
                  onClick={() => setShowFullTable(!showFullTable)}
                >
                  {showFullTable ? 'ซ่อนเพิ่มเติม' : 'แสดงเพิ่มเติม'}
                </button>
              </div>
            </div>

            {/* ตารางขวา (1/4) */}
            <div className="result-table-block right">
              <table className="result-table pro-table">
                <thead>
                  <tr>
                    <th>
                      <span
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          width: 23,
                          height: 23,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 8,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                        }}
                      >
                        <Stethoscope size={16} color="#16a34a" />
                      </span>
                      ปัจจัยเสี่ยงของเด็กที่เป็นภาวะ
                      <span> {statusMap[record?.status?.split(" ")[0]] || record?.status}</span>
                    </th>

                    <th>
                      <span
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                          width: 23,
                          height: 23,
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 8,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)"
                        }}
                      >
                        <ListChecks size={16} color="#0ea5e9" />
                      </span>
                      ค่าของข้อมูล
                    </th>


                  </tr>
                </thead>
                <tbody>
                  {/* 🔼 หัวข้อ Top 5 */}
                  <tr className="section-header top-header">
                    <td colSpan="2">
                      <TrendingUp size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Top 5 พฤติกรรมเสี่ยงที่ส่งผลต่อเด็กที่มีภาวะ
                      <span> {statusMap[record?.status?.split(" ")[0]] || record?.status} </span>
                    </td>
                  </tr>
                  {topGlobalFeatures.map((item, index) => {
                    const featureName = valueMap[item.feature]?.label || item.feature;
                    const modeVal = item.real_value_original ?? item.real_value ?? "--";
                    const translatedMode =
                      valueMap[item.feature]?.values?.[String(modeVal)] ??
                      valueMap[item.feature]?.values?.[modeVal] ??
                      modeVal;

                    return (
                      <tr key={`top-${index}`} className="top-row">
                        <td><span className="arrow-up">↑</span> {featureName}</td>
                        <td><span className="value-badge">{translatedMode}</span></td>
                      </tr>
                    );
                  })}

                  {/* 🔽 หัวข้อ Bottom 5 */}
                  <tr className="section-header bottom-header">
                    <td colSpan="2">
                      <TrendingDown size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Top 5 ปัจจัยที่ป้องกันไม่ให้เป็นภาวะ
                      <span> {statusMap[record?.status?.split(" ")[0]] || record?.status} </span>
                    </td>
                  </tr>
                  {bottomGlobalFeatures.map((item, index) => {
                    const featureName = valueMap[item.feature]?.label || item.feature;
                    const modeVal = item.real_value_original ?? item.real_value ?? "--";
                    const translatedMode =
                      valueMap[item.feature]?.values?.[String(modeVal)] ??
                      valueMap[item.feature]?.values?.[modeVal] ??
                      modeVal;

                    return (
                      <tr key={`bottom-${index}`} className="bottom-row">
                        <td><span className="arrow-down">↓</span> {featureName}</td>
                        <td><span className="value-badge">{translatedMode}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>


              <div className="recommendation-feedback-section">
                <div className="feedback-title">📌 ข้อเสนอแนะสำหรับผู้ปกครอง</div>
                <textarea
                  className="feedback-textarea"
                  value={publicNote}
                  onChange={(e) => setPublicNote(e.target.value)}
                  placeholder="ข้อเสนอแนะที่ผู้ปกครองควรทราบ..."
                  rows="3"
                />

                <div className="feedback-title">🔒 บันทึกส่วนตัวสำหรับหมอ</div>
                <textarea
                  className="feedback-textarea"
                  value={privateNote}
                  onChange={(e) => setPrivateNote(e.target.value)}
                  placeholder="บันทึกเฉพาะแพทย์ เช่น รายละเอียดการประเมิน..."
                  rows="3"
                />

                <button className="feedback-submit-btn" onClick={handleSaveNotes}>
                  💾 บันทึกข้อเสนอแนะ
                </button>
              </div>


            </div>

          </div> {/* end .result-table-wrapper */}

        </div> {/* end .recommendation-result-section */}

      </div> {/* end .recommendation-page */}
      <Footer />
    </div >
  );
}

export default Recomendation;
