// src/components/SettingsPage.js
import React from "react";
import Header from "./Header";
import { useAuth } from "react-oidc-context";

export default function SettingsPage() {
  const auth = useAuth();

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
      <div style={{ padding: "120px 20px 40px" }}>
        <h2>Settings</h2>
        <ul>
          <li>🔐 Set Up Multi-Factor Authentication</li>
          <li>🧑 Update Profile Info</li>
          <li>🔑 Change Password</li>
          <li>🗑️ Delete Account (Coming Soon)</li>
        </ul>
      </div>
    </>
  );
}
