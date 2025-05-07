// src/components/LandingPage.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import translations from "../i18n/translations";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
const t = translations[lang];

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
          locale: lang
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
