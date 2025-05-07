// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import translations from '../i18n/translations';

const lang = localStorage.getItem("lang") || navigator.language.split("-")[0] || "en";
const t = translations[lang];

const Navbar = ({ auth }) => (
  <nav className="navbar">
    <h2>Explicable</h2>
    <div>
      {auth.isAuthenticated ? (
        <>
          <span>{auth.user.profile.email}</span>
          <button onClick={() => auth.removeUser()} aria-label="Logout">{t.logout}</button>
        </>
      ) : (
        <button onClick={() => auth.signinRedirect()} aria-label="Login">{t.login}</button>
      )}
    </div>
  </nav>
);

export default Navbar;
