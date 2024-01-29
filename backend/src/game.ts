// game.ts

import db from './database.ts';
import { corsHeaders } from './config.ts';

export async function addGame(req: Request): Promise<Response> {
  try {
    const reqText = await req.text();
    const parsedBody = JSON.parse(reqText);
    const { gamename } = parsedBody as { gamename: string };

    if (!gamename) {
      return new Response("Game name is required", { status: 400, ...corsHeaders });
    }

    gamename.trim().toLowerCase();

    const row = db.query("SELECT * FROM games WHERE name = ?").get(gamename);

    if (row) {
      return new Response("Game already exists in database", { status: 409, ...corsHeaders });
    } else {
      db.query("INSERT INTO games (name) VALUES (?)").run(gamename);
      return new Response("Game added!", { status: 201, ...corsHeaders });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}

export async function removeGame(req: Request): Promise<Response> {
  try {
    const reqText = await req.text();
    const parsedBody = JSON.parse(reqText);
    const { gamename } = parsedBody as { gamename: string };

    if (!gamename) {
      return new Response("Game name is required", { status: 400, ...corsHeaders });
    }

    gamename.trim().toLowerCase();

    const row = db.query("SELECT * FROM games WHERE name = ?").get(gamename);

    if (!row) {
      return new Response("Game couldn't be found in the database", { status: 404, ...corsHeaders });
    } else {
      db.run("DELETE FROM games WHERE name = ?", [gamename]);
      db.run("DELETE FROM votes WHERE game_name = ?", [gamename])
      return new Response("Game removed!", { status: 200, ...corsHeaders });
    }
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}
