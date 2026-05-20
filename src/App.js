import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Agents from "./pages/Agents";

const logoContext = require.context("./", true, /\.(png|jpe?g|svg|webp)$/i);
const logoFile = logoContext.keys().find((filePath) => {
  const fileName = filePath.split("/").pop()?.toLowerCase() || "";
  return /^(enterprise[-_ ]?logo|logo)([-_.].+)?\.(png|jpe?g|svg|webp)$/i.test(
    fileName
  );
});
const enterpriseLogo = logoFile ? logoContext(logoFile) : null;

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
    <div className="app-container">
      <Sidebar active={activePage} setActive={setActivePage} />
      <main className="main-content">
        <header className="top-header">
          <h1 className="portal-title">SIEM Portal</h1>
          <div className="user-profile">
            <div
              className="avatar avatar--logo"
              role="img"
              aria-label={enterpriseLogo ? "Enterprise logo" : "User avatar"}
            >
              {enterpriseLogo ? (
                <img src={enterpriseLogo} alt="Enterprise logo" />
              ) : (
                <span className="avatar-fallback" aria-hidden="true" />
              )}
            </div>
          </div>
        </header>
        <section className="content-wrapper">{renderPage()}</section>
      </main>
    </div>
  );
}

export default App;
