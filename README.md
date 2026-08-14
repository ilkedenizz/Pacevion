# Pacevion

Pacevion is a premium, portfolio-quality Formula 1 dashboard application built with React, TypeScript, and Vite. It consumes real-time F1 data from the Jolpica F1 API to provide dynamic countdowns, standings, results, and detailed calendar statistics.

## Tech Stack
- **Framework**: React 18.2.0 + Vite
- **Language**: TypeScript
- **Routing**: React Router v7
- **Server State**: TanStack Query (React Query v5)
- **Styling**: Native CSS with a premium motorsport-inspired dark theme and subtle carbon texture
- **Icons**: Lucide React
- **Charts**: Recharts (preconfigured with theme variables)

## Architecture
Pacevion follows a strict modular separation of concerns:
1. **API Client (`src/api/`)**: Centralized native `fetch` client and strongly-typed endpoints generated directly from the Ergast/Jolpica response schemas.
2. **React Query Hooks (`src/hooks/`)**: Wraps API calls to manage caching, refetching, and pagination state.
3. **UI Atoms (`src/components/ui/`)**: Reusable presentation components (`Card`, `Loader`, `ErrorState`).
4. **Layout Primitives (`src/layout/`)**: Consistent global structure (`Header`, `Navigation`, `AppLayout`) with mobile-responsive horizontal tab transitions.
5. **Feature Pages (`src/pages/`)**: Domain-specific dashboard and schedule interfaces (Dashboard, Race Calendar, etc.).
