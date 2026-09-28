# 🏎️ Pacevion

> **A modern Formula 1 companion built for race fans.**

Pacevion is a premium Formula 1 dashboard built with **React, TypeScript, and Vite**. It brings race schedules, live countdowns, standings, results, and detailed race information together in a fast, responsive interface designed around the F1 experience.

## 📱 Download

### Android

[⬇️ Download Pacevion APK](https://github.com/ilkedenizz/Pacevion/releases)

Download the latest Android build from GitHub Releases.

### 🌐 Web

[🚀 Open Pacevion](https://ilkedenizz.github.io/Pacevion/)

---

## ✨ Features

* 🏁 **Race Calendar** — Follow the current Formula 1 season and upcoming races.
* ⏱️ **Race Countdown** — See how long remains until the next session.
* 🏆 **Driver Standings** — Track the championship standings.
* 🏎️ **Constructor Standings** — Follow team performance throughout the season.
* 📊 **Race Results** — Explore completed race results and session data.
* 📅 **Detailed Race Information** — Circuit, session and weekend details in one place.
* 📱 **Responsive UI** — Designed for desktop and mobile screens.
* 🌙 **Premium Dark Interface** — Motorsport-inspired visual design with a focused dashboard experience.

---

## 🛠️ Tech Stack

| Technology            | Purpose                     |
| --------------------- | --------------------------- |
| **React 18**          | UI framework                |
| **TypeScript**        | Type-safe development       |
| **Vite**              | Development & build tooling |
| **React Router v7**   | Application routing         |
| **TanStack Query v5** | Server state & caching      |
| **Lucide React**      | Interface icons             |
| **Recharts**          | Data visualization          |
| **CSS**               | Custom responsive styling   |

### F1 Data

Pacevion uses the **Jolpica F1 API** for Formula 1 data.

---

## 🏗️ Architecture

Pacevion follows a modular architecture with clear separation between data, state management, UI components and feature pages.

```text
src/
├── api/            # API clients and typed data models
├── components/
│   └── ui/         # Reusable UI components
├── hooks/          # React Query hooks
├── layout/         # Global layout and navigation
├── pages/          # Feature-specific pages
└── ...
```

### Data Flow

```text
Jolpica F1 API
       │
       ▼
   API Client
       │
       ▼
 TanStack Query
       │
       ▼
   React Hooks
       │
       ▼
 UI Components
       │
       ▼
 Feature Pages
```

---

## 🚀 Getting Started

### Requirements

* Node.js
* npm

### Installation

```bash
git clone https://github.com/ilkedenizz/Pacevion.git
cd Pacevion
npm install
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

---

## 📂 Project Structure

```text
Pacevion/
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── hooks/
│   ├── layout/
│   └── pages/
├── .github/
│   └── workflows/
├── index.html
├── package.json
└── README.md
```

---

## 🎯 Project Goals

Pacevion is designed to provide a single, polished place to follow the Formula 1 season without overwhelming the user with unnecessary information.

The project focuses on:

* Clean information hierarchy
* Fast navigation
* Responsive design
* Reusable architecture
* Real Formula 1 data
* A premium motorsport-inspired visual language

---

## 📌 Status

Pacevion is actively developed and continuously improved with new features, UI refinements and Formula 1 data integrations.

---

## 👨‍💻 Author

**İlke Deniz**

GitHub: [@ilkedenizz](https://github.com/ilkedenizz)

---

## 📄 License

This project is developed for educational and portfolio purposes.
