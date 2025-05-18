import React, { useMemo } from "react";
import './DashboardPage.css';
import translations, { DEFAULT_LANG } from "../i18n/translations";

export default function DashboardPage({ auth, signOut }) {
  // Memoize language selection for better performance
  const lang = useMemo(
    () => localStorage.getItem("lang") || navigator.language.split("-")[0] || DEFAULT_LANG,
    []
  );
  const t = useMemo(
    () => translations[lang] || translations[DEFAULT_LANG],
    [lang]
  );

  // Remove code/state params from URL if present
  React.useEffect(() => {
    if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
      const url = new URL(window.location.href);
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());
    }
  }, []);

  return (
    <div className="dashboard-main-card">
      <h2>{t.dashboard_title}</h2>
      <pre>
        {t.hello} {auth?.user?.profile?.email || ""}
      </pre>
      <button
        onClick={signOut}
        style={{
          marginTop: "1.5rem",
          padding: "0.6em 1.5em",
          fontSize: "1.1rem",
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
        aria-label={t.sign_out}
      >
        {t.sign_out}
      </button>
    </div>
  );
}
