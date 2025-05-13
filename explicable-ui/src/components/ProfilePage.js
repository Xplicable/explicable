import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useAuth } from "react-oidc-context";
import languages from "../i18n/languages";
import translations, { DEFAULT_LANG } from "../i18n/translations";
import timezones from "../utils/timezones";

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;
const t = translations[lang] || translations[DEFAULT_LANG];

export default function ProfilePage() {
  const auth = useAuth();

// TODO: Uncomment setSelectedLang when implementing language update from navbar
// const [selectedLang, setSelectedLang] = useState(lang);
  const [selectedLang] = useState(lang);

  const languageMap = Object.fromEntries(languages.map(l => [l.code, l]));
  const { flag, label } = languageMap[selectedLang] || { flag: "🏳️", label: selectedLang };

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
      const userId = auth.user?.profile?.sub;

      let response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      });

      if (response.status === 404) {
        const newUser = {
          user_id: userId,
          username: auth.user?.profile?.preferred_username || "newuser",
          email: auth.user?.profile?.email || "",
          mobile_number: auth.user?.profile?.phone_number || "",
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          preferences: {},
          isEmailVerified: auth.user?.profile?.email_verified || false,
          isMobilePhoneVerified: auth.user?.profile?.phone_number_verified || false,
        };

        await fetch(`${process.env.REACT_APP_API_URL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
          body: JSON.stringify(newUser),
        });

        response = await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": process.env.REACT_APP_API_KEY,
          },
        });
      }

      if (response.ok) {
        const userData = await response.json();
        setFormData(userData);
      }
    };

    if (auth.isAuthenticated) {
      fetchProfile();
    }
  }, [auth]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = auth.user?.profile?.sub;

    await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(formData),
    });
  };

return (
  <div className="profile-container">
    <h2>{t.profile_title || "Profile"}</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        <label htmlFor="name">{t["name"]}:</label>
        <input id="name" type="text" name="name" value={formData.name} onChange={handleChange} />

        <label htmlFor="username">{t["username"]}:</label>
        <input id="username" type="text" name="username" value={formData.username} onChange={handleChange} />

        <label htmlFor="email">{t["email"]}:</label>
        <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} />

        <label htmlFor="mobile_number">{t["mobile_number"]}:</label>
        <input id="mobile_number" type="text" name="mobile_number" value={formData.mobile_number} onChange={handleChange} />

        <label htmlFor="time_zone">{t["time_zone"]}:</label>

        <select
            id="time_zone"
            name="time_zone"
            value={formData.time_zone}
            onChange={handleChange}
          >
            {timezones
              .sort((a, b) => a.text.localeCompare(b.text))
              .map(({ value, text }) => (
                <option key={value} value={value}>
                  {text}
                </option>
              ))}
          </select>

        <label>Language:</label>
        <div className="readonly">{flag} {label}</div>

        <div></div>
        <button type="submit">{t["save"]}</button>
      </form>
    </div>
  );
}
