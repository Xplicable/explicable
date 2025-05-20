import React, { useState, useEffect, useMemo } from "react";
import './ProfilePage.css';
import debounce from "lodash.debounce";
import { useAuth } from "react-oidc-context";
import languages from "../i18n/languages";
import translations, { DEFAULT_LANG } from "../i18n/translations";
import timezones from "../utils/timezones";

export default function ProfilePage() {
  const auth = useAuth();
  const userId = auth.user?.profile?.sub;

  // Safe, dynamic language detection
  const lang =
    localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG;
  const t = translations[lang] || translations[DEFAULT_LANG];

  const [saveStatus, setSaveStatus] = useState(""); // "saving", "saved", etc.
  const [mobileError, setMobileError] = useState("");

  // Debounced save
  const debouncedSave = useMemo(() => {
    return debounce(async (fieldName, fieldValue) => {
      if (!userId) return;

      setSaveStatus("saving");

      // Map account_name to username for backend
      const payload =
        fieldName === "account_name"
          ? { username: fieldValue }
          : { [fieldName]: fieldValue };

      await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
        body: JSON.stringify(payload),
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    }, 2000);
  }, [userId]);

  // Language dropdown logic
  const [selectedLang] = useState(lang);

  // Put this inside the function!
  const languageMap = useMemo(
    () => Object.fromEntries(languages.map((l) => [l.code, l])),
    []
  );
  const { flag, label } = languageMap[selectedLang] || { flag: "🏳️", label: selectedLang };

  // Form state
  const [formData, setFormData] = useState({
    first_name: "", // ✅ add this
    last_name: "",  // ✅ add this
    profile_photo_url: "", // ✅ add this
    name: "",
    account_name: "",
    email: "",
    mobile_number: "",
    time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    preferences: "{}",
    isEmailVerified: false,
    isMobilePhoneVerified: false,
  });

  useEffect(() => {
    const detectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    console.log("Detected browser timezone:", detectedTimeZone);

    if (!formData.time_zone && detectedTimeZone) {
      setFormData((prev) => ({
        ...prev,
        time_zone: detectedTimeZone,
      }));
    }
  }, [formData.time_zone]);

  // Fetch profile and map username->account_name
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
        const activeField = document.activeElement?.name;

        setFormData((prevData) => {
          const updated = { ...prevData };
          for (const key in userData) {
            if (
              ((key === "username" && "account_name" in prevData) ||
                (key in prevData && key !== "account_name")) &&
              userData[key] !== prevData[key] &&
              (key !== activeField && (key !== "username" || activeField !== "account_name"))
            ) {
              if (key === "username") {
                updated["account_name"] = userData[key];
              } else {
                updated[key] = userData[key];
              }
            }
          }

          const detectedIanaZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          const matchedTz = timezones.find(tz => tz.iana === detectedIanaZone);

          if (matchedTz && !updated.time_zone) {
            console.log("Auto-setting timezone to:", matchedTz.value);
            updated.time_zone = matchedTz.value;
          }

          return updated;
        });
      }
    }
    if (auth.isAuthenticated) {
      fetchProfile();
    }
  }, [auth, debouncedSave]);

  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Mobile validation
    if (name === "mobile_number") {
      if (!isValidPhoneNumber(value)) {
        setMobileError(t.invalid_phone);
        return; // Do not autosave if invalid
      } else {
        setMobileError("");
      }
    }

    debouncedSave(name, value);
  };

  const isValidPhoneNumber = (value) => {
    if (!value.trim()) return true; // allow blank
    const regex = /^\+?[\d\s\-().]{7,20}$/;
    return regex.test(value);
  };

  const handleBackClick = async () => {
    if (!userId) return;

    // Map account_name to username for backend
    const payload = {
      ...formData,
      username: formData.account_name,
    };
    delete payload.account_name;

    await fetch(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    window.location.href = "/app";
  };

  return (
    <div className="profile-container main-card">
      <div className="profile-header">
        <div className="back-arrow-row">
          <span className="back-arrow" onClick={handleBackClick}>
            ← Back
          </span>
        </div>
        <h2 className="profile-title">{t.profile_title || "Profile"}</h2>
      </div>

      <form className="profile-form">
        <div className="form-field">
          <label htmlFor="first_name">First Name:</label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          />
        </div>

        <div className="form-field">
          <label htmlFor="last_name">Last Name:</label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          />
        </div>

        <div className="form-field">
          <label htmlFor="account_name">{t.account_name}:</label>
          <input
            id="account_name"
            type="text"
            name="account_name"
            value={formData.account_name}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          />
        </div>

        <div className="form-field">
          <label htmlFor="email">{t.email}:</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          />
        </div>

        <div className="form-field">
          <label htmlFor="mobile_number">{t.mobile_number}:</label>
          <input
            id="mobile_number"
            type="text"
            name="mobile_number"
            value={formData.mobile_number}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          />
          {mobileError && (
            <div className="form-error">
              <p>{mobileError}</p>
            </div>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="time_zone">{t.time_zone}:</label>
          <select
            id="time_zone"
            name="time_zone"
            value={formData.time_zone}
            onChange={handleChange}
            disabled={saveStatus === "saving"}
          >
          {timezones
            .slice() // prevent mutation of the original array
            .sort((a, b) => a.offset - b.offset)
            .map(({ iana, text }) => (
              <option key={iana} value={iana}>
                {text}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="language">Language:</label>
          <div id="language" className="readonly">
            {flag} {label}
          </div>
        </div>

        <div className="form-field">
          {/* <button type="submit">{t.save}</button> */}
          <div className={`form-save-status ${saveStatus}`}>
            {saveStatus === "saving" && t.saving_status}
            {saveStatus === "saved" && t.saved_status}
          </div>
        </div>
      </form>
    </div>
  )
};
