import { D1Database } from '@cloudflare/workers-types';

export interface Env {
  DB: D1Database;
}

export interface Offering {
  id?: string;
  type: string;
  userName: string;
  comment?: string;
  timestamp: string;
}
