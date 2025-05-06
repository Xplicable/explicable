// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ auth }) => (
  <nav className="navbar">
    <h2>Explicable</h2>
    <div>
      {auth.isAuthenticated ? (
        <>
          <span>{auth.user.profile.email}</span>
          <button onClick={() => auth.removeUser()}>Logout</button>
        </>
      ) : (
        <button onClick={() => auth.signinRedirect()}>Login</button>
      )}
    </div>
  </nav>
);

export default Navbar;
