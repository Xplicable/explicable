import './App.css';
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = process.env.REACT_APP_COGNITO_CLIENT_ID;
    const appUrl = process.env.REACT_APP_APP_URL;
    const cognitoDomain = process.env.REACT_APP_COGNITO_DOMAIN;
  
    const loginUrl = `${cognitoDomain}/login?client_id=${clientId}&response_type=code&scope=email+openid+phone+profile&redirect_uri=${encodeURIComponent(appUrl)}`;
  
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(loginUrl)}`;
  };  

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
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