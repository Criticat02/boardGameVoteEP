// index.ts

import Bun from 'bun';
import db from './src/database.ts';
import { getVote, addVote } from './src/vote.ts';
import { checkUser } from './src/user.ts';
import { addGame, removeGame } from './src/game.ts';
import { corsHeaders } from './src/config.ts';

const resetDatabase = async (): Promise<void> => {
  try {
    setInterval(() => {
      db.query("DELETE FROM votes").run();
  }, 1000 * 60 * 60 * 24);
  } catch (error) {
    console.log(error);
  }
}

resetDatabase();

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: Bun.env.PORT || 8080,
  fetch(req) {
    if (req.method === 'OPTIONS') {
      const res = new Response('Departed', corsHeaders);
      return res;
    }
    if (req.method === 'GET') {
      if (req.url.endsWith('/vote')) {
        return getVote(req);
      } else {
        return new Response('Invalid endpoint', { status: 404 });
      }
    } else if (req.method === 'POST') {
      if (req.url.endsWith('/vote')) {
        return addVote(req);
      } else if (req.url.endsWith('/user')) {
        return checkUser(req);
      } else if (req.url.endsWith('/game')) {
        return addGame(req);
      } else {
        return new Response('Invalid endpoint', { status: 404 });
      }
    } else if (req.method === 'DELETE') {
      if (req.url.endsWith('/game')) {
        return removeGame(req);
      } else {
        return new Response('Invalid endpoint', { status: 404 });
      }
    } else {
      return new Response('Invalid request method', { status: 405 });
    }
  },
});


console.log(`Listening on http://${server.hostname}:${server.port} ...`);
