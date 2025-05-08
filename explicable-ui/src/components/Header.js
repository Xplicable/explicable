import React, { useState } from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";
import languages from "../i18n/languages";
import { FaSignOutAlt, FaUser, FaCog } from 'react-icons/fa';
import { getLanguageContext } from "../i18n/getLanguageContext";


const { lang, t } = getLanguageContext();

const Header = ({ auth, signOut }) => {
  const navigate = useNavigate();
  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || navigator.language.split("-")[0] || "en"
  );

  const handleProfileClick = () => {
    if (auth?.isAuthenticated) {
      navigate("/profile");
    } else {
      auth?.signinRedirect();
    }
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    localStorage.setItem("lang", lang);
    window.location.reload(); // Reload to apply language change
  };

  return (
    <header className="app-header">
      <div
        className="brand-title"
        onClick={() => navigate("/app")}
        style={{ cursor: "pointer" }}
      >
        Explicable{" "}
        {!["en", "es", "fr"].includes(lang) && t.explicable_explained && (
          <span style={{ fontSize: "0.8rem" }}>
            ({t.explicable_explained})
          </span>
        )}
      </div>

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

        {auth.isAuthenticated && (
          <>
            <div
              className="profile-icon"
              onClick={handleProfileClick}
              title={t.profile}
              aria-label={t.profile}
              role="button"
            >
              <FaUser />
            </div>
            <div
              className="profile-icon"
              onClick={handleSettingsClick}
              title={t.settings}
              aria-label={t.settings}
              role="button"
            >
              <FaCog />
            </div>
            <div
              className="profile-icon"
              onClick={signOut}
              title={t.logout_icon_header}
              aria-label={t.logout_icon_header}
              role="button"
            >
              <FaSignOutAlt />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
