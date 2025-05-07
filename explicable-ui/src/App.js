import { useAuth } from "react-oidc-context";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import DashboardPage from "./components/DashboardPage";

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
    return <div className="App-header"><h2>Loading Authentication...</h2></div>;
  }

  if (auth.error) {
    return <div className="App-header"><h2>Authentication Error</h2><p>{auth.error.message}</p></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage auth={auth} />} />
        <Route
          path="/app"
          element={
            auth.isAuthenticated
              ? <DashboardPage auth={auth} signOut={signOutRedirect} />
              : <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
