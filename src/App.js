import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Agents from "./pages/Agents";
import LogsTable from "./components/indexer"; 
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("Home");

  const renderPage = () => {
    switch (activePage) {
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
    <div className="app-container" style={{ display: "flex" }}>
      <Sidebar active={activePage} setActive={setActivePage} />
      <div className="content" style={{ flex: 1, padding: "20px" }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;