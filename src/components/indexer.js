import { useEffect, useState } from "react";

function LogsTable() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("/wazuh-alerts-*/_search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa("admin:admin")
      },
      body: JSON.stringify({
        size: 5,
        _source: [
          "@timestamp",
          "agent.name",
          "agent.ip",
          "rule.description",
          "data.win.system.message",
          "data.win.system.level"
        ],
        sort: [{ "@timestamp": { order: "desc" } }],
        query: { match_all: {} }
      })
    })
      .then(res => res.json())
      .then(data => {
        const clean = data.hits.hits.map(hit => {
          const level = hit._source.data?.win?.system?.level || 0;
          let severity = "Low";
          if (level >= 8) severity = "High";
          else if (level >= 4) severity = "Medium";

          return {
            timestamp: hit._source["@timestamp"],
            agent_name: hit._source.agent?.name || "N/A",
            agent_ip: hit._source.agent?.ip || "N/A",
            rule: hit._source.rule?.description || "N/A",
            severity,
            message: hit._source.data?.win?.system?.message || "N/A"
          };
        });
        setLogs(clean);
      })
      .catch(err => console.error("Fetch error:", err));
  }, []);

  return (
    <div>
      <h2>Latest Wazuh Alerts</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Agent Name</th>
            <th>Agent IP</th>
            <th>Rule</th>
            <th>Severity</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <td colSpan="6">No alerts found</td>
            </tr>
          ) : (
            logs.map((log, i) => (
              <tr key={i}>
                <td>{log.timestamp}</td>
                <td>{log.agent_name}</td>
                <td>{log.agent_ip}</td>
                <td>{log.rule}</td>
                <td>{log.severity}</td>
                <td>{log.message}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default LogsTable;
