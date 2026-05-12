import React from "react";
import "./Sidebar.css";

function Sidebar({ active, setActive }) {
  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Monitoring", icon: "📊" },
    { name: "Analytics", icon: "📈" },
    { name: "Agents", icon: "🖥️" }
  ];

  return (
    <div className="sidebar">
      <h2 className="logo">SIEM</h2>

      <ul className="menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "menu-item active" : "menu-item"}
            onClick={() => setActive(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;