/**
 * Main entry point for the React application.
 * Boots up the root component and mounts the app to the DOM.
 *
 * Wraps the app in routing, context providers, and theme layers.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import "./Sitewide.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const {
  REACT_APP_COGNITO_CLIENT_ID: client_id,
  REACT_APP_COGNITO_DOMAIN: domain,
  REACT_APP_COGNITO_REDIRECT_URI: redirect_uri
} = process.env;

const cognitoAuthConfig = {
  authority: domain,
  client_id,
  redirect_uri,
  response_type: "code",
  scope: "openid email phone profile",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  automaticSilentRenew: true,
  extraQueryParams: {
    identity_provider: "Google",
    prompt: "select_account"
  },
  metadata: {
    issuer: domain,
    authorization_endpoint: `${domain}/oauth2/authorize`,
    token_endpoint: `${domain}/oauth2/token`,
    userinfo_endpoint: `${domain}/oauth2/userInfo`,
    revocation_endpoint: `${domain}/oauth2/revoke`,
    end_session_endpoint: `${domain}/logout`
  }
};

document.body.classList.add("theme-auto");
document.title = "Explicable";

// To force dark mode:
//document.body.setAttribute("data-theme", "dark");
// To force light mode:
document.body.setAttribute("data-theme", "light");
// To follow system preference:
// document.body.removeAttribute("data-theme");


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
