// src/components/LandingPage.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import './LandingPage.css';
import translations from "../i18n/translations";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
const t = translations[lang];

const LandingPage = ({ auth }) => {
  if (auth?.isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  const handleLogin = () => {
    if (auth?.signinRedirect) {
      console.log("Auth config:", auth);
      const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
      const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.REACT_APP_COGNITO_REDIRECT_URI);
      const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
      window.location.href = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${redirectUri}&locale=${lang}`;
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
