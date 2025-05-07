import React from "react";
import Header from "./Header";
import { useAuth } from "react-oidc-context";
import translations from "../i18n/translations";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
const t = translations[lang] || translations["en"];

export default function SettingsPage() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    try {
      await auth.removeUser();
      const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
      const logoutUri = encodeURIComponent(process.env.REACT_APP_COGNITO_LOGOUT_URI);
      const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
      window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
    } catch (err) {
      console.error("Error during sign-out:", err);
    }
  };

  return (
    <>
      <Header auth={auth} signOut={signOutRedirect} />
      <div style={{ padding: "120px 20px 40px" }}>
        <h2>{t.settings_title}</h2>
        <ul>
          <li>🔐 {t.settings_mfa}</li>
          <li>🧑 {t.settings_profile}</li>
          <li>🔑 {t.settings_password}</li>
          <li>🗑️ {t.settings_delete}</li>
        </ul>
      </div>
    </>
  );
}
