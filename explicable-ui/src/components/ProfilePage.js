import React, { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import languages from "../i18n/languages";
import translations, { DEFAULT_LANG } from "../i18n/translations";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;
const t = translations[lang] || translations[DEFAULT_LANG];

export default function ProfilePage() {
  const auth = useAuth();
  const [selectedLang, setSelectedLang] = useState(lang);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    mobile_number: "",
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferences: "{}",
    isEmailVerified: false,
    isMobilePhoneVerified: false,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = "u9999"; // 🔧 Hardcoded for testing

        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            "x-api-key": process.env.REACT_APP_API_KEY,
          }
        });

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        console.error("Error loading profile:", err.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = "u9999"; // 🔧 Same ID for update

      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Failed to update profile");

      const updated = await response.json();
      setFormData(updated);
      alert("Profile saved.");
    } catch (err) {
      console.error("Save failed:", err.message);
      alert("Save failed: " + err.message);
    }
  };

  return (
    <>
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
              <option key={tz} value={tz}>{tz}</option>
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
