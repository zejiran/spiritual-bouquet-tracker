import { Env, Offering } from './types';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          ...corsHeaders,
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    try {
      const url = new URL(request.url);

      if (url.pathname === '/api/offerings') {
        switch (request.method) {
          case 'GET':
            return await handleGetOfferings(env);
          case 'POST':
            return await handleCreateOffering(request, env);
          default:
            return new Response('Method Not Allowed', {
              status: 405,
              headers: corsHeaders,
            });
        }
      }

      return new Response('Not Found', {
        status: 404,
        headers: corsHeaders,
      });
    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
  },
};

async function validateOffering(offering: any): Promise<Offering> {
  const validTypes = ['eucaristia', 'rosario', 'ayuno', 'horaSanta', 'otro'];

  if (!offering || typeof offering !== 'object') {
    throw new Error('Invalid offering data');
  }

  if (!offering.type || !validTypes.includes(offering.type)) {
    throw new Error('Invalid offering type');
  }

  if (!offering.userName || typeof offering.userName !== 'string' || offering.userName.trim().length === 0) {
    throw new Error('Invalid user name');
  }

  if (offering.imageUrl && typeof offering.imageUrl !== 'string') {
    throw new Error('Invalid image URL format');
  }

  if (offering.comment && typeof offering.comment !== 'string') {
    throw new Error('Invalid comment format');
  }

  if (!offering.timestamp || isNaN(Date.parse(offering.timestamp))) {
    throw new Error('Invalid timestamp');
  }

  return {
    type: offering.type,
    userName: offering.userName.trim(),
    imageUrl: offering.imageUrl?.trim() || '',
    comment: offering.comment?.trim() || '',
    timestamp: offering.timestamp,
  };
}

async function handleGetOfferings(env: Env): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM offerings ORDER BY timestamp DESC'
    ).all();

    return new Response(JSON.stringify(results), {
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error('Database error:', error);
    throw new Error('Failed to fetch offerings');
  }
}

async function handleCreateOffering(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json();
    const offering = await validateOffering(body);

    const stmt = env.DB.prepare(
      'INSERT INTO offerings (type, userName, imageUrl, comment, timestamp) VALUES (?, ?, ?, ?, ?)'
    );

    const result = await stmt.bind(
      offering.type,
      offering.userName,
      offering.imageUrl,
      offering.comment,
      offering.timestamp
    ).run();

    if (!result.success) {
      throw new Error('Failed to create offering');
    }

    return new Response(
      JSON.stringify({
        message: 'Offering created successfully',
        offering: {
          id: result.meta?.last_row_id,
          ...offering,
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({
          error: 'Bad Request',
          message: error.message,
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }
    throw error;
  }
}
