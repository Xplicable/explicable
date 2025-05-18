import React, { useMemo } from "react";
import translations, { DEFAULT_LANG } from "../i18n/translations";
import "./SettingsPage.css";

export default function SettingsPage() {
  const lang = useMemo(
    () => localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG,
    []
  );
  const t = useMemo(
    () => translations[lang] || translations[DEFAULT_LANG],
    [lang]
  );

  return (
    <div className="settings-container main-card">
      <h2>{t.settings_title}</h2>
      <ul>
        <li>🔐 {t.settings_mfa}</li>
        <li>🧑 {t.settings_profile}</li>
        <li>🔑 {t.settings_password}</li>
        <li>TO-DO: ADD i18n FOR "Light/Dark/System" theme selection here</li>
        <li>🗑️ {t.settings_delete}</li>
      </ul>
    </div>
  );
}
