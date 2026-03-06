# SkillForge

SkillForge is an AI-powered personalized learning platform that helps students track progress, manage learning paths, take quizzes, and receive intelligent course recommendations. It features a full-stack architecture with a React dashboard, a Node.js REST API, Supabase PostgreSQL for persistent storage, and an AI recommendation engine powered by configurable language models.

---

## Features

- **Authentication** — Secure registration and login via Supabase Auth with JWT-based session management
- **Learning Progress Tracking** — Per-topic progress percentages, XP, study time, and streak tracking with chart analytics
- **Quiz System** — Browse and take quizzes; answers are scored server-side with XP rewards
- **AI Recommendation Engine** — Generates personalized next-topic recommendations using GLM or Ollama language models
- **Resource Library** — Filterable resource catalog by topic and type
- **Learning Path Modules** — Structured curriculum with modules and individual lessons
- **Weekly Activity Tracking** — Kanban and list views of planned vs completed weekly study activities
- **Notifications Panel** — Per-user notification feed with mark-all-as-read support
- **Upcoming Deadlines Widget** — Shows the next 5 deadlines sorted by due date with urgency indicators
- **Analytics Dashboard** — Weekly study hours, monthly progress, and activity breakdown charts

---

## Tech Stack

### Frontend

| Technology             | Purpose                           |
| ---------------------- | --------------------------------- |
| React 18               | UI framework                      |
| Vite 6                 | Build tool and dev server         |
| TypeScript             | Static typing                     |
| Tailwind CSS 4         | Utility-first styling             |
| Framer Motion (motion) | Animations and transitions        |
| Recharts               | Progress and activity charts      |
| React Router 7         | Client-side routing               |
| Radix UI               | Accessible headless UI components |
| shadcn/ui              | Component library built on Radix  |
| Lucide React           | Icon set                          |
| React DnD              | Drag-and-drop for Kanban board    |
| Sonner                 | Toast notifications               |

### Backend

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| Node.js (ESM)      | Runtime                         |
| Express 4          | HTTP server and routing         |
| Supabase JS        | PostgreSQL client and Auth      |
| Supabase Auth      | JWT-based user authentication   |
| Zod                | Schema validation               |
| Helmet             | Security headers                |
| express-rate-limit | Brute-force protection          |
| dotenv             | Environment variable management |
| nodemon            | Development hot-reload          |

---

## System Architecture

```
Browser (React + Vite)
        |
        | HTTP + Bearer JWT
        v
  Express API (Node.js)
        |
   +---------+----------+
   |         |          |
   v         v          v
Supabase  Supabase   AI Service
Postgres    Auth    (GLM / Ollama)
```

**Request flow:**

1. The React frontend calls the Express API via `apiFetch`, which automatically attaches the Supabase JWT from `localStorage`.
2. `authMiddleware` validates every protected route by calling `supabase.auth.getUser(token)` server-side.
3. Controllers delegate to service modules, which interact with Supabase using the parameterized query builder.
4. For recommendations, the backend builds a prompt from user data, sends it to the configured AI provider, parses the JSON response, and persists the result.

---

## Folder Structure

```
skill-forge/
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── components/
│       │   │   ├── auth/           # ProtectedRoute
│       │   │   ├── features/       # Dashboard widgets
│       │   │   ├── layouts/        # DashboardLayout, Header, Sidebar
│       │   │   └── ui/             # shadcn/ui primitives
│       │   ├── pages/              # Route-level page components
│       │   └── routes.ts           # React Router configuration
│       ├── contexts/
│       │   └── AuthContext.tsx     # Global auth state
│       ├── lib/
│       │   └── api.ts              # Centralized apiFetch wrapper
│       └── services/               # API service modules (one per domain)
│
└── backend/
    └── src/
        ├── controllers/            # HTTP handlers
        ├── routes/                 # Express Router definitions
        ├── services/               # Data-access and business logic
        ├── middleware/
        │   ├── authMiddleware.js   # JWT validation
        │   └── rateLimit.js        # Login rate limiter
        ├── utils/
        │   ├── authValidation.js   # Zod schemas for auth
        │   ├── promptBuilder.js    # AI prompt construction
        │   └── scoreCalculator.js  # Quiz scoring logic
        ├── database/
        │   ├── supabaseClient.js
        │   └── migrations/         # SQL migration files (001–007)
        └── server.js               # Express app entry point
```

---

## API Endpoints

All endpoints marked (protected) require an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint             | Auth     | Description                                         |
| ------ | -------------------- | -------- | --------------------------------------------------- |
| POST   | `/api/auth/register` | Public   | Create a new user account                           |
| POST   | `/api/auth/login`    | Public   | Sign in and receive a JWT (rate-limited: 5 req/min) |
| GET    | `/api/auth/me`       | Public\* | Get the currently authenticated user                |

### Progress

| Method | Endpoint               | Auth      | Description                                          |
| ------ | ---------------------- | --------- | ---------------------------------------------------- |
| GET    | `/api/progress`        | Protected | Aggregated stats and per-topic progress              |
| GET    | `/api/progress/weekly` | Protected | Weekly activity rows                                 |
| GET    | `/api/progress/charts` | Protected | Chart datasets (weekly, monthly, activity breakdown) |
| POST   | `/api/progress/update` | Protected | Create or update a topic's progress                  |

### Quizzes

| Method | Endpoint               | Auth      | Description                                  |
| ------ | ---------------------- | --------- | -------------------------------------------- |
| GET    | `/api/quizzes`         | Optional  | List all quizzes with question counts        |
| GET    | `/api/quizzes/:quizId` | Public    | Get a single quiz (correct answers stripped) |
| POST   | `/api/quizzes/submit`  | Protected | Submit answers; returns score and XP earned  |

### Resources

| Method | Endpoint         | Auth      | Description                                            |
| ------ | ---------------- | --------- | ------------------------------------------------------ |
| GET    | `/api/resources` | Protected | Fetch resources (filterable by `?topic=` and `?type=`) |

### Recommendations

| Method | Endpoint                        | Auth      | Description                                          |
| ------ | ------------------------------- | --------- | ---------------------------------------------------- |
| GET    | `/api/recommendations`          | Protected | Retrieve the most recent AI recommendation           |
| POST   | `/api/recommendations/generate` | Protected | Trigger AI pipeline to generate a new recommendation |

### Notifications

| Method | Endpoint                  | Auth      | Description                          |
| ------ | ------------------------- | --------- | ------------------------------------ |
| GET    | `/api/notifications`      | Protected | Latest 10 notifications for the user |
| POST   | `/api/notifications/read` | Protected | Mark all notifications as read       |

### Deadlines

| Method | Endpoint         | Auth      | Description                                  |
| ------ | ---------------- | --------- | -------------------------------------------- |
| GET    | `/api/deadlines` | Protected | Next 5 upcoming deadlines sorted by due date |

### Learning Path

| Method | Endpoint             | Auth      | Description                            |
| ------ | -------------------- | --------- | -------------------------------------- |
| GET    | `/api/learning-path` | Protected | All learning modules and their lessons |

---

## Environment Variables

### Backend — `backend/.env`

```env
# Server
PORT=5000
NODE_ENV=development

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Provider — choose "ollama" (default) or "glm"
AI_PROVIDER=ollama

# Ollama (cloud or local)
OLLAMA_URL=https://ollama.com
OLLAMA_MODEL=glm-5:cloud
OLLAMA_API_KEY=your_ollama_api_key

# ZhipuAI GLM (alternative provider)
# GLM_API_KEY=your_glm_api_key
```

A template is available at `backend/.env.example`.

### Frontend

The API base URL is defined in `frontend/src/lib/api.ts`. For production, update the `API_BASE` constant (or convert it to a `VITE_API_BASE_URL` environment variable) to point to your deployed backend.

---

## Installation

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project with Auth enabled

### 1. Clone the repository

```bash
git clone https://github.com/webpromahdi/skill-forge.git
cd skill-forge
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure backend environment

```bash
cp .env.example .env
# Edit .env and fill in SUPABASE_URL, SUPABASE_ANON_KEY, and AI keys
```

### 4. Run database migrations

Apply the SQL files in `backend/src/database/migrations/` to your Supabase project in order (001 through 007) via the Supabase SQL editor or the Supabase CLI.

### 5. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 6. Start the backend

```bash
cd ../backend
npm run dev
# API runs on http://localhost:5000
```

### 7. Start the frontend

```bash
cd ../frontend
npm run dev
# App runs on http://localhost:5173
```

---

## Security Features

- **Rate limiting** — Login endpoint limited to 5 requests per minute per IP (`express-rate-limit`)
- **Helmet** — Sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and other security headers on every response
- **Auth middleware** — All private routes validate the Supabase JWT server-side before processing
- **Zod input validation** — Auth, quiz submission, and progress update endpoints validate request bodies against strict schemas
- **Safe error responses** — No stack traces or raw error messages are returned to clients in production; internal errors are logged server-side only
- **CORS restrictions** — Only `http://localhost:5173` is permitted as a cross-origin request source (update for production domain)
- **No secrets in source** — All credentials loaded exclusively from environment variables; `.env` is in `.gitignore`
- **Row-Level Security** — All Supabase tables have RLS policies enforcing that users can only access their own data

---

## Future Improvements

- Real-time notifications via Supabase Realtime subscriptions
- Adaptive quiz difficulty based on historical performance
- Resource bookmarking and personal reading lists
- Role-based access control (student / instructor / admin)
- Advanced analytics with cohort comparison and goal setting
- Mobile-responsive PWA with offline quiz support
- `VITE_API_BASE_URL` environment variable for zero-config frontend deployment

---

## Author

[github.com/webpromahdi](https://github.com/webpromahdi)
