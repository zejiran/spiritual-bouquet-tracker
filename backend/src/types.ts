import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export interface Offering {
  id?: number;
  type: string;
  userName: string;
  comment: string;
  timestamp: string;
}

export interface D1Result {
  success: boolean;
  meta?: {
    last_row_id?: number;
  };
}
