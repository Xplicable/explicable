// src/components/Header.js
import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";
import languages from "../i18n/languages";

const Header = ({ auth, signOut }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (auth?.isAuthenticated) {
      navigate("/profile");
    } else {
      auth?.signinRedirect();
    }
  };

  const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    localStorage.setItem("lang", lang);
  window.location.reload(); // Reload to apply language change (simple first step)
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <header className="app-header">
        <div className="brand-title">Explicable</div>
        <div style={{ display: "flex", gap: "20px" }}>
        <div className="lang-selector">
            <select value={selectedLang} onChange={handleLangChange}>
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.label}
                    </option>
                ))}
            </select>
        </div>
        <div className="profile-icon" onClick={handleProfileClick} title={auth?.isAuthenticated ? "Sign Out" : "Sign In"}>
          👤
        </div>
        <div className="profile-icon" onClick={handleSettingsClick} title="Settings">
          ⚙️
        </div>
      </div>
    </header>
  );
};

export default Header;
