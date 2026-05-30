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
  // On ajoute un nouveau "state" pour mémoriser le filtre choisi (par défaut 24h)
  const [timeRange, setTimeRange] = useState("24h");

  useEffect(() => {
    async function fetchChartData() {
      // On configure les paramètres en fonction du choix dans le menu déroulant
      let gte = "now-24h";
      let interval = "1h"; // Intervalle entre les points sur le graphique

      if (timeRange === "15m") { gte = "now-15m"; interval = "1m"; } // Précision à la minute
      else if (timeRange === "1h") { gte = "now-1h"; interval = "5m"; } // Précision 5 minutes
      else if (timeRange === "12h") { gte = "now-12h"; interval = "30m"; } // Précision 30 minutes
      else if (timeRange === "24h") { gte = "now-24h"; interval = "1h"; } // Précision 1 heure
      else if (timeRange === "7d") { gte = "now-7d"; interval = "24h"; } // Précision par jour

      try {
        const res = await fetch("/wazuh-alerts-4.x-*/_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("admin:Newpassword123?") // test creds
          },
          body: JSON.stringify({
            size: 0,
            query: {
              bool: {
                filter: [
                  {
                    range: {
                      timestamp: { // Ou "@timestamp" selon ta DB
                        gte: gte,
                        lte: "now"
                      }
                    }
                  }
                ]
              }
            },
            aggs: {
              alertes_par_heure: {
                date_histogram: {
                  field: "timestamp", // Ou "@timestamp"
                  fixed_interval: interval, // On utilise la précision calculée en haut !
                  time_zone: "Europe/Paris"
                }
              }
            }
          })
        });

        const data = await res.json();
        const buckets = data.aggregations?.alertes_par_heure?.buckets || [];
        
        const labels = [];
        const dataPoints = [];

        buckets.forEach(bucket => {
          const time = new Date(bucket.key_as_string);
          let labelStr = "";

          // Si on regarde sur une semaine, on affiche "jour/mois" sinon "Heure:Minute"
          if (timeRange === "7d") {
            labelStr = time.toLocaleDateString([], { day: "2-digit", month: "short" });
          } else {
            labelStr = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          }
          
          labels.push(labelStr);
          dataPoints.push(bucket.doc_count);
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Alerts",
              data: dataPoints,
              borderColor: "#d11a2a",
              backgroundColor: "rgba(209, 26, 42, 0.2)",
              fill: true,
              tension: 0.3
            }
          ]
        });
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchChartData();
    const intervalId = setInterval(fetchChartData, 30000);

    return () => clearInterval(intervalId);
  }, [timeRange]); // TRÈS IMPORTANT: ça dit à React de relancer le graph quand timeRange change

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
          <p className="subtitle">Tendances du volume d'alertes sur les points de contrôle</p>
        </div>
        {/* LE NOUVEAU MENU DÉROULANT EST ICI */}
        <div>
          <select 
            className="filter-select" 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", cursor: "pointer" }}
          >
            <option value="15m">Dernières 15 minutes</option>
            <option value="1h">Dernière 1 heure</option>
            <option value="12h">Dernières 12 heures</option>
            <option value="24h">Dernières 24 heures</option>
            <option value="7d">Derniers 7 jours</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>Alertes par rapport au temps</h3>
          {chartData ? <Line data={chartData} /> : <p>Loading chart...</p>}
        </div>

        <div className="metrics-sidebar">
          <div className="metric-card">
            <h3>Alertes Totales</h3>
            <div className="metric-value">
              <span className="number">{totalAlerts}</span>
            </div>
            <p className="metric-desc">Les alertes totales dans la fenêtre du graphique</p>
          </div>
          <div className="metric-card">
            <h3>Heure de Pointe</h3>
            <div className="metric-value">
              <span className="number" style={{ fontSize: "1.5rem" }}>
                {peakTime}
              </span>
            </div>
            <p className="metric-desc">L'heure avec le plus grand nombre d'alertes</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;