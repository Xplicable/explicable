import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import translations, { DEFAULT_LANG } from "../i18n/translations";

// Determine active language
const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;
const t = translations[lang] || translations[DEFAULT_LANG];

// Cognito-supported locales only
const supportedLocales = ["en", "es", "fr", "de", "it", "ja", "ko", "pt-BR", "zh-CN"];
const cognitoLocale = supportedLocales.includes(lang) ? lang : "en";

const LandingPage = ({ auth }) => {
  const navigate = useNavigate();

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
      console.warn("Auth not ready yet.");
    }
  };

  return (
    <div className="landing-page">
      <div className="text-logo">Explicable</div>
      <button onClick={handleLogin}>
        {t.login} {/* 'Create Account or Log In' */}
      </button>
    </div>
  );
};

export default LandingPage;
