// user.ts

import { corsHeaders } from './config.ts';

export async function checkUser(req: Request): Promise<Response> {
  try {
    const reqText = await req.text();
    const parsedBody = JSON.parse(reqText);
    const { username } = parsedBody as { username: string };

    if (!username) {
      return new Response("User name is required", { status: 400 , ...corsHeaders});
    }

    username.trim().toLowerCase();
    if (username.length <= 0) {
      return new Response("User name wasn't composed of valid characters", { status: 400, ...corsHeaders });
    }
    return new Response("User name is valid!", { status: 201, ...corsHeaders });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}
