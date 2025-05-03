import './App.css';
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "58br895ro7pi2ho11j69d9mqkg";
    const logoutUri = "http://localhost:3000";
    const cognitoDomain = "https://explicable.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div className="container">Loading authentication...</div>;
  }

  if (auth.error) {
    return <div className="container">Error: {auth.error.message}</div>;
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Explicable</h1>
        {!auth.isAuthenticated ? (
          <>
            <p className="subtitle">Welcome! Please log in to begin.</p>
            <button className="button" onClick={() => auth.signinRedirect()}>
              Sign In
            </button>
          </>
        ) : (
          <>
            <p className="subtitle">Hello: {auth.user?.profile.email}</p>
            <pre className="token">ID Token: {auth.user?.id_token}</pre>
            <pre className="token">Access Token: {auth.user?.access_token}</pre>
            <pre className="token">Refresh Token: {auth.user?.refresh_token}</pre>
            <button className="button" onClick={() => auth.removeUser()}>
              Sign Out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;


// // App.js

// import { useAuth } from "react-oidc-context";

// function App() {
//   const auth = useAuth();

//   const signOutRedirect = () => {
//     const clientId = "58br895ro7pi2ho11j69d9mqkg";
//     const logoutUri = "http://localhost:3000";
//     const cognitoDomain = "https://explicable.auth.us-east-2.amazoncognito.com";
//     window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
//   };

//   if (auth.isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (auth.error) {
//     return <div>Encountering error... {auth.error.message}</div>;
//   }

//   if (auth.isAuthenticated) {
//     return (
//       <div>
//         <pre> Hello: {auth.user?.profile.email} </pre>
//         <pre> ID Token: {auth.user?.id_token} </pre>
//         <pre> Access Token: {auth.user?.access_token} </pre>
//         <pre> Refresh Token: {auth.user?.refresh_token} </pre>

//         <button onClick={() => auth.removeUser()}>Sign out</button>
//       </div>
//     );
//   }

//   return (
//     <div>
//       <button onClick={() => auth.signinRedirect()}>Sign in</button>
//       <button onClick={() => signOutRedirect()}>Sign out</button>
//     </div>
//   );
// }

// export default App;