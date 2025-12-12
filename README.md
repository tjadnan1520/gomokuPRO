# GomokuPRO

A web-based Gomoku (Five in a Row) game with AI opponent, persistent game records, and a responsive React + Vite frontend backed by an Express/MongoDB API.

## Features
- Play Gomoku against an AI engine or another human player in the browser
- Persistent game records stored in MongoDB
- Scoreboard, game details modal, and game settings
- Lightweight backend API for managing games

## Tech stack
- Backend: Node.js, Express, Mongoose (MongoDB), dotenv
- Frontend: React, Vite

## Project structure

- `Backend/` — Express API and MongoDB models
- `Frontend/` — React app (Vite) and UI components

## Prerequisites
- Node.js (v16+ recommended)
- npm (or yarn)
- MongoDB instance (local or hosted)

## Installation

1. Clone the repository

```bash
git clone https://github.com/tjadnan1520/gomokuPRO.git
cd gomokuPRO
```

2. Install backend dependencies

```bash
cd Backend
npm install
```

3. Install frontend dependencies

```bash
cd ../Frontend
npm install
```

## Environment

Create a `.env` file in the `Backend/` folder with at least the MongoDB connection string. Example:

```
MONGO_URI=mongodb://localhost:27017/gomoku
PORT=4000
FRONTEND_URL=http://localhost:5173
```

Notes:
- `MONGO_URI` is required for the backend to connect to MongoDB.
- `PORT` is optional (defaults to `4000`).
- `FRONTEND_URL` defaults to the Vite dev server at `http://localhost:5173`.

## Running (development)

1. Start the backend

```bash
cd Backend
npm run dev
```

2. Start the frontend (in a separate terminal)

```bash
cd Frontend
npm run dev
```

Open the frontend at the Vite dev URL (typically `http://localhost:5173`) and the backend at `http://localhost:4000` by default.

## API

Important endpoints (backend):

- `GET /api/health` — health check
- `POST /api/games` — create a game (see `Backend/routes/games.js`)
- `GET /api/games` — list games
- `GET /api/games/:id` — game details

See `Backend/routes/games.js` for the exact API shape and additional endpoints.

## Building for production

1. Build the frontend

```bash
cd Frontend
npm run build
```

2. Serve the built `dist/` with a static server or integrate into the backend (not configured by default). You can preview the build locally with:

```bash
npm run preview
```

## Development notes
- Backend: starts with `node server.js` (scripts: `start`, `dev`) and uses `MONGO_URI` to connect to MongoDB.
- Frontend: powered by Vite (`npm run dev`), default port for Vite is `5173`.

## Contributing
Contributions welcome — open an issue or submit a pull request with a description of changes and any setup steps.
