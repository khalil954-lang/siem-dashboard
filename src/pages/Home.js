import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Mock data
const chartData = {
  labels: ["192.168.1.100", "192.168.1.101", "192.168.1.102"],
  datasets: [
    {
      label: "Attacks",
      data: [5, 3, 8],
      backgroundColor: "#4a90e2",
    },
  ],
};

const stats = [
  { label: "Total Alerts", value: 16, color: "#4a90e2" },
  { label: "High", value: 6, color: "#e74c3c" },
  { label: "Medium", value: 5, color: "#f39c12" },
  { label: "Low", value: 5, color: "#2ecc71" },
];

function Home() {
  return (
    <div>
      <div className="section-header">
        <div>
          <h2>SIEM Dashboard</h2>
          <p className="subtitle">Real-time security monitoring</p>
        </div>
      </div>

      <div className="agents-grid">
        {stats.map((item, index) => (
          <div key={index} className="agent-card">
            <div className="detail-row">
              <span className="label">{item.label}</span>
              <span className="value" style={{ color: item.color }}>
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="chart-card" style={{ marginTop: "24px" }}>
        <h3>Top Attacking IPs</h3>
        <Bar data={chartData} />
      </div>
    </div>
  );
}

export default Home;
