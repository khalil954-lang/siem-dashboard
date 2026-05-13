import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

function Analytics() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const res = await fetch("/wazuh-alerts-4.x-*/_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("admin:jxv9v6Jq.1M6BZgQiNQ6T0m3vym+D0x+")
          },
          body: JSON.stringify({
            size: 100,
            _source: ["@timestamp", "rule.description"],
            sort: [{ "@timestamp": { order: "asc" } }],
            query: { match_all: {} }
          })
        });

        const data = await res.json();

        // Group alerts by hour
        const counts = {};
        data.hits.hits.forEach(hit => {
          const time = new Date(hit._source["@timestamp"]);
          const hour = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          counts[hour] = (counts[hour] || 0) + 1;
        });

        setChartData({
          labels: Object.keys(counts),
          datasets: [
            {
              label: "Alerts over time",
              data: Object.values(counts),
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.2)",
              fill: true,
              tension: 0.3
            }
          ]
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    // First fetch
    fetchChartData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchChartData, 30000);

    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);

  const totalAlerts = chartData
    ? chartData.datasets[0].data.reduce((sum, value) => sum + value, 0)
    : 0;
  const peakIndex = chartData
    ? chartData.datasets[0].data.indexOf(Math.max(...chartData.datasets[0].data))
    : -1;
  const peakTime = peakIndex >= 0 && chartData ? chartData.labels[peakIndex] : "N/A";

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Analytics</h2>
          <p className="subtitle">Alert volume trends across monitored endpoints</p>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Alerts over time</h3>
          {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
        </div>

        <div className="metrics-sidebar">
          <div className="metric-card">
            <h3>Total Alerts</h3>
            <div className="metric-value">
              <span className="number">{totalAlerts}</span>
            </div>
            <p className="metric-desc">Total records in the current chart window</p>
          </div>
          <div className="metric-card">
            <h3>Peak Time</h3>
            <div className="metric-value">
              <span className="number" style={{ fontSize: "1.5rem" }}>
                {peakTime}
              </span>
            </div>
            <p className="metric-desc">Highest alert count interval</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
