import React from 'react';
import { useState } from 'react';
import './App.css';

function LoginPage({ onLogin }: { onLogin: (user: {username: string}) => void }) {
  const [username, setUsername] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const HandleUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch (process.env.REACT_APP_SERVER_URL + '/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username }),
      });

      if (response.status === 201) {
        onLogin({ username: username });
      } else {
        if (response.status === 400) {
          setResponseMessage('Error creating user. Please try again. Username must be composed solely of letters.');
        } else {
          setResponseMessage('An unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <header className="App-body">
        <form onSubmit={HandleUserSubmit}>
          <b className='App-label-bckg'>
            <label>
              <b className="">Please enter your username to vote for today's boardgame:</b>
              <br />
              <input
                type="text"
                className='App-label-input'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </b>
          <button type="submit" className='App-button' style={{ margin: '100px 0px' }}>Submit</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </header>
    </div>
  );
}

export default LoginPage;