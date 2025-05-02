import './App.css';
import { useEffect, useState } from 'react';
import { Auth } from 'aws-amplify';

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
  }, []);

  const signIn = () => {
    Auth.federatedSignIn(); // Launch Hosted UI
  };

  const signOut = () => {
    Auth.signOut()
      .then(() => {
        setUser(null);
        window.location.reload();
      })
      .catch(console.error);
  };

  const fetchUsers = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users`, {
      headers: {
        'x-api-key': process.env.REACT_APP_API_KEY
      }
    })
      .then(res => res.json())
      .then(data => console.log('Users:', data))
      .catch(err => console.error('Error:', err));
  };

  if (loadingUser) return <p>Loading authentication...</p>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Explicable</h1>
        <p>React frontend using classic aws-amplify is fully connected to Cognito.</p>

        {!user ? (
          <button onClick={signIn}>Log In / Sign Up</button>
        ) : (
          <>
            <p>Welcome, {user.attributes?.email || user.username}</p>
            <button onClick={fetchUsers}>Fetch Users from API</button>
            <button onClick={signOut}>Log Out</button>
          </>
        )}

        <a
          className="App-link"
          href="https://github.com/prw760/explicable"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Monorepo on GitHub
        </a>
      </header>
    </div>
  );
}

export default App;
