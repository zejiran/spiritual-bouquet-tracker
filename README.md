# Spiritual Bouquet Tracker

💐 A digital tool for managing collective spiritual offerings and prayers. Built with React, TypeScript, and Cloudflare Workers, it allows groups to track masses, rosaries, and other spiritual offerings in real-time.

## What is a Spiritual Bouquet?

A spiritual bouquet is a collection of prayers, sacrifices, and good works offered for someone's intention. It's like giving someone a bouquet of flowers, but instead of physical flowers, you're offering spiritual gifts like Masses, rosaries, fasting, and other devotions.

## Features

- Create spiritual bouquets for individuals or intentions.
- Track different types of offerings (Masses, rosaries, fasting, holy hours, etc.).
- Share unique links to allow others to contribute their offerings.
- View summaries and statistics of all contributions.
- Responsive design that works on mobile and desktop.

## Screenshots

### Homepage
<img width="1567" alt="Screenshot 2025-03-06 at 4 23 39 PM" src="https://github.com/user-attachments/assets/69c5aa82-258b-4e3b-95dc-a203fc7f7008" />

### Creating a Bouquet
<img width="1567" alt="Screenshot 2025-03-06 at 4 24 13 PM" src="https://github.com/user-attachments/assets/b5304b30-c42c-437a-8dd0-b33c4f6c4ca0" />
<img width="1567" alt="Screenshot 2025-03-06 at 4 28 25 PM" src="https://github.com/user-attachments/assets/da457a8d-c93f-4343-ad1f-856ba92e88e0" />

### Adding an Offering
<img width="1567" alt="Screenshot 2025-03-06 at 4 28 44 PM" src="https://github.com/user-attachments/assets/cad9f6f7-b858-40dc-8ba6-8121e1d20cf2" />

### Viewing Offerings
<img width="1567" alt="Screenshot 2025-03-06 at 4 29 28 PM" src="https://github.com/user-attachments/assets/f2793937-2dbe-4487-a1d4-cb08f3ba1129" />
<img width="1567" alt="Screenshot 2025-03-06 at 4 29 31 PM" src="https://github.com/user-attachments/assets/7d9b7e55-1146-409a-acfe-d9babefa76ce" />

## Local Development

### Prerequisites

- Node.js 18+ and npm.
- Wrangler CLI (`npm install -g wrangler`).
- Cloudflare account.

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/zejiran/spiritual-bouquet-tracker.git
   cd spiritual-bouquet-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env` files:

   For the server (in `/server` directory):

   ```
   # No environment variables needed for local development
   ```

   For the web (in `/web` directory):

   ```
   VITE_API_URL=http://localhost:8787/api
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

   > Note: To use image uploads, you'll need to sign up for a free [ImgBB](https://imgbb.com/) account and get an API key.

4. Start development servers:

   Start both frontend and backend:

   ```bash
   npm run dev
   ```

   Or start them individually:

   ```bash
   # Frontend only
   npm run dev:web

   # Backend only
   npm run dev:server
   ```

## Deployment to Cloudflare

### 1. Prepare your Cloudflare account

1. [Sign up](https://dash.cloudflare.com/sign-up) for a Cloudflare account if you don't have one.
2. Install the Wrangler CLI:
   ```bash
   npm install -g wrangler
   ```
3. Login to Cloudflare:
   ```bash
   wrangler login
   ```

### 2. Deploy the database

1. Create a D1 database:

   ```bash
   cd server
   wrangler d1 create spiritual-bouquet-db
   ```

2. Note the database ID from the output and update the `wrangler.toml` file:

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "spiritual-bouquet-db"
   database_id = "your-database-id"
   ```

3. Apply the schema:
   ```bash
   wrangler d1 execute spiritual-bouquet-db --file=./schema.sql
   ```

### 3. Deploy the backend API

1. From the server directory, deploy the worker:

   ```bash
   cd server
   wrangler deploy
   ```

2. Note the API URL (e.g., `https://spiritual-bouquet-api.username.workers.dev`) for frontend configuration.

### 4. Deploy the frontend

1. Create a `.env` file in the web directory:

   ```
   VITE_API_URL=https://spiritual-bouquet-api.username.workers.dev/api
   VITE_IMGBB_API_KEY=your_imgbb_api_key
   ```

2. Deploy to Cloudflare Pages:

   ```bash
   cd web
   wrangler pages deploy ./dist
   ```

3. In the Cloudflare Pages dashboard, add the environment variables:
   - `VITE_API_URL=https://spiritual-bouquet-api.username.workers.dev/api`
   - `VITE_IMGBB_API_KEY=your_imgbb_api_key`

### 5. Configure CORS

1. Update the CORS headers in `server/src/index.ts` to match your frontend domain:

   ```typescript
   const corsHeaders = {
     "Access-Control-Allow-Origin": "https://your-frontend-domain.pages.dev",
     // ...other headers
   };
   ```

2. Redeploy the server:
   ```bash
   cd server
   wrangler deploy
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes (`git commit -m 'Add some amazing feature'`).
4. Push to the branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

- **[MIT license](LICENSE)**
- Copyright 2025 © Juan Alegría
