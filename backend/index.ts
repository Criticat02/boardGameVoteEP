// index.ts

import Bun from 'bun';
import { vote } from './src/vote.ts';
import { db, setupDatabase } from './src/database.ts';

setupDatabase();

const server = Bun.serve({
  hostname: Bun.env.HOST || "0.0.0.0",
  port: Bun.env.PORT || 8080,
  fetch(req) {
    if (req.method === 'POST') {
      if (req.url.endsWith('/vote')) {
        return vote(req);
      } else {
        return new Response('Invalid endpoint', { status: 404 });
      }
    } else if (req.method === 'GET') {
        if (req.url.endsWith('/')) {
          return new Response('Bun!');
        } else {
          return new Response('Invalid endpoint', { status: 404 });
        }
    } else {
      return new Response('Invalid request method', { status: 405 });
    }
  },
});

console.log(`Listening on http://${server.hostname}:${server.port} ...`);
