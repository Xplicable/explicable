// src/components/ProfilePage.js
import React, { useState } from "react";
import Header from "./Header";
import { useAuth } from "react-oidc-context";
import languages from "../i18n/languages";


export default function ProfilePage() {

    const auth = useAuth();
  
    const [selectedLang, setSelectedLang] = useState(localStorage.getItem("lang") || "en");

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
    // TODO: Wire up to API call to save/update user profile
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
        
        <h2>My Profile</h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px 20px', alignItems: 'center' }}>

            <label style={{ textAlign: "right" }}>Name:</label>
            <input type="text" value={formData.name} onChange={handleChange("name")} />

            <label style={{ textAlign: "right" }}>Username:</label>
            <input type="text" value={formData.username} onChange={handleChange("username")} />

            <label style={{ textAlign: "right" }}>Email:</label>
            <input type="email" value={formData.email} readOnly />

            <label style={{ textAlign: "right" }}>Mobile Number:</label>
            <input type="tel" value={formData.mobile_number} onChange={handleChange("mobile_number")} />

            <label style={{ textAlign: "right" }}>Time Zone:</label>

            <select value={formData.time_zone} onChange={handleChange("time_zone")}>
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                <option key={tz} value={tz}>{tz}</option>
                ))}
            </select>

            <label style={{ textAlign: "right" }}>Email Verified:</label>
            <div style={{ textAlign: "left" }}>
                {formData.isEmailVerified ? "Yes, already verified" : "No, not yet verified"}
            </div>

            <label style={{ textAlign: "right" }}>Mobile Verified:</label>
            <div style={{ textAlign: "left" }}>
                {formData.isMobilePhoneVerified ? "Yes, already verified" : "No, not yet verified"}
            </div>

            <label style={{ textAlign: "right" }}>Language:</label>
            <select
                value={selectedLang}
                onChange={(e) => {
                    const lang = e.target.value;
                    setSelectedLang(lang);
                    localStorage.setItem("lang", lang);
                    window.location.reload(); // Simple refresh for now
                }}
                >
                {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.label}
                    </option>
                ))}
            </select>

            <div></div>
            <button type="submit">Save Profile</button>
            </form>
        </div>
    </>
  );
}
