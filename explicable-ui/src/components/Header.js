import React, { useState, useMemo } from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";
import languages from "../i18n/languages";
import { FaSignOutAlt, FaCog, FaHome } from 'react-icons/fa';
import { getLanguageContext } from "../i18n/getLanguageContext";
import Avatar from "./Avatar"; 
import { resolveProfilePhoto } from '../utils/user.ts';


const { lang, t } = getLanguageContext();

const Header = ({ auth, signOut }) => {
  const navigate = useNavigate();

  const [selectedLang, setSelectedLang] = useState(
    localStorage.getItem("lang") || navigator.language.split("-")[0] || "en"
  );

  const handleLangChange = (e) => {
    const lang = e.target.value;
    setSelectedLang(lang);
    localStorage.setItem("lang", lang);
    window.location.reload();
  };

  const profilePhotoUrl = useMemo(() => resolveProfilePhoto(auth.user), [auth.user]);

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

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
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
              onClick={() => navigate("/profile")}
              title={t.profile}
              aria-label={t.profile}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate("/profile")}
            >
              <Avatar src={profilePhotoUrl} size={32} alt="User avatar" />
            </div>

            <div
              className="profile-icon"
              onClick={() => navigate("/settings")}
              title={t.settings}
              aria-label={t.settings}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate("/settings")}
            >
              <FaCog />
            </div>

            <div
              className="profile-icon"
              onClick={() => navigate("/app")}
              title={t.dashboard_title}
              aria-label={t.dashboard_title}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && navigate("/app")}
            >
              <FaHome />
            </div>

            <div
              className="profile-icon"
              onClick={signOut}
              title={t.logout_icon_header}
              aria-label={t.logout_icon_header}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && signOut()}
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
