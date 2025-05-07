import React from "react";

export default function DashboardPage({ auth, signOut }) {
  // Clean URL query params
  if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
    const url = new URL(window.location.href);
    url.search = "";
    window.history.replaceState({}, document.title, url.toString());
  }

  return (
    <div className="App-header">
      <h2>Main Explicable Page (Logged In)</h2>
      <pre>Hello: {auth.user?.profile.email}</pre>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}