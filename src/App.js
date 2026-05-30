import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Agents from "./pages/Agents";
import './App.css';

function App() {
  // 1. On lit le localStorage au démarrage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("currentTab") || "Home";
  });

  // 2. On sauvegarde dès qu'on change de page
  useEffect(() => {
    localStorage.setItem("currentTab", activeTab);
  }, [activeTab]);

  const renderPage = () => {
    switch (activeTab) {
      case "Home":
        return <Home />;
      case "Monitoring":
        return <Monitoring />;
      case "Analytics":
        return <Analytics />;
      case "Agents":
        return <Agents />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar active={activeTab} setActive={setActiveTab} />
      <main className="main-content">
        <header className="top-header">
          <h1 className="portal-title">Keystone SOC Portal</h1>
        </header>
        <section className="content-wrapper">{renderPage()}</section>
      </main>
    </div>
  );
}

export default App;
