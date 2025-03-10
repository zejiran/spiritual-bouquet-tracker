import { Env, Offering, Recipient } from "./types";
import { v4 as uuidv4 } from "uuid";

const corsHeaders = (env: Env) => ({
  "Access-Control-Allow-Origin": env.CORS_ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          ...corsHeaders(env),
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      const url = new URL(request.url);
      const pathParts = url.pathname.split("/").filter(Boolean);

      if (url.pathname === "/api/recipients" && request.method === "POST") {
        return await handleCreateRecipient(request, env);
      } else if (
        pathParts.length === 3 &&
        pathParts[0] === "api" &&
        pathParts[1] === "recipients"
      ) {
        const recipientId = pathParts[2];
        return await handleGetRecipient(recipientId, env);
      } else if (
        pathParts.length === 4 &&
        pathParts[0] === "api" &&
        pathParts[1] === "recipients" &&
        pathParts[3] === "offerings"
      ) {
        const recipientId = pathParts[2];

        const recipientResponse = await getRecipientById(recipientId, env);
        if (!recipientResponse.recipient) {
          return createErrorResponse({
            message: "Recipient not found",
            status: 404,
            env,
          });
        }

        if (request.method === "GET") {
          return await handleGetOfferings(recipientId, env);
        } else if (request.method === "POST") {
          return await handleCreateOffering(recipientId, request, env);
        }
      }

      return new Response("Not Found", {
        status: 404,
        headers: corsHeaders(env),
      });
    } catch (error) {
      console.error("Error:", error);
      return new Response(
        JSON.stringify({
          error: "Internal Server Error",
          message: error instanceof Error ? error.message : "Unknown error",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders(env),
          },
        },
      );
    }
  },
};

function createErrorResponse({
  message,
  status = 400,
  error = "Bad Request",
  env,
}: {
  message: string;
  status?: number;
  error?: string;
  env: Env;
}): Response {
  return new Response(
    JSON.stringify({
      error,
      message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(env),
      },
    },
  );
}

async function validateOffering(offering: any): Promise<Offering> {
  const validTypes = ["eucaristia", "rosario", "ayuno", "horaSanta", "otro"];

  if (!offering || typeof offering !== "object") {
    throw new Error("Invalid offering data");
  }

  if (!offering.type || !validTypes.includes(offering.type)) {
    throw new Error("Invalid offering type");
  }

  if (
    !offering.userName ||
    typeof offering.userName !== "string" ||
    offering.userName.trim().length === 0
  ) {
    throw new Error("Invalid user name");
  }

  if (offering.imageUrl && typeof offering.imageUrl !== "string") {
    throw new Error("Invalid image URL format");
  }

  if (offering.comment && typeof offering.comment !== "string") {
    throw new Error("Invalid comment format");
  }

  if (!offering.timestamp || isNaN(Date.parse(offering.timestamp))) {
    throw new Error("Invalid timestamp");
  }

  return {
    type: offering.type,
    userName: offering.userName.trim(),
    imageUrl: offering.imageUrl?.trim() || "",
    comment: offering.comment?.trim() || "",
    timestamp: offering.timestamp,
    recipientId: offering.recipientId || "",
  };
}

async function handleGetOfferings(
  recipientId: string,
  env: Env,
): Promise<Response> {
  try {
    const { results } = await env.DB.prepare(
      "SELECT * FROM offerings WHERE recipient_id = ? ORDER BY timestamp DESC",
    )
      .bind(recipientId)
      .all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(env),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch offerings");
  }
}

async function handleCreateOffering(
  recipientId: string,
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const body = await request.json();
    const offering = await validateOffering(body);
    offering.recipientId = recipientId;

    const stmt = env.DB.prepare(
      "INSERT INTO offerings (type, userName, imageUrl, comment, timestamp, recipient_id) VALUES (?, ?, ?, ?, ?, ?)",
    );

    const result = await stmt
      .bind(
        offering.type,
        offering.userName,
        offering.imageUrl,
        offering.comment,
        offering.timestamp,
        offering.recipientId,
      )
      .run();

    if (!result.success) {
      throw new Error("Failed to create offering");
    }

    return new Response(
      JSON.stringify({
        message: "Offering created successfully",
        offering: {
          id: result.meta?.last_row_id,
          ...offering,
        },
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(env),
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse({ message: error.message, env });
    }
    throw error;
  }
}

async function validateRecipient(recipient: any): Promise<Recipient> {
  if (!recipient || typeof recipient !== "object") {
    throw new Error("Invalid recipient data");
  }

  if (
    !recipient.name ||
    typeof recipient.name !== "string" ||
    recipient.name.trim().length === 0
  ) {
    throw new Error("Invalid recipient name");
  }

  const id = recipient.id || uuidv4();
  const createdAt = new Date().toISOString();

  return {
    id,
    name: recipient.name.trim(),
    createdAt,
  };
}

async function getRecipientById(
  recipientId: string,
  env: Env,
): Promise<{ recipient: Recipient | null }> {
  try {
    const recipient = await env.DB.prepare(
      "SELECT * FROM recipients WHERE id = ?",
    )
      .bind(recipientId)
      .first();

    return { recipient: recipient as Recipient | null };
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch recipient");
  }
}

async function handleGetRecipient(
  recipientId: string,
  env: Env,
): Promise<Response> {
  try {
    const { recipient } = await getRecipientById(recipientId, env);
    if (!recipient)
      return createErrorResponse({
        message: "Recipient not found",
        status: 404,
        env,
      });

    return new Response(JSON.stringify(recipient), {
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders(env),
      },
    });
  } catch (error) {
    console.error("Database error:", error);
    throw new Error("Failed to fetch recipient");
  }
}

async function handleCreateRecipient(
  request: Request,
  env: Env,
): Promise<Response> {
  try {
    const body = await request.json();
    const recipient = await validateRecipient(body);

    const stmt = env.DB.prepare(
      "INSERT INTO recipients (id, name, created_at) VALUES (?, ?, ?)",
    );

    const result = await stmt
      .bind(recipient.id, recipient.name, recipient.createdAt)
      .run();

    if (!result.success) {
      throw new Error("Failed to create recipient");
    }

    return new Response(
      JSON.stringify({
        message: "Recipient created successfully",
        recipient,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders(env),
        },
      },
    );
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse({ message: error.message, env });
    }
    throw error;
  }
}
