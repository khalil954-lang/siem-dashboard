import React from "react";

function Sidebar({ active, setActive }) {
  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Monitoring", icon: "📊" },
    { name: "Analytics", icon: "📈" },
    { name: "Agents", icon: "🖥️" }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo" />
        <h2>SIEM</h2>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">NAVIGATION</span>
        {menuItems.map((item) => (
          <div
            key={item.name}
            className={active === item.name ? "nav-item active" : "nav-item"}
            onClick={() => setActive(item.name)}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                setActive(item.name);
              }
            }}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
