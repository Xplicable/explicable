// src/components/LandingPage.js
import React from 'react';

const LandingPage = ({ auth }) => (
  <div className="landing-page">
    <h1>Welcome to Explicable</h1>
    <button onClick={() => auth.signinRedirect()}>Create a New Account or Login</button>
  </div>
);

export default LandingPage;
