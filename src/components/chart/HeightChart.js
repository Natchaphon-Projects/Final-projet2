// HeightChart.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './HeightChart.css';  // ใช้ไฟล์ CSS ใหม่

const data = [
  { month: 'ม.ค.', height: 75 },
  { month: 'ก.พ.', height: 76 },
  { month: 'มี.ค.', height: 77.2 },
  { month: 'เม.ย.', height: 78 },
  { month: 'พ.ค.', height: 79.5 },
  { month: 'มิ.ย.', height: 80.3 },
];

function HeightChart() {
  const currentHeight = data[data.length - 1].height;

  return (
    <div className="height-chart-container">
      <div className="height-chart-title">📏 กราฟส่วนสูง (เซนติเมตร)</div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[70, 100]} />
          <Tooltip />
          <Line type="monotone" dataKey="height" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="current-height-label">
        ส่วนสูงปัจจุบัน<br />
        <span className="current-height-value">{currentHeight.toFixed(1)} ซม.</span>
      </div>
    </div>
  );
}

export default HeightChart;
