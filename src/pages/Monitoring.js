import React, { useState, useEffect } from "react";

function Monitoring() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [alerts, setAlerts] = useState([]);

  // 🔥 Fetch real alerts from Wazuh
  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/wazuh-alerts-4.x-*/_search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic " + btoa("admin:jxv9v6Jq.1M6BZgQiNQ6T0m3vym+D0x+")
          },
          body: JSON.stringify({
            size: 20,
            _source: [
              "@timestamp",
              "agent.name",
              "agent.ip",
              "rule.description",
              "data.win.system.message"
            ],
            sort: [{ "@timestamp": { order: "desc" } }],
            query: { match_all: {} }
          })
        });

        const data = await res.json();

        const clean = data.hits.hits.map((hit, i) => {
          const msg = hit._source.data?.win?.system?.message?.toLowerCase() || "";
          let severity = "Low";
          if (msg.includes("failed") || msg.includes("error") || msg.includes("unauthorized")) {
            severity = "High";
          } else if (msg.includes("warning") || msg.includes("policy") || msg.includes("alert")) {
            severity = "Medium";
          } 

          return {
            id: i + 1,
            ip: hit._source.agent?.ip || "N/A",
            type: hit._source.rule?.description || "N/A",
            severity,
            time: hit._source["@timestamp"]
          };
        });

        setAlerts(clean);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    }

    // First fetch
    fetchAlerts();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);

    // Cleanup when component unmounts
    return () => clearInterval(interval);
  }, []);

  // 🔍 Filter logic
  const data = alerts.filter((item) => {
    const matchSearch = Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchSeverity =
      severityFilter === "All" || item.severity === severityFilter;

    return matchSearch && matchSeverity;
  });

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Monitoring</h2>
          <p className="subtitle">Review incoming alerts and filter by severity</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search..."
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
          <option value="All">All</option>
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
              <th>Type</th>
              <th>Severity</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.ip}</td>
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
            {data.length === 0 ? (
              <tr>
                <td colSpan="5">No alerts found</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Monitoring;
