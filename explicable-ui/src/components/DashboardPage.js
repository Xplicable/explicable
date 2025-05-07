// src/components/DashboardPage.js
import React from "react";
import Header from "./Header";
import translations from "../i18n/translations";

const lang = localStorage.getItem("lang") || "en";
const t = translations[lang];

export default function DashboardPage({ auth, signOut }) {
  if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  return (
    <>
      <Header auth={auth} signOut={signOut} />
      <div style={{ paddingTop: "80px" }} className="App-header">
        <h2>{t.dashboard_title}</h2> {/* 'Main Explicable Page (Logged In)' */}
        <pre>{t.hello} {auth.user?.profile.email}</pre> {/* 'Hello:' */}
        <button onClick={signOut}>{t.sign_out}</button> {/* 'Sign Out' */}
      </div>
    </>
  );
}
