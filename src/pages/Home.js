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

      {/* 🔥 HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <h1>SIEM Dashboard</h1>
        <p style={{ color: "gray" }}>Real-time security monitoring</p>
      </div>

      {/* 🔥 CARDS */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "20px",
        marginBottom: "30px"
      }}>
        {stats.map((item, index) => (
          <div
            key={index}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}
          >
            <h4 style={{ color: "gray" }}>{item.label}</h4>
            <h2 style={{ color: item.color }}>{item.value}</h2>
          </div>
        ))}
      </div>

      {/* 🔥 GRAPH */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
      }}>
        <h3 style={{ marginBottom: "15px" }}>Top Attacking IPs</h3>
        <Bar data={chartData} />
      </div>

    </div>
  );
}

export default Home;