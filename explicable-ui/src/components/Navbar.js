// src/components/Navbar.js
import React, { useMemo } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import translations, { DEFAULT_LANG } from '../i18n/translations';

const Navbar = ({ auth = {} }) => {
  const lang = useMemo(
    () => localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG,
    []
  );
  const t = useMemo(
    () => translations[lang] || translations[DEFAULT_LANG],
    [lang]
  );

  return (
    <nav className="navbar" style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.2rem 2.5vw',
      borderBottom: '1px solid #eaeaea',
      background: '#fff',
      zIndex: 30
    }}>
      <Link to="/app" style={{ textDecoration: "none", color: "#0c76f4", fontWeight: 700 }}>
        <h2 style={{ margin: 0 }}>Explicable</h2>
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        {auth.isAuthenticated ? (
          <>
            <span style={{ color: "#222", fontWeight: 500 }}>
              {auth.user?.profile?.email}
            </span>
            <button
              onClick={() => auth.removeUser()}
              aria-label={t.logout}
              style={{
                padding: "0.5em 1.3em",
                fontWeight: 600,
                background: "#e34d4d",
                color: "#fff",
                border: "none",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseOver={e => (e.currentTarget.style.background = "#b43232")}
              onMouseOut={e => (e.currentTarget.style.background = "#e34d4d")}
            >
              {t.logout}
            </button>
          </>
        ) : (
          <button
            onClick={() => auth.signinRedirect && auth.signinRedirect()}
            aria-label={t.login}
            style={{
              padding: "0.5em 1.3em",
              fontWeight: 600,
              background: "#0c76f4",
              color: "#fff",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#095cb3")}
            onMouseOut={e => (e.currentTarget.style.background = "#0c76f4")}
          >
            {t.login}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
