// createUser.ts

import { corsHeaders } from './config.ts';

export async function getCookieUsername(req: Request): Promise<string | void> {
  return req.headers.get('Cookie')?.split('; ').find(row => row.startsWith('user='))?.split('=')[1];
}

export async function createUser(req: Request): Promise<Response> {
  try {
    const reqText = await req.text();
    const parsedBody = JSON.parse(reqText);
    const { username } = parsedBody as { username: string };

    if (!username) {
      return new Response("User name is required", { status: 400 , ...corsHeaders});
    }
    return new Response("User added!", { status: 201, headers: { 'Set-Cookie': `user=${username}; Path=/vote; HttpOnly; SameSite=Lax`, ...corsHeaders.headers } });
  } catch (error) {
    console.log(error);
    return new Response("Internal server error", { status: 500, ...corsHeaders });
  }
}
