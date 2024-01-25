import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './Vote.css';

function VotePage() {
  const [gamename, setGamename] = useState<string>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [winningGame, setWinningGame] = useState<string | null>(null);

  const HandleVoteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  

    event.preventDefault();

    try {

      const response = await fetch(process.env.REACT_APP_SERVER_URL + '/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ gamename: gamename }),
      })

      if (response.status === 201){
        setResponseMessage('Vote submitted successfully!');
      } else {
        if (response.status === 404) {
          setResponseMessage('Could not find user name. Please try again.');
        } else if (response.status === 409) {
          setResponseMessage('User has already voted.')
        } else {
          setResponseMessage('Error submitting vote. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const HandleAddGameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  

    event.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + '/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ gamename: gamename }),
      })

      if (response.status === 201){
        setResponseMessage('Game added successfully!');
      } else if (response.status === 400) {
        setResponseMessage('Game name was not accepted.');
      } else if (response.status === 409) {
        setResponseMessage('Game was already present in the list')
      } else {
        setResponseMessage('Error submitting game. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const HandleGetVoteSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  

    event.preventDefault();

    interface ApiResponse {
      gamename: string;
    }

    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + '/vote',{
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await response.json() as ApiResponse;

      if (response.status === 200 && data.gamename) {
        setWinningGame(data.gamename);
      } else if (response.status === 404) {
        setResponseMessage('Game name was not accepted.');
      } else {
        setResponseMessage('Error submitting game. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="Vote">
      <h1 className='Vote-title'>The Daily Epiphany Board Game Vote</h1>
      <header className="Vote-body">
        <b className='Vote-label-bckg'>
          <label>
            <b>Enter the name of the game you wish to vote for or add to the list:</b>
            <br />
            <input
              type="text"
              value={gamename}
              onChange={(e) => setGamename(e.target.value)}
              required
            />
          </label>
        </b>
        <form onSubmit={HandleVoteSubmit}>
          <input
            className='Vote-button'
            type="submit"
            value="Vote"
          />
        </form>
        <form onSubmit={HandleAddGameSubmit}>
          <input
            className='Vote-button'
            type="submit"
            value="Add to list"
          />
        </form>
        <form onSubmit={HandleGetVoteSubmit}>
          <input
            className='Vote-button'
            type="submit"
            value="Find out which game won"
          />
        </form>
        {responseMessage && <p>{responseMessage}</p>}
        {winningGame && <p>{winningGame}</p>}
      </header>
    </div>
  );
}

export default VotePage;
