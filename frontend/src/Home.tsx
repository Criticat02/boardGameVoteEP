import React from 'react';
import { useState } from 'react';
import './App.css';

function HomePage({user: { username }}: { user: { username: string } }) {
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
        body: JSON.stringify({ username: username, gamename: gamename}),
      })

      console.log(response.text());
      if (response.status === 201){
        setResponseMessage('Vote submitted successfully!');
      } else {
        if (response.status === 404) {
          setResponseMessage('Could not find game in database. Please try again.');
        } else if (response.status === 409) {
          setResponseMessage('User has already voted.')
        } else {
          setResponseMessage('Error submitting vote. Please try again.');
        }
      }
      setGamename("");
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


      if (response.status === 200) {
        const data = await response.json() as ApiResponse;
        if (data.gamename) {
          setWinningGame(data.gamename);
        } else {
          setWinningGame(null);
          setResponseMessage('No votes found. Please try again later.')
        }
      } else if (response.status === 404) {
        setWinningGame(null);
        setResponseMessage('No votes found. Please try again later.');
      } else {
        setResponseMessage('Error retrieving data. Please try again.');
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
      setGamename("");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const HandleRemoveGameSubmit = async (event: React.FormEvent<HTMLFormElement>) => {  

    event.preventDefault();

    try {
      const response = await fetch(process.env.REACT_APP_SERVER_URL + '/game', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ gamename: gamename }),
      })

      if (response.status === 200){
        setResponseMessage('Game removed successfully!');
      } else if (response.status === 400) {
        setResponseMessage('Game name was not accepted.');
      } else if (response.status === 404) {
        setResponseMessage('Game could not be found in the database')
      } else {
        setResponseMessage('Error removing game. Please try again.');
      }
      setGamename("");
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <header className="App-body">
        <b className='App-label-bckg'>
          <label>
            <b>Enter the name of the game you wish to vote for, add to the list or remove from the list:</b>
            <br />
            <input
              type="text"
              className='App-label-input'
              value={gamename}
              onChange={(e) => setGamename(e.target.value)}
              required
            />
            {responseMessage? (
              <p style={{padding: '0px', fontStyle:'italic'}}>{responseMessage}</p>
            ) : (
              <p style={{padding: '0px', fontStyle:'italic'}}>Error messages will be displayed here</p>
            )}
          </label>
        </b>
        <form onSubmit={HandleVoteSubmit}>
          <input
            className='App-button'
            type="submit"
            value="Vote"
          />
        </form>
        <form onSubmit={HandleAddGameSubmit}>
          <input
            className='App-button'
            type="submit"
            value="Add to list"
          />
        </form>
        <form onSubmit={HandleRemoveGameSubmit}>
          <input
            className='App-button'
            type="submit"
            value="Remove from list"
          />
        </form>
        <form onSubmit={HandleGetVoteSubmit}>
          <input
            className='App-button'
            type="submit"
            value="Find out which game won"
          />
        </form>
        {winningGame && <p>The game that won the vote is: {winningGame} !</p>}
      </header>
    </div>
  );
}

export default HomePage;
