import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function LoginPage() {
  const [username, setUsername] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const navigate = useNavigate();

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
        navigate('/vote');
      } else {
        if (response.status === 400) {
          setResponseMessage('Error creating user. Please try again.');
        } else {
          setResponseMessage('An unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Login">
      <h1 className='Login-title'>The Daily Epiphany Board Game Vote</h1>
      <header className="Login-body">
        <form onSubmit={HandleUserSubmit}>
          <b className='Login-label-bckg'>
            <label>
              <b className="">Please enter your username to vote for today's boardgame:</b>
              <br />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
          </b>
          <button type="submit" className='Login-button'>Submit</button>
        </form>
        {responseMessage && <p>{responseMessage}</p>}
      </header>
    </div>
  );
}

export default LoginPage;