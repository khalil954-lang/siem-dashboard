import { useEffect, useState } from "react";

const isActiveAgent = (status = "") => {
  const normalizedStatus = status.toLowerCase();
  return normalizedStatus === "active" || normalizedStatus === "connected";
};

function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchAgents() {
      try {
        // Step 1: get token
        const authRes = await fetch("/security/user/authenticate", {
          headers: {
            Authorization: "Basic " + btoa("wazuh:.WZ+J?P21?4azlGVKejeZs0VxMymr78E") // test creds
          }
        });
        const authData = await authRes.json();
        const token = authData.data.token;

        // Step 2: query agents
        const agentsRes = await fetch("/agents", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const agentsData = await agentsRes.json();

        // Step 3: drill into data.affected_items
        const formatted = agentsData.data.affected_items.map(agent => ({
          id: agent.id,
          name: agent.name,
          ip: agent.ip,
          status: agent.status
        }));

        setAgents(formatted);
      } catch (err) {
        console.error("Error fetching agents:", err);
      }
    }

    fetchAgents();

    const interval = setInterval(fetchAgents, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Agents</h2>
          <p className="subtitle">Connected endpoints and runtime status</p>
        </div>
      </div>

      <div className="agents-grid">
        {agents.map((item) => {
          const active = isActiveAgent(item.status);

          return (
            <div key={item.id} className="agent-card">
              <div className="agent-header">
                <h3>{item.name || "Unknown Agent"}</h3>
                <span
                  className={
                    active
                      ? "status-indicator active"
                      : "status-indicator inactive"
                  }
                >
                  <span className="dot" />
                  {item.status || "unknown"}
                </span>
              </div>

              <div className="agent-details">
                <div className="detail-row">
                  <span className="label">Agent ID</span>
                  <span className="value">{item.id}</span>
                </div>
                <div className="detail-row">
                  <span className="label">IP Address</span>
                  <span className="value">{item.ip || "N/A"}</span>
                </div>
              </div>
            </div>
          );
        })}
        {agents.length === 0 ? (
          <div className="agent-card">
            <div className="agent-details">
              <div className="detail-row">
                <span className="label">Status</span>
                <span className="value">No agents found</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Agents;
