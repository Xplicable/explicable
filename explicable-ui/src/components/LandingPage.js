import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import translations, { DEFAULT_LANG } from "../i18n/translations";

// Cognito-supported locales only
const supportedLocales = ["en", "es", "fr", "de", "it", "ja", "ko", "pt-BR", "zh-CN"];

const LandingPage = ({ auth }) => {
  const navigate = useNavigate();

  // Memoize language and translations for efficiency
  const lang = useMemo(
    () => localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG,
    []
  );
  const t = useMemo(
    () => translations[lang] || translations[DEFAULT_LANG],
    [lang]
  );

  // Pick the best locale for Cognito Hosted UI
  const cognitoLocale = useMemo(
    () => supportedLocales.includes(lang) ? lang : "en",
    [lang]
  );

  useEffect(() => {
    if (!auth.isLoading && auth.isAuthenticated) {
      navigate("/app", { replace: true });
    }
  }, [auth.isLoading, auth.isAuthenticated, navigate]);

  const handleLogin = () => {
    if (auth?.signinRedirect) {
      auth.signinRedirect({
        extraQueryParams: {
          lang: cognitoLocale
        }
      });
    } else {
      // Could show a toast/snackbar here if you want
      console.warn("Auth not ready yet.");
    }
  };

  return (
    <div className="landing-page-main-card">
      <div className="text-logo">Explicable</div>
      <button
        onClick={handleLogin}
        style={{
          marginTop: "2rem",
          padding: "0.7em 2em",
          fontSize: "1.15rem",
          fontWeight: 600,
          borderRadius: "4px",
          border: "none",
          background: "#0c76f4",
          color: "#fff",
          cursor: "pointer",
          transition: "background 0.2s"
        }}
        onMouseOver={e => (e.currentTarget.style.background = "#095cb3")}
        onMouseOut={e => (e.currentTarget.style.background = "#0c76f4")}
        aria-label={t.login}
      >
        {t.login}
      </button>
    </div>
  );
};

export default LandingPage;
