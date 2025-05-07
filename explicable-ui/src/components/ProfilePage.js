// src/components/ProfilePage.js
import React, { useState } from "react";
import Header from "./Header";
import { useAuth } from "react-oidc-context";
import languages from "../i18n/languages";
import translations from "../i18n/translations";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
const t = translations[lang] || translations["en"];

export default function ProfilePage() {
  const auth = useAuth();
  const [selectedLang, setSelectedLang] = useState(lang);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: auth.user?.profile.email || "",
    mobile_number: "",
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferences: "{}",
    isEmailVerified: false,
    isMobilePhoneVerified: false,
  });

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted profile data:", formData);
  };

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
      <div style={{ padding: "120px 20px 40px", maxWidth: "600px", margin: "0 auto" }}>
        <h2>{t.settings_profile}</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "grid", gridTemplateColumns: "150px 1fr", gap: "12px 20px", alignItems: "center" }}
        >
          <label style={{ textAlign: "right" }}>{t.name}:</label>
          <input type="text" value={formData.name} onChange={handleChange("name")} />

          <label style={{ textAlign: "right" }}>{t.username}:</label>
          <input type="text" value={formData.username} onChange={handleChange("username")} />

          <label style={{ textAlign: "right" }}>{t.email}:</label>
          <input type="email" value={formData.email} readOnly />

          <label style={{ textAlign: "right" }}>{t.mobile_number}:</label>
          <input type="tel" value={formData.mobile_number} onChange={handleChange("mobile_number")} />

          <label style={{ textAlign: "right" }}>{t.time_zone}:</label>
          <select value={formData.time_zone} onChange={handleChange("time_zone")}>
            {Intl.supportedValuesOf("timeZone").map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>

          <label style={{ textAlign: "right" }}>{t.email_verified}:</label>
          <div style={{ textAlign: "left" }}>
            {formData.isEmailVerified ? t.verified_yes : t.verified_no}
          </div>

          <label style={{ textAlign: "right" }}>{t.mobile_verified}:</label>
          <div style={{ textAlign: "left" }}>
            {formData.isMobilePhoneVerified ? t.verified_yes : t.verified_no}
          </div>

          <label style={{ textAlign: "right" }}>Language:</label>
          <select
            value={selectedLang}
            onChange={(e) => {
              const lang = e.target.value;
              setSelectedLang(lang);
              localStorage.setItem("lang", lang);
              window.location.reload();
            }}
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.flag} {lang.label}
              </option>
            ))}
          </select>

          <div></div>
          <button type="submit">{t.save}</button>
        </form>
      </div>
    </>
  );
}
