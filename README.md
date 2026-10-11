<div align="center">

# ✅ Automated Testing & Deployment Pipeline

### A full-stack Task Manager web application demonstrating a complete CI/CD pipeline

[![CI](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/ci.yml)
[![Deploy](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/deploy.yml/badge.svg)](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/deploy.yml)
[![Docker](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/docker.yml/badge.svg)](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions/workflows/docker.yml)
[![Backend Tests](https://img.shields.io/badge/backend%20tests-20%20passing-brightgreen)](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions)
[![Frontend Tests](https://img.shields.io/badge/frontend%20tests-36%20passing-brightgreen)](https://github.com/Gurudev-03/automated-testing-deployment-pipeline/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-8cc84b?logo=nodedotjs)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript)](https://typescriptlang.org)
[![SQLite](https://img.shields.io/badge/SQLite-sql.js-003b57?logo=sqlite)](https://sql.js.org)
[![Docker](https://img.shields.io/badge/Docker-multi--stage-2496ed?logo=docker)](https://docker.com)
[![Netlify](https://img.shields.io/badge/Netlify-deployed-00c7b7?logo=netlify)](https://netlify.com)

</div>

---

## 👥 Team Members

| # | Name | Role | Responsibility |
|---|------|------|----------------|
| 1 | **Kaviyarasan A** | Frontend Developer | React components, UI/UX |
| 2 | **Kesavaram K**   | Backend Developer  | Node.js API, SQLite database |
| 3 | **Kishorekumar S**| DevOps Engineer    | Docker, containerisation |
| 4 | **Gurudev S**     | CI/CD Engineer     | GitHub Actions pipeline |
| 5 | **Logeswaran C**  | QA / Deployment    | Testing, Netlify deployment |

---

## 📋 Project Overview

This project demonstrates a complete **Automated Testing & Deployment Pipeline** using a Task Manager web application as the subject.

### What it shows
- ✅ Automated unit tests on every code push
- ✅ Automated integration tests for the REST API
- ✅ Automated production build verification
- ✅ Automated deployment to Netlify on merge to main
- ✅ Docker containerisation with multi-stage builds
- ✅ Security hardening (helmet, CORS, CSP headers)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Developer Workflow                        │
│                                                             │
│   Write Code → git push → GitHub Actions fires             │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐ │
│   │              CI Pipeline (ci.yml)                    │ │
│   │                                                      │ │
│   │  ① Backend Tests   (Jest + Supertest)  20 tests     │ │
│   │  ② Frontend Tests  (Vitest + RTL)      36 tests     │ │
│   │  ③ Production Build (Vite + tsc)                    │ │
│   └──────────────────────────────────────────────────────┘ │
│                          ↓                                  │
│   ┌──────────────────────────────────────────────────────┐ │
│   │              CD Pipeline (deploy.yml)                │ │
│   │                                                      │ │
│   │  ④ Deploy Frontend → Netlify (production)           │ │
│   └──────────────────────────────────────────────────────┘ │
│                          ↓                                  │
│   ┌──────────────────────────────────────────────────────┐ │
│   │         Docker Pipeline (docker.yml)                 │ │
│   │                                                      │ │
│   │  ⑤ Build image → push to ghcr.io                   │ │
│   └──────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + TypeScript | Task Manager UI |
| Build Tool | Vite 5 | Dev server + bundler |
| Backend | Node.js + Express | REST API |
| Database | SQLite (sql.js) | Task storage |
| Frontend Tests | Vitest + Testing Library | 36 component tests |
| Backend Tests | Jest + Supertest | 20 API tests |
| CI/CD | GitHub Actions | Automated pipeline |
| Deployment | Netlify | Frontend hosting |
| Container | Docker + Nginx | Full-stack container |

---

## 📁 Project Structure

```
task-manager/
├── backend/                   ← Node.js + Express API
│   ├── src/
│   │   ├── app.js             ← Express app factory
│   │   ├── server.js          ← Entry point
│   │   ├── db.js              ← SQLite database
│   │   ├── routes/tasks.js    ← CRUD endpoints
│   │   └── middleware/        ← Error handlers
│   ├── tests/tasks.test.js    ← 20 API tests
│   └── package.json
│
├── frontend/                  ← React + TypeScript UI
│   ├── src/
│   │   ├── components/        ← Header, TaskForm, TaskCard, Filters
│   │   ├── test/              ← 36 component tests
│   │   ├── App.tsx            ← Main application
│   │   ├── api.ts             ← Backend API client
│   │   └── types.ts           ← TypeScript interfaces
│   └── package.json
│
├── .github/workflows/
│   ├── ci.yml                 ← Test + Build pipeline
│   ├── deploy.yml             ← Netlify deployment
│   └── docker.yml             ← Docker build + push
│
├── Dockerfile                 ← Multi-stage build
├── docker-compose.yml         ← Local full-stack dev
├── nginx.conf                 ← Production web server
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- npm ≥ 10
- Git

### Run Backend
```bash
cd backend
npm install
npm start
# API running at http://localhost:5000
```

### Run Frontend
```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

### Run with Docker
```bash
docker-compose up --build
# App at http://localhost:5173
# API at http://localhost:5000
```

---

## 🧪 Running Tests

### Backend (20 tests)
```bash
cd backend
npm test
```
```
✓ GET /health
✓ GET /api/tasks
✓ POST /api/tasks (create, validate, error cases)
✓ GET /api/tasks/:id
✓ PUT /api/tasks/:id
✓ PATCH /api/tasks/:id/status
✓ DELETE /api/tasks/:id
Tests: 20 passed
```

### Frontend (36 tests)
```bash
cd frontend
npm test
```
```
✓ Header.test.tsx    (9 tests)
✓ TaskForm.test.tsx  (9 tests)
✓ TaskCard.test.tsx  (10 tests)
✓ Filters.test.tsx   (8 tests)
Tests: 36 passed
```

---

## 🔄 CI/CD Pipeline Flow

```
Developer pushes code
        ↓
GitHub Actions triggers automatically
        ↓
┌── CI Pipeline ──────────────────────────────────┐
│  Job 1: Backend Tests    → Jest + Supertest     │
│  Job 2: Frontend Tests   → Vitest + RTL         │
│  Job 3: Frontend Build   → Vite production      │
│  Job 4: Summary Check    → All must pass ✅     │
└─────────────────────────────────────────────────┘
        ↓ (only if all pass AND branch is main)
┌── CD Pipeline ──────────────────────────────────┐
│  Run tests again → Build → Deploy to Netlify    │
└─────────────────────────────────────────────────┘
        ↓
┌── Docker Pipeline ──────────────────────────────┐
│  Build multi-stage image → Push to ghcr.io      │
└─────────────────────────────────────────────────┘
```

---

## 🌐 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/health` | Health check |
| GET    | `/api/tasks` | Get all tasks |
| GET    | `/api/tasks?status=pending` | Filter by status |
| GET    | `/api/tasks/:id` | Get single task |
| POST   | `/api/tasks` | Create task |
| PUT    | `/api/tasks/:id` | Update task |
| PATCH  | `/api/tasks/:id/status` | Update status only |
| DELETE | `/api/tasks/:id` | Delete task |

---

## 📄 License

MIT © 2026 — Kaviyarasan A, Kesavaram K, Kishorekumar S, Gurudev S, Logeswaran C
