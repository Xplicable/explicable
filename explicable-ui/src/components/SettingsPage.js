import React from "react";
import translations, { DEFAULT_LANG } from "../i18n/translations";


const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;
const t = translations[lang] || translations[DEFAULT_LANG];

export default function SettingsPage() {

  return (
    <>
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
