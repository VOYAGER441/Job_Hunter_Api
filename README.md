# Job Hunter API

Job Hunter API is a Node.js + TypeScript Express backend for the Job Hunter project. It verifies Appwrite tokens, issues backend JWTs, stores user/job data in MongoDB, and provides job-related endpoints.

## Key features

- Appwrite server SDK integration
- Custom JWT session tokens
- MongoDB (mongoose) data storage
- Redis integration (optional)
- TypeScript codebase

## Prerequisites

- Node.js (v16+ recommended)
- npm
- Appwrite instance (cloud or self-hosted) if using Appwrite auth
- MongoDB database
- (Optional) Redis for caching

## Installation

```bash
git clone <repository_url>
cd Job_Hunter_Api
npm install
```

## Configuration

Copy `.env.example` to `.env` and set values. Important variables used by the app:

```env
PORT=5040
APP_URL=http://localhost:5000
MONGODB_URI=mongodb://localhost:27017/job_hunter_db
APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=your_project_id
APPWRITE_API_KEY=your_appwrite_server_api_key
JWT_SECRET=your_super_secret_jwt_key
LOG_LEVEL=info
LOG_OUTPUT=console
LOG_FILE_PATH=logs/app.log
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=0
```

Notes:
- The code expects `MONGODB_URI` (see `src/environment/env.ts`).
- `JWT_SECRET` and optional `JWT_EXPIRES_IN`/`JWT_REFRESH_EXPIRES_IN` control JWT behavior.

## Scripts

- `npm run dev` — start in development (nodemon)
- `npm run build` — compile TypeScript
- `npm start` — start the app (nodemon in package.json currently)

Example:
```bash
npm run dev
```

## API Endpoints (summary)

- GET /  — health check (returns "Hello World From Job Hunter API")
- POST /v2/auth/jwtVerify/:jwtFromAppwrite — verify Appwrite JWT and return backend token
- GET  /v2/auth/googleLogin — start Google OAuth login flow
- GET  /v2/auth/oauth/callback — OAuth callback
- GET  /v2/auth/logout — logout
- GET  /v2/jobs — list jobs

Note: routes are mounted under `/v2` in `src/app.ts`.

## Project structure

Same as the repository layout under `src/` (controllers, models, routes, services, etc.).

## Contributing

- Follow project's TypeScript and linting styles
- Run `npm run build` and tests (if any) before submitting PRs

## Troubleshooting

- Ensure `.env` values match your environment (MongoDB, Appwrite, Redis credentials).
- Check logs; default output is console. Configure `LOG_OUTPUT`/`LOG_FILE_PATH` as needed.

---

If anything in this README should be different for your setup, tell me what to change and an updated README will be applied.