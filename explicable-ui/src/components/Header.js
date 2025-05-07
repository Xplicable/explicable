// src/components/Header.js
import React from 'react';
import './Header.css';
import { useNavigate } from "react-router-dom";


const Header = ({ auth, signOut }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (auth?.isAuthenticated) {
      signOut();
    } else {
      auth?.signinRedirect();
    }
  };

  const handleSettingsClick = () => {
    navigate("/settings");
  };

  return (
    <header className="app-header">
      <div className="brand-title">Explicable</div>
      <div style={{ display: "flex", gap: "20px" }}>
        <div className="profile-icon" onClick={handleProfileClick} title={auth?.isAuthenticated ? "Sign Out" : "Sign In"}>
          👤
        </div>
        <div className="profile-icon" onClick={handleSettingsClick} title="Settings">
          ⚙️
        </div>
      </div>
    </header>
  );
};

export default Header;
