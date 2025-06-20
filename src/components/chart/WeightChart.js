import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import './WeightChart.css';

function WeightChart({ data = [] }) {
  const currentWeight = data.length > 0 ? data[data.length - 1].weight : 0;

  return (
    <div className="weight-chart-container">
      <div className="weight-chart-title">📊 กราฟน้ำหนัก (กิโลกรัม)</div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(dateStr) =>
                new Date(dateStr).toLocaleDateString('th-TH', {
                  day: '2-digit',
                  month: 'short',
                })
              }
            />
            <YAxis domain={[0, 'dataMax + 5']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="weight"
              stroke="#007bff"
              strokeWidth={3}
              dot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="current-weight-label">
        น้ำหนักปัจจุบัน<br />
        <span className="current-weight-value">{currentWeight.toFixed(1)} กก.</span>
      </div>
    </div>
  );
}

export default WeightChart;
