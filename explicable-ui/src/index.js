// index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts"; // Correct import location ✅

const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_DOMAIN,
  client_id: process.env.REACT_APP_COGNITO_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_COGNITO_REDIRECT_URI,
  response_type: "code",
  scope: "openid email phone profile",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true, // ✅ Minimal addition for smoother session handling
  metadata: {
    issuer:                 process.env.REACT_APP_COGNITO_DOMAIN,
    authorization_endpoint: `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/authorize`,
    token_endpoint:         `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/token`,
    userinfo_endpoint:      `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/userInfo`,
    revocation_endpoint:    `${process.env.REACT_APP_COGNITO_DOMAIN}/oauth2/revoke`,
    end_session_endpoint:   `${process.env.REACT_APP_COGNITO_DOMAIN}/logout`
  }
};

console.log("OIDC Config Check:", {
  client_id: cognitoAuthConfig.client_id,
  redirect_uri: cognitoAuthConfig.redirect_uri,
  authority: cognitoAuthConfig.authority
});

const root = ReactDOM.createRoot(document.getElementById("root"));

document.body.classList.add("theme-auto");

root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
