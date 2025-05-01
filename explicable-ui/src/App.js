import './App.css';

function App() {
  const fetchUsers = () => {
    fetch('https://kym19kis0l.execute-api.us-east-2.amazonaws.com/dev/users', {
      headers: {
        'x-api-key': 'TNqG6DHCUk2AM1FkiLUGt8V2XpBq6Llw7d19MPIB'
      }
    })
      .then(res => res.json())
      .then(data => console.log('Users:', data))
      .catch(err => console.error('Error:', err));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Explicable</h1>
        <p>React frontend successfully initialized. Ready to connect to the API!</p>

        <button onClick={fetchUsers}>
          Fetch Users from API
        </button>

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
