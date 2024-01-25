// index.ts

import Bun from 'bun';
import { db, setupDatabase } from './src/database.ts';
import { getVote, addVote } from './src/vote.ts';
import { createUser } from './src/user.ts';
import { addGame, removeGame } from './src/game.ts';
import { corsHeaders } from './src/config.ts';

export const resetDatabase = async (): Promise<void> => {
  try {
    setInterval(() => {
      db.run("DELETE FROM votes");
  }, 1000 * 60 * 60 * 24);
  } catch (error) {
    console.log(error);
  }
}

const server = Bun.serve({
  hostname: '0.0.0.0',
  port: Bun.env.PORT || 8080,
  fetch(req) {
    setupDatabase();
    if (req.method === 'OPTIONS') {
      const res = new Response('Departed', corsHeaders);
      return res;
    }
    if (req.method === 'GET') {
      if (req.url.endsWith('/')) {
        return new Response('Bun!');
      } else if (req.url.endsWith('/vote')) {
        return getVote(req);
      } else {
        return new Response('Invalid endpoint', { status: 404 });
      }
    } else if (req.method === 'POST') {
      if (req.url.endsWith('/vote')) {
        return addVote(req);
      } else if (req.url.endsWith('/user')) {
        return createUser(req);
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
