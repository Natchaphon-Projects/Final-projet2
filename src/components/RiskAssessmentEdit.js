import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RiskAssessmentEdit.css";
import sadFace from "../assets/sad.png";
import happyFace from "../assets/happiness.png";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

function RiskAssessmentEdit() {
  const navigate = useNavigate();
  const [patientName] = useState("ศุวิชญ์ หนูวงศ์");
  const [formData, setFormData] = useState({
    Sex: 0,
    Age: 30,
    Height: 165,
    Weight: 60,
    Continent: 1,
    National_Income: 2,
    Status: 1,
    Dietary_intakes_National: 1,
    Dietary_intakes_Fruit_G: 150,
    Dietary_intakes_Vegetables_G: 200,
    Dietary_intakes_Legumes_G: 50,
    Dietary_intakes_Nuts_G: 20,
    Dietary_intakes_Whole_grains_G: 100,
    Dietary_intakes_Fish_G: 80,
    Dietary_intakes_Dairy_G: 200,
    Dietary_intakes_Red_meat_G: 100,
    Basic_Water: 95,
    At_Least_Basic_Water: 90,
    Safely_Managed_Water: 85,
    Limited_Water: 10,
    Unimproved_Water: 5,
    Surface_Water: 0,
    Basic_Sanitation: 90,
    At_Least_Basic_Sanitation: 85,
    Safely_Managed_Sanitation: 80,
    Limited_Sanitation: 10,
    Unimproved_Sanitation: 5,
    Open_Defecation: 0,
  });

  const [result, setResult] = useState(null);
  const [shapValues, setShapValues] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getFeatureExplanation = (feature, value) => {
    const explanations = {
      Age: "อายุมากขึ้นอาจเพิ่มความเสี่ยงภาวะโภชนาการผิดปกติ",
      Weight: "น้ำหนักมากอาจเพิ่มโอกาสเป็นโรคอ้วน",
      Height: "ความสูงสัมพันธ์กับดัชนีมวลกายที่ดีขึ้น",
      Dietary_intakes_Dairy_G: "การบริโภคนมช่วยให้ร่างกายได้รับแคลเซียม",
      Dietary_intakes_Fruit_G: "ผลไม้ช่วยเสริมวิตามิน แต่ยังบริโภคไม่เพียงพอ",
      Dietary_intakes_Vegetables_G: "การรับประทานผักช่วยลดภาวะขาดสารอาหาร",
    };
    return explanations[feature] || "ฟีเจอร์นี้มีผลต่อผลลัพธ์ของโมเดล";
  };

  const fieldLabels = {
    Sex: "เพศ (0 = หญิง, 1 = ชาย)",
    Age: "อายุ (ปี)",
    Height: "ส่วนสูง (ซม.)",
    Weight: "น้ำหนัก (กก.)",
    Continent: "ทวีป",
    National_Income: "รายได้ประเทศ",
    Status: "สถานะโภชนาการ",
    Dietary_intakes_National: "อาหารทั่วไป",
    Dietary_intakes_Fruit_G: "ผลไม้ (กรัม)",
    Dietary_intakes_Vegetables_G: "ผัก (กรัม)",
    Dietary_intakes_Legumes_G: "ถั่วฝัก (กรัม)",
    Dietary_intakes_Nuts_G: "ถั่วเปลือกแข็ง (กรัม)",
    Dietary_intakes_Whole_grains_G: "ธัญพืชเต็มเมล็ด (กรัม)",
    Dietary_intakes_Fish_G: "ปลา (กรัม)",
    Dietary_intakes_Dairy_G: "นม (กรัม)",
    Dietary_intakes_Red_meat_G: "เนื้อแดง (กรัม)",
    Basic_Water: "น้ำขั้นพื้นฐาน (%)",
    At_Least_Basic_Water: "น้ำขั้นต่ำ (%)",
    Safely_Managed_Water: "น้ำปลอดภัย (%)",
    Limited_Water: "น้ำจำกัด (%)",
    Unimproved_Water: "น้ำไม่ได้ปรับปรุง (%)",
    Surface_Water: "น้ำผิวดิน (%)",
    Basic_Sanitation: "สุขาภิบาลพื้นฐาน (%)",
    At_Least_Basic_Sanitation: "สุขาภิบาลขั้นต่ำ (%)",
    Safely_Managed_Sanitation: "สุขาภิบาลปลอดภัย (%)",
    Limited_Sanitation: "สุขาภิบาลจำกัด (%)",
    Unimproved_Sanitation: "สุขาภิบาลไม่ได้ปรับปรุง (%)",
    Open_Defecation: "ถ่ายในที่โล่ง (%)",
  };

  const importantFeatures = [
    "Age",
    "Height",
    "Weight",
    "Dietary_intakes_Fruit_G",
    "Dietary_intakes_Vegetables_G",
    "Dietary_intakes_Dairy_G",
  ];

  const standardValues = {
    Sex: 0,
    Age: 30,
    Height: 165,
    Weight: 60,
    Continent: 1,
    National_Income: 2,
    Status: 1,
    Dietary_intakes_National: 1,
    Dietary_intakes_Fruit_G: 300,
    Dietary_intakes_Vegetables_G: 300,
    Dietary_intakes_Legumes_G: 50,
    Dietary_intakes_Nuts_G: 30,
    Dietary_intakes_Whole_grains_G: 150,
    Dietary_intakes_Fish_G: 100,
    Dietary_intakes_Dairy_G: 250,
    Dietary_intakes_Red_meat_G: 70,
    Basic_Water: 90,
    At_Least_Basic_Water: 85,
    Safely_Managed_Water: 80,
    Limited_Water: 10,
    Unimproved_Water: 5,
    Surface_Water: 0,
    Basic_Sanitation: 90,
    At_Least_Basic_Sanitation: 85,
    Safely_Managed_Sanitation: 80,
    Limited_Sanitation: 10,
    Unimproved_Sanitation: 5,
    Open_Defecation: 0,
  };

  const getChartData = (features) => ({
    labels: features.map((f) => fieldLabels[f] || f),
    datasets: [
      {
        label: "ข้อมูลพื้นฐาน",
        data: features.map((f) => formData[f]),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
      {
        label: "ค่ามาตรฐาน",
        data: features.map((f) => standardValues[f] || 0),
        backgroundColor: "rgba(192, 75, 75, 0.6)",
      },
    ],
  });

  const getSHAPChartData = () => {
    if (!shapValues) return null;
    const labels = Object.keys(shapValues).map((key) => fieldLabels[key] || key);
    const values = Object.values(shapValues);

    return {
      labels,
      datasets: [
        {
          label: "ผลกระทบต่อการทำนาย (SHAP)",
          data: values,
          backgroundColor: values.map((val) =>
            val >= 0 ? "rgba(255, 99, 132, 0.6)" : "rgba(75, 192, 192, 0.6)"
          ),
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: {
        display: true,
        text: "เปรียบเทียบค่ากับค่ามาตรฐาน",
      },
      datalabels: {
        anchor: "end",
        align: "top",
        formatter: (val) => (val < 5 ? "" : val.toFixed(1)),
        font: { size: 10 },
      },
    },
    scales: {
      y: {
        type: "logarithmic",
        beginAtZero: true,
        min: 1,
        ticks: {
          callback: function (value) {
            return Number(value).toLocaleString();
          },
        },
      },
    },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === "" ? 0 : parseFloat(value) });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/prediction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.prediction) {
        setResult(data);

        const simulatedSHAP = {
          Age: 0.1,
          Weight: 0.25,
          Height: -0.1,
          Dietary_intakes_Dairy_G: -0.2,
          Dietary_intakes_Fruit_G: 0.05,
          Dietary_intakes_Vegetables_G: -0.15,
        };
        setShapValues(simulatedSHAP);
      } else {
        console.error("Error:", data.error);
        setResult("error");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setResult("error");
    }
  };

  return (
    <div className="risk-assessment-edit-container">
      <div className="patient-header">
        <h1 className="page-title">แบบฟอร์มประเมินผู้ป่วย</h1>
        <p className="patient-name">
          ชื่อผู้ป่วย: <strong>{patientName}</strong>
        </p>
      </div>

      <div className="assessment-grid">
        <div className="patient-info-section">
          <form>
            {Object.keys(formData).map((key) => (
              <div className="form-row" key={key}>
                <label>{fieldLabels[key] || key}:</label>
                <input
                  type="number"
                  name={key}
                  value={formData[key]}
                  placeholder={`กรอก ${fieldLabels[key] || key}`}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="action-buttons">
              <button
                type="button"
                className="evaluate-button"
                onClick={handleSubmit}
              >
                ประเมินอีกครั้ง
              </button>
              <button
                type="button"
                className="action-button back-button"
                onClick={() => navigate("/doctor-dashboard")}
              >
                ย้อนกลับ
              </button>
            </div>
          </form>
        </div>

        <div className="evaluation-section">
          <h3>ผลการประเมิน</h3>
          {result && result.prediction && (
            <div className={`result-card result ${result.prediction.toLowerCase()}`}>
              <p className="result-text">{result.prediction}</p>
              <img
                src={result.prediction === "Normal" ? happyFace : sadFace}
                alt={result.prediction}
                className="result-icon"
              />
            </div>
          )}

          <div style={{ marginTop: "2rem" }}>
            <button
              onClick={() => setShowModal(true)}
              style={{
                marginBottom: "10px",
                padding: "6px 12px",
                backgroundColor: "#4da6ff",
                border: "none",
                color: "white",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              ดูฟีเจอร์ทั้งหมดในกราฟ
            </button>
            <Bar data={getChartData(importantFeatures)} options={chartOptions} />
          </div>

          {shapValues && (
            <div className="xai-container">
              <div className="xai-description">
                <h4>คำอธิบายผลการทำนาย</h4>
                <p>
                  กราฟด้านล่างแสดงผลกระทบของแต่ละฟีเจอร์ต่อการทำนายของระบบ<br />
                  <strong>ค่าบวก</strong> (สีชมพู): เพิ่มความเสี่ยง | <strong>ค่าลบ</strong> (สีฟ้า): ลดความเสี่ยง<br />
                  ยิ่งแถบยาว อิทธิพลของฟีเจอร์นั้นยิ่งมาก
                </p>
              </div>

              <div className="xai-graph">
                <h4>ฟีเจอร์ที่มีผลต่อการทำนาย (จำลอง)</h4>
                <Bar
                  data={getSHAPChartData()}
                  options={{
                    indexAxis: "y",
                    plugins: {
                      title: {
                        display: true,
                        text: "SHAP: ผลกระทบของแต่ละฟีเจอร์ต่อผลลัพธ์",
                      },
                      legend: { display: false },
                    },
                    scales: {
                      x: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>

              <div className="text-explanation-box">
                {Object.entries(shapValues).map(([feature, value]) => (
                  <p key={feature}>
                    <strong>{fieldLabels[feature] || feature} ({value >= 0 ? "+" : ""}{value.toFixed(2)}):</strong>{" "}
                    {getFeatureExplanation(feature, value)}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: "2rem", display: "flex", gap: "10px" }}>
            <button className="back-button" onClick={() => navigate("/doctor-dashboard")}>กลับหน้าแดชบอร์ด</button>
            <button className="back-button" onClick={() => navigate("/patient-history")}>ดูประวัติผู้ป่วย</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              style={{ float: "right", background: "red", color: "white" }}
              onClick={() => setShowModal(false)}
            >
              ปิด
            </button>
            <Bar data={getChartData(Object.keys(formData))} options={chartOptions} />
          </div>
        </div>
      )}
    </div>
  );
}

export default RiskAssessmentEdit;