import { useEffect, useState } from "react";

function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchAgents() {
      try {
        // Step 1: get token
        const authRes = await fetch("/security/user/authenticate", {
          headers: {
            Authorization: "Basic " + btoa("admin:jxv9v6Jq.1M6BZgQiNQ6T0m3vym+D0x+") // test creds
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
/* 
  return (
    <div>
      <h2>Agents</h2>
      <ul>
        {agents.map(a => (
          <li key={a.id}>
            {a.id} | {a.name} | {a.ip} | {a.status}
          </li>
        ))}
      </ul>
      
    </div>
  );
*/
  return (
    <div classname="agents status">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f2f5", textAlign: "left" }}>
            <th>ID</th>
            <th>Name</th>
            <th>IP Address</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {agents.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.ip}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Agents;


/*import React from "react";

// 🔥 Mock agents
const agents = [
  { id: 1, name: "Camera-01", ip: "192.168.1.100", status: "Online" },
  { id: 2, name: "Server-01", ip: "192.168.1.101", status: "Offline" },
  { id: 3, name: "Laptop-01", ip: "192.168.1.102", status: "Online" },
];

const getStatusColor = (status) => {
  return status === "Connected" ? "#2ecc71" : "#e74c3c";
};

function Agents() {
  return (
    <div>
      <h1>Agents</h1>

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>IP</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.id}</td>
                <td>{agent.name}</td>
                <td>{agent.ip}</td>
                <td>
                  <span
                    style={{
                      padding: "5px 10px",
                      borderRadius: "20px",
                      backgroundColor: getStatusColor(agent.status),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    {agent.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Agents;
*/