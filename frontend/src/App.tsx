import React from 'react';
import LoginPage from './Login';
import HomePage from './Home';
import { CookiesProvider, useCookies } from "react-cookie";
import './App.css';

function App() {
  const [cookies, setCookie] = useCookies(["user"]);

  function handleLogin(user: {username: string}) {
    const twelveHours = 12 * 60 * 60;
    setCookie("user", user, { path: "/", maxAge: twelveHours });
  }

  return (
    <CookiesProvider>
      <div className='App'>
        <h1 className='App-title'>The Daily Epiphanie Board Game Vote</h1>
        {cookies.user ? (
          <HomePage user={cookies.user} />
        ) : (
          <LoginPage onLogin={handleLogin} />
        )}
      </div>
    </CookiesProvider>
  );
}

export default App;
