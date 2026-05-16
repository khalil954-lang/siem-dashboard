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
            "Authorization": "Basic " + btoa("admin:Newpassword123?")
          },
                    body: JSON.stringify({
            // On ne veut pas récupérer tout le texte des logs (ça ralentirait), on veut juste compter
            size: 0, 
            query: {
              bool: {
                filter: [
                  // Le filtre temporel (les dernières 24 heures)
                  {
                    range: {
                      timestamp: { // Ou "@timestamp", selon ta version de Wazuh
                        gte: "now-24h", // Depuis il y a 24 heures
                        lte: "now"      // Jusqu'à maintenant
                      }
                    }
                  }
                ]
              }
            },
            // L'agrégation (le secret pour le graphique) : grouper par heure (ou par 10 minutes)
            aggs: {
              alertes_par_heure: {
                date_histogram: {
                  field: "timestamp", // Ou "@timestamp"
                  fixed_interval: "1h", // Grouper les alertes heure par heure (tu peux mettre "10m")
                  time_zone: "Europe/Paris" // Change selon ton fuseau horaire
                }
              }
            }
          })
        });

        const data = await res.json();

        // On récupère les calculs (les "buckets") de notre agrégation
        const buckets = data.aggregations?.alertes_par_heure?.buckets || [];
        
        const labels = [];
        const dataPoints = [];

        // On boucle sur les résultats envoyés par Wazuh
        buckets.forEach(bucket => {
          // bucket.key_as_string contient l'heure exacte
          const time = new Date(bucket.key_as_string);
          const hour = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          
          labels.push(hour);
          // bucket.doc_count contient le nombre d'alertes pour cette heure-là
          dataPoints.push(bucket.doc_count); 
        });

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Alerts over time",
              data: dataPoints,
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
