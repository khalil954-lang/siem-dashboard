import React, { useState, useEffect } from "react";

function Monitoring() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [alerts, setAlerts] = useState([]);
  const [limit, setLimit] = useState(20);

  // NOUVEAU : Les variables pour notre filtre de temps
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 🔥 Fetch real alerts from Wazuh
  useEffect(() => {
    async function fetchAlerts() {
      try {
        // Construction de la requête pour la base de données Wazuh
        let queryObj = { match_all: {} };

        // Si l'utilisateur a rempli les deux dates, on filtre sur le temps !
        if (startDate && endDate) {
          queryObj = {
            range: {
              timestamp: { // Le champ date dans la base de données
                gte: new Date(startDate).toISOString(), // Plus grand ou égal à Date de début
                lte: new Date(endDate).toISOString()    // Plus petit ou égal à Date de fin
              }
            }
          };
        }

        const res = await fetch("/wazuh-alerts-4.x-*/_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("admin:Newpassword123?") // test creds
          },
          body: JSON.stringify({
            size: limit,
            _source: [
              "@timestamp",
              "agent.ip",
              "rule.description",
              "rule.level",
              "rule.id"
            ],
            sort: [{ "@timestamp": { order: "desc" } }],
            query: queryObj // On utilise notre requête intelligente ici
          })
        });

        const data = await res.json();

        const clean = data.hits.hits.map((hit) => {
          const level = parseInt(hit._source.rule?.level) || 0;
          let severity = "Low";
          if (level >= 12) {
            severity = "High";
          } else if (level >= 7) {
            severity = "Medium";
          }

          const dateUtc = new Date(hit._source["@timestamp"]);
          const tunisTime = new Date(dateUtc.toLocaleString("en-US", { timeZone: "Africa/Tunis" }));
          
          const pad = (n) => n.toString().padStart(2, '0');
          const formattedTime = `${pad(tunisTime.getDate())}-${pad(tunisTime.getMonth() + 1)}-${tunisTime.getFullYear()} ${pad(tunisTime.getHours())}:${pad(tunisTime.getMinutes())}:${pad(tunisTime.getSeconds())}`;

          return {
            ip: hit._source.agent?.ip || "N/A",
            ruleId: hit._source.rule?.id || "N/A",
            type: hit._source.rule?.description || "N/A",
            severity: severity,
            time: formattedTime
          };
        });

        setAlerts(clean);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    
    // On relance la requête dès qu'une date ou la limite change
    return () => clearInterval(interval);
  }, [limit, startDate, endDate]); 

  // 🔍 Filter logic (Recherche texte et sévérité)
  const filteredAlerts = alerts.filter((item) => {
    const matchSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchSeverity =
      severityFilter === "All" || item.severity === severityFilter;

    return matchSearch && matchSeverity;
  });

  // NOUVEAU : On re-numérote proprement de 1 à X après avoir appliqué tous les filtres
  const finalData = filteredAlerts.map((item, index) => ({
    ...item,
    displayId: index + 1
  }));

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Monitoring</h2>
          <p className="subtitle">Exploration de l'historique complet de la base de données</p>
        </div>
      </div>

      {/* NOUVEAU : Barre de filtre de temps */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "15px", backgroundColor: "var(--card-bg)", padding: "15px", borderRadius: "8px", border: "1px solid var(--border-color)" }}>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>Date & Heure de début</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="filter-select"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "5px" }}>Date & Heure de fin</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="filter-select"
          />
        </div>
        <div style={{ display: "flex", alignItems: "flex-end" }}>
          <button 
            onClick={() => { setStartDate(""); setEndDate(""); }}
            style={{ padding: "8px 15px", backgroundColor: "transparent", border: "1px solid var(--border-color)", borderRadius: "4px", color: "var(--text-color)", cursor: "pointer" }}
          >
            Réinitialiser les dates
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Chercher par IP, Type, Rule ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="monitoring-filters"
          style={{ flex: 1 }}
        />

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="filter-select"
        >
          <option value="All">Toutes les sévérités</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>IP</th>
              <th>Rule ID</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Time (Tunisia)</th>
            </tr>
          </thead>

          <tbody>
            {finalData.map((item) => (
              <tr key={item.displayId}>
                <td>{item.displayId}</td> {/* L'ID incrémenté parfaitement */}
                <td style={{ fontWeight: "500" }}>{item.ip}</td>
                <td><span className="badge normal">{item.ruleId}</span></td>
                <td>{item.type}</td>
                <td>
                  <span
                    className={
                      item.severity === "High"
                        ? "badge danger"
                        : item.severity === "Medium"
                        ? "badge warning"
                        : "badge normal"
                    }
                  >
                    {item.severity}
                  </span>
                </td>
                <td>{item.time}</td>
              </tr>
            ))}
            {finalData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Aucun log trouvé dans cet intervalle</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      
      <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", marginTop: "15px", gap: "10px" }}>
        <span style={{ fontSize: "0.875rem", color: "var(--text-muted)", fontWeight: "500" }}>Nombre de logs à récupérer :</span>
        <select
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="filter-select"
          style={{ padding: "6px 12px" }}
        >
          <option value={20}>20</option>
          <option value={40}>40</option>
          <option value={60}>60</option>
          <option value={80}>80</option>
          <option value={100}>100</option>
        </select>
      </div>

    </div>
  );
}

export default Monitoring;