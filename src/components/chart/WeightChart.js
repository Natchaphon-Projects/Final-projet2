// WeightChart.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './WeightChart.css';  // สำหรับแต่งหัวข้อ กับน้ำหนักปัจจุบัน

const data = [
  { month: 'ม.ค.', weight: 11 },
  { month: 'ก.พ.', weight: 11.5 },
  { month: 'มี.ค.', weight: 12 },
  { month: 'เม.ย.', weight: 12.3 },
  { month: 'พ.ค.', weight: 12.7 },
  { month: 'มิ.ย.', weight: 13 },
];

function WeightChart() {
  const currentWeight = data[data.length - 1].weight;

  return (
    <div className="weight-chart-container">
      <div className="weight-chart-title">📊 กราฟน้ำหนัก (กิโลกรัม)</div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis domain={[0, 16]} />
          <Tooltip />
          <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="current-weight-label">
        น้ำหนักปัจจุบัน<br />
        <span className="current-weight-value">{currentWeight.toFixed(1)} กก.</span>
      </div>
    </div>
  );
}

export default WeightChart;
