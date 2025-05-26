/**
 * LandingPage component.
 * Displays a call-to-action login button and sets locale for Cognito Hosted UI.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.auth - OIDC auth object with signinRedirect method.
 * @returns {JSX.Element}
 */
import React, { useMemo } from "react";
import './LandingPage.css';
import translations, { DEFAULT_LANG } from "../i18n/translations";

export default function LandingPage({ auth }) {
  const lang = useMemo(
    () => localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG,
    []
  );
  const t = useMemo(
    () => translations[lang] || translations[DEFAULT_LANG],
    [lang]
  );

  const cognitoLocale = ["en", "es", "fr", "de", "it", "ja", "ko", "pt-BR", "zh-CN"].includes(lang)
    ? lang
    : "en";

  const handleLogin = () => {
    auth?.signinRedirect({
      extraQueryParams: {
        lang: cognitoLocale,
        prompt: "select_account",
      }
    });
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
}
