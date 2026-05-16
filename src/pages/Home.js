import React, { useState, useEffect } from "react";

function Home() {
  // On prépare les boîtes pour ranger nos données
  const [stats, setStats] = useState({ total: 0, high: 0, medium: 0, low: 0 });
  const [topIps, setTopIps] = useState([]);
  const [bruteForceCount, setBruteForceCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch("/wazuh-alerts-4.x-*/_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("admin:Newpassword123?") // test creds
          },
          body: JSON.stringify({
            size: 0, // Pas besoin du texte complet, juste des maths !
            query: {
              range: {
                timestamp: { // On filtre sur les 24 dernières heures
                  gte: "now-24h",
                  lte: "now"
                }
              }
            },
            aggs: {
              // 1. Calcul des niveaux (Sévérités)
              severities: {
                range: {
                  field: "rule.level",
                  ranges: [
                    { to: 7 },           // Low: 0 à 6 (le 7 est exclu)
                    { from: 7, to: 12 }, // Medium: 7 à 11 (le 12 est exclu)
                    { from: 12 }         // High: 12 et +
                  ]
                }
              },
              // 2. Récupération du Top des IPs attaquantes
              top_ips: {
                terms: {
                  field: "data.srcip",
                  size: 10 // On prend le top 10 des adresses IP
                }
              },
              // 3. Calcul spécifique des attaques Brute Force (Règle 5763)
              brute_force: {
                filter: {
                  term: { "rule.id": "5763" }
                }
              }
            }
          })
        });

        const data = await res.json();
        
        // --- Traitement de la réponse ---

        // 1. Niveaux de sévérité
        const sevBuckets = data.aggregations?.severities?.buckets || [];
        const lowCount = sevBuckets[0]?.doc_count || 0;
        const mediumCount = sevBuckets[1]?.doc_count || 0;
        const highCount = sevBuckets[2]?.doc_count || 0;
        const totalCount = lowCount + mediumCount + highCount;

        setStats({ total: totalCount, high: highCount, medium: mediumCount, low: lowCount });

        // 2. Top des IPs
        const ips = data.aggregations?.top_ips?.buckets || [];
        setTopIps(ips);

        // 3. Brute force
        const bfCount = data.aggregations?.brute_force?.doc_count || 0;
        setBruteForceCount(bfCount);

      } catch (err) {
        console.error("Error fetching Home data:", err);
      }
    }

    // Lancer au démarrage, puis rafraichir toutes les 30 sec
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>SIEM Dashboard</h2>
          {/* Ton message spécifique en haut */}
          <p className="subtitle" style={{ color: "#3498db", fontWeight: "600" }}>
            Résumé global des alertes générées dans les 24 dernières heures
          </p>
        </div>
      </div>

      {/* 4 CASES DU HAUT : Les stats */}
      <div className="agents-grid">
        <div className="agent-card">
          <div className="detail-row">
            <span className="label">Total Alerts</span>
            <span className="value" style={{ color: "#4a90e2", fontSize: "1.75rem", fontWeight: "bold" }}>{stats.total}</span>
          </div>
        </div>
        <div className="agent-card">
          <div className="detail-row">
            <span className="label">High</span>
            <span className="value" style={{ color: "#e74c3c", fontSize: "1.75rem", fontWeight: "bold" }}>{stats.high}</span>
          </div>
        </div>
        <div className="agent-card">
          <div className="detail-row">
            <span className="label">Medium</span>
            <span className="value" style={{ color: "#f39c12", fontSize: "1.75rem", fontWeight: "bold" }}>{stats.medium}</span>
          </div>
        </div>
        <div className="agent-card">
          <div className="detail-row">
            <span className="label">Low</span>
            <span className="value" style={{ color: "#2ecc71", fontSize: "1.75rem", fontWeight: "bold" }}>{stats.low}</span>
          </div>
        </div>
      </div>

      {/* PARTIE DU BAS : 2/3 (IPs) et 1/3 (Brute Force) */}
      <div className="analytics-grid" style={{ marginTop: "24px" }}>
        
        {/* Grande case gauche (2/3) : Liste des IPs */}
        <div className="chart-card">
          <h3>Adresses IPs attaquantes (Top 10)</h3>
          {topIps.length > 0 ? (
            <table className="data-table" style={{ marginTop: "16px" }}>
              <thead>
                <tr>
                  <th>Adresse IP source</th>
                  <th>Nombre d'attaques</th>
                </tr>
              </thead>
              <tbody>
                {topIps.map((ipObj, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: "500" }}>{ipObj.key}</td>
                    <td>
                      <span className="badge danger">{ipObj.doc_count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "var(--text-muted)", marginTop: "16px" }}>Aucune adresse IP externe n'a été détectée dans les logs.</p>
          )}
        </div>

        {/* Petite case droite (1/3) : Brute Force */}
        <div className="metric-card" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h3>Attaques Brute Force</h3>
          <div className="metric-value">
            <span className="number" style={{ color: "#e74c3c", fontSize: "4rem" }}>
              {bruteForceCount}
            </span>
          </div>
          <p className="metric-desc">
            Tentatives d'authentification échouées ou répétées (Règle 5763).
          </p>
        </div>

      </div>
    </div>
  );
}

export default Home;