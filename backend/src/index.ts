import { Env, Offering } from './types';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://spiritual-bouquet-tracker.pages.dev',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      const url = new URL(request.url);

      if (url.pathname === '/api/offerings') {
        if (request.method === 'GET') {
          return await handleGetOfferings(env);
        } else if (request.method === 'POST') {
          return await handleCreateOffering(request, env);
        }
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};

async function handleGetOfferings(env: Env): Promise<Response> {
  const { results } = await env.DB.prepare(
    'SELECT * FROM offerings ORDER BY timestamp DESC'
  ).all();

  return new Response(JSON.stringify(results), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

async function handleCreateOffering(request: Request, env: Env): Promise<Response> {
  const offering: Offering = await request.json();

  const { success } = await env.DB.prepare(
    'INSERT INTO offerings (type, userName, comment, timestamp) VALUES (?, ?, ?, ?)'
  )
    .bind(offering.type, offering.userName, offering.comment || '', offering.timestamp)
    .run();

  if (!success) {
    return new Response('Failed to create offering', { status: 500 });
  }

  return new Response(JSON.stringify(offering), {
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}
