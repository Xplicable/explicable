// src/components/Header.js
import React from 'react';
import './Header.css';

const Header = ({ auth, signOut }) => {
  const handleClick = () => {
    if (auth?.isAuthenticated) {
      signOut(); // or toggle a dropdown later
    } else if (auth?.signinRedirect) {
      auth.signinRedirect();
    }
  };

  return (
    <header className="app-header">
      <div className="brand-title">Explicable</div>
      <div className="profile-icon" onClick={handleClick} title={auth?.isAuthenticated ? "Sign Out" : "Sign In"}>
        👤
      </div>
    </header>
  );
};

export default Header;
