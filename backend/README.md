# SIH2025 Backend

Express API serving tourism data for the frontend.

## Endpoints
Base path: `/api`

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | /health | Health check |
| GET | /api/places | List places |
| GET | /api/places/:id | Get a place |
| GET | /api/tours | List virtual tours |
| GET | /api/tours/:id | Get virtual tour |
| GET | /api/audio-guides | List audio guides |
| GET | /api/audio-guides/:id | Get audio guide |
| GET | /api/maps/points | Map points |
| GET | /api/manuscripts | List manuscripts |
| GET | /api/manuscripts/:id | Get manuscript |
| POST | /api/manuscripts/upload | Upload manuscript image (placeholder) |
| POST | /api/manuscripts/translate | Request translation job |
| GET | /api/manuscripts/translate/job/:jobId | Poll translation job |
| GET | /api/search?q=term&type=all | Unified search |
| POST | /api/places | Create place (in-memory) |

## Run

```bash
npm install
npm run dev
```

## Env
Copy `.env.example` to `.env` and adjust.
