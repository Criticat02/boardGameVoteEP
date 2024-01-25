// vote.ts

import { db } from './database.ts';
import { getCookieUsername } from './user.ts';
import { corsHeaders } from './config.ts';

export async function addVote(req: Request): Promise<Response> {
  try {
    const username = await getCookieUsername(req);
    if (!username) {
      return new Response("Username not found", { status: 404, ...corsHeaders });
    }

    const row = db.query("SELECT * FROM votes WHERE user_name = ?").get(username);

    if (row) {
      return new Response("User has already voted", { status: 409, ...corsHeaders });
    } else {
      const reqText = await req.text();
      const parsedBody = JSON.parse(reqText);
      const { gamename } = parsedBody as { gamename: string };

      if (!gamename) {
        return new Response("Game name is required", { status: 400, ...corsHeaders });
      }

      const gameId = db.query("SELECT game_id FROM games WHERE name = ?").get(gamename) as number;

      if (!gameId) {
        return new Response("Provided game name couldn't be found in the database", { status: 400, ...corsHeaders });
      } else {
        db.run("INSERT INTO votes (game_name, user_name) VALUES (?, ?)", [gamename, username]);
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

    const gamename = db.query("SELECT game_name, COUNT(*) FROM votes GROUP BY game_name ORDER BY count DESC LIMIT 1").get();

    if (!gamename) {
      return new Response("No votes found", { status: 404, ...corsHeaders });
    } else {
      const responseBody = { gamename: gamename };
      return new Response(JSON.stringify(responseBody), { status: 200, ...corsHeaders });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}
