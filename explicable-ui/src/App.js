// src/App.js
import { useAuth } from "react-oidc-context";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";
import SettingsPage from "./components/SettingsPage";
import { getLanguageContext } from "./i18n/getLanguageContext";

const { t } = getLanguageContext();

// Set document title
document.title = t.explicable_explained || "Explicable";

function App() {
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

  if (auth.isLoading) {
    return <div className="App-header"><h2>{t.auth_loading}</h2></div>; // 'Loading Authentication...'
  }

  if (auth.error) {
    return (
      <div className="App-header">
        <h2>{t.auth_error}</h2> {/* 'Authentication Error' */}
        <p>{auth.error.message}</p>
      </div>
    );
  }

  return (
    <Router>
      <Header auth={auth} signOut={signOutRedirect} />
      <Routes> 
        <Route path="/profile" element={auth.isAuthenticated ? <ProfilePage /> : <Navigate to="/" replace />} />
        <Route path="/settings" element={auth.isAuthenticated ? <SettingsPage /> : <Navigate to="/" replace />} />
        <Route path="/" element={<LandingPage auth={auth} />} />
        <Route path="/app" element={auth.isAuthenticated ? <DashboardPage auth={auth} signOut={signOutRedirect} /> : <Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
