import React, { useMemo, useState } from "react";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Monitoring from "./pages/Monitoring";
import Analytics from "./pages/Analytics";
import Agents from "./pages/Agents";

function App() {
  const [activePage, setActivePage] = useState("Home");
  const enterpriseLogo = useMemo(() => {
    const logoContext = require.context("./", false, /\.(png|jpe?g|svg|webp)$/i);
    const logoFile = logoContext.keys().find((filePath) => {
      const fileName = filePath.split("/").pop().toLowerCase();
      return /^(enterprise[-_ ]?logo|logo)([-_.].+)?$/i.test(fileName);
    });

    return logoFile ? logoContext(logoFile) : null;
  }, []);

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
              aria-label={
                enterpriseLogo ? "Enterprise logo" : "Enterprise logo placeholder"
              }
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
