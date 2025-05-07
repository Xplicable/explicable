// src/components/DashboardPage.js
import React from "react";
import Header from "./Header";

export default function DashboardPage({ auth, signOut }) {
  if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  return (
    <>
      <Header auth={auth} signOut={signOut} /> {/* <-- This line resolves the warning */}
      <div style={{ paddingTop: "80px" }} className="App-header">
        <h2>Main Explicable Page (Logged In)</h2>
        <pre>Hello: {auth.user?.profile.email}</pre>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </>
  );
}
