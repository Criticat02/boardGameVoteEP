// vote.ts

import db from './database.ts';
import { corsHeaders } from './config.ts';

export async function addVote(req: Request): Promise<Response> {
  try {
    const reqText = await req.text();
    const parsedBody = JSON.parse(reqText);
    const { username, gamename } = parsedBody as { username:string, gamename: string };

    if (!username) {
      return new Response("Username not found", { status: 404, ...corsHeaders });
    }
    username.trim().toLowerCase();

    const row = db.query("SELECT * FROM votes WHERE user_name = ?").get(username);
    if (row) {
      return new Response("User has already voted", { status: 409, ...corsHeaders });
    } else {

      gamename.trim().toLowerCase();
      if (!gamename) {
        return new Response("Game name is required", { status: 400, ...corsHeaders });
      }

      const gameId = db.query("SELECT id FROM games WHERE name = ?").get(gamename) as number;
      if (!gameId) {
        return new Response("Provided game name couldn't be found in the database", { status: 404, ...corsHeaders });
      } else {
        db.query("INSERT INTO votes (game_name, user_name) VALUES (?, ?)").run(gamename, username);
        return new Response("Vote added!", { status: 201, ...corsHeaders });
      }
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}

export async function getVote(req: Request): Promise<Response> {
  try {

    const votedGame = db.query("SELECT game_name, COUNT(*) AS count FROM votes GROUP BY game_name ORDER BY count DESC LIMIT 1").get() as { game_name: string, count: number };

    if (!votedGame || !votedGame.game_name) {
      return new Response("No votes found", { status: 404, ...corsHeaders });
    } else {
      const responseBody = { gamename: votedGame.game_name };
      return new Response(JSON.stringify(responseBody), { status: 200, ...corsHeaders });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}
