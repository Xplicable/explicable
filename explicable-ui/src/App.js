import { useAuth } from "react-oidc-context";
import "./App.css";

function App() {
  const auth = useAuth();

  const signOutRedirect = async () => {
    try {
      await auth.removeUser();  // clears localStorage state
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

  if (auth.isAuthenticated) {
    // Clean up URL
    if (window.location.search.includes("code=") || window.location.search.includes("state=")) {
      const url = new URL(window.location.href);
      url.search = ""; // remove query params
      window.history.replaceState({}, document.title, url.toString());
    }
  
    return (
      <div className="App-header">
        <h2>Main Explicable Page (Logged In)</h2>
        <pre>Hello: {auth.user?.profile.email}</pre>
        <button onClick={signOutRedirect}>Sign Out</button>
      </div>
    );
  }

  /*
  if (auth.isAuthenticated) {
    return (
      <div className="App-header">
        <h2>Main Explicable Page (Logged In)</h2>
        <pre>Hello: {auth.user?.profile.email}</pre>
        <button onClick={signOutRedirect}>Sign Out</button>
      </div>
    );
  }
  */

  // Landing page (Not Authenticated)
  return (
    <div className="App-header">
      <h2>Landing Page (Not Logged In)</h2>
      <button onClick={() => auth.signinRedirect()}>Log In</button>
    </div>
  );
}

export default App;

/*

https://explicable.auth.us-east-2.amazoncognito.com/logout?client_id=58br895ro7pi2ho11j69d9mqkg&logout_uri=http://localhost:3000

https://explicable.auth.us-east-2.amazoncognito.com/logout?client_id=58br895ro7pi2ho11j69d9mqkg&logout_uri=https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000

https://explicable.auth.us-east-2.amazoncognito.com/logout?client_id=58br895ro7pi2ho11j69d9mqkg&logout_uri=https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&response_type=code&scope=email+openid+phone+profile

https://explicable.auth.us-east-2.amazoncognito.com/logout?client_id=58br895ro7pi2ho11j69d9mqkg&logout_uri=https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000

https://explicable.auth.us-east-2.amazoncognito.com/logout?client_id=58br895ro7pi2ho11j69d9mqkg&logout_uri=https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&response_type=code&scope=email+openid+phone+profile

https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&response_type=code&scope=email+openid+phone+profile&redirect_uri=http%3A%2F%2Flocalhost%3A3000

https://explicable.auth.us-east-2.amazoncognito.com/login?client_id=58br895ro7pi2ho11j69d9mqkg&

localhost:3000

/*
  const signOutRedirect = () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = encodeURIComponent(process.env.REACT_APP_COGNITO_LOGOUT_URI);
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
  
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };

  const signOutRedirect = () => {
    auth.signoutRedirect();
  };

  const signOutRedirect = () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const logoutUri = encodeURIComponent(process.env.REACT_APP_COGNITO_LOGOUT_URI);
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutUri}`;
  };
  */
