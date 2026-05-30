import React from "react";
import logo from "../assets/Logo_keystone.png";
import { FiHome, FiShield, FiBarChart2, FiMonitor } from "react-icons/fi";


function Sidebar({ active, setActive }) {
  const menuItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Monitoring", icon: <FiShield />},
    { name: "Analytics", icon: <FiBarChart2 /> },
    { name: "Agents", icon: <FiMonitor /> }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="brand-logo" />
          <img className="brand-logo-img" src={logo} alt="Keystone Group" />
          <h2 className="brand-title">Keystone</h2>
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
                event.preventDefault();
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
