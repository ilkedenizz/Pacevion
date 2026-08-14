# Pacevion

Pacevion is an independent Formula 1 fan-made data platform designed to explore race calendars, championship standings, drivers, constructors and race results through a clean motorsport-focused interface.

[Live Demo](https://ilkedenizz.github.io/Pacevion/)

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat-square&logo=vite&logoColor=FFD627)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=flat-square&logo=react-query&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## ⚠️ Disclaimer

Pacevion is an independent, unofficial Formula 1 fan project created for informational and entertainment purposes. 

Pacevion is not affiliated with, endorsed by, or officially connected to Formula 1, Formula 1 companies, FIA, teams, drivers, or other rights holders. 

Formula 1, FIA, team names, driver names, trademarks and related properties belong to their respective owners.

---

## ✨ Features

- **Premium Motorsport Dashboard**: A graphite-themed homepage displaying the core F1 season metrics and countdowns at a glance.
- **Next Race Countdown**: Automatically computes the next upcoming Grand Prix round date, time, and tracks local countdown telemetry every second.
- **Season Statistics**: Real-time summary counters parsing completed rounds, total calendar length, leader points, and constructors.
- **Driver Championship Standings**: An interactive sports-analytics table displaying driver ranks, constructors, and points with custom badge highlights.
- **Latest Race Results**: Displays podium classification (P1/P2/P3), teams, and point payouts for the most recently completed race.
- **Standings Analytics Chart**: Renders a custom Recharts comparison bar chart plotting points distribution across the grid's top drivers.
- **Race Calendar**: A comprehensive round-by-round timeline page filtering all, completed, and upcoming races with layout focus indicators.
- **First-Visit Disclaimer**: An accessible, cookie-less welcome dialog overlay to inform visitors of the unofficial project scope.
- **Jolpica F1 API Client**: Centralized native `fetch` client fetching real-time telemetry datasets directly from public APIs.

---

## 🏎️ Roadmap

### Completed
- **Dashboard**: Core widgets, podium classifications, standings summaries.
- **Next Race Hero**: Dynamic count-downs and circuit track sector maps.
- **Race Calendar**: Timeline page with completed/upcoming round filter tabs.
- **Championship Analytics**: Driver points bar chart distribution comparison.
- **First-Visit Disclaimer**: Modal backdrop scroll lock and acceptance persistence.
- **GitHub Pages Deployment**: Automated CI/CD deployment workflows.

### In Progress
- **Standings Page**: Detailed tabbed tables for full Driver and Constructor standings.

### Planned
- **Race Weekend Details**: Qualifying grids, sprint classification, pit stops, and telemetry analysis.
- **Drivers Directory**: Profile pages listing driver numbers, nationalities, bios, and history.
- **Constructors Directory**: F1 team profiles, histories, engines, and driver lineups.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite 8](https://vite.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Server State**: [TanStack Query v5](https://tanstack.com/query)
- **Charts**: [Recharts v2](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Native CSS (premium motorsport graphite design system)
- **CI/CD & Hosting**: GitHub Actions & GitHub Pages

---

## 📡 Data

Pacevion consumes real-time Formula 1 statistics from the [Jolpica F1 API](https://jolpi.ca/), which replicates the Ergast developer database structure. 

The client handles the following live endpoints:
- `/current.json` (Season Calendar)
- `/current/driverStandings.json` (Championship Standings)
- `/:season/:round/results.json` (Individual Race Classification Results)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ilkedenizz/Pacevion.git
   cd Pacevion
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Build the production application bundle:
   ```bash
   npm run build
   ```
