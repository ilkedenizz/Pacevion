import fs from 'fs';

const indexCSS = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@700;800&display=swap');

:root {
  --color-bg: #050608;
  --color-surface: #101216;
  --color-surface-elevated: #1a1d24;
  --color-surface-highlight: #252a33;
  
  --color-border: rgba(255, 255, 255, 0.12);
  --color-border-subtle: rgba(255, 255, 255, 0.05);
  
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A0A5B5;
  --color-text-muted: #626775;
  
  --color-accent: #E10600;
  --color-accent-bright: #FF2A23;
  --color-accent-dim: rgba(225, 6, 0, 0.15);

  --color-trend-up: #00FF66;
  --color-trend-down: #FF3B30;
  --color-trend-same: #A0A5B5;
  
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  --bottom-nav-height: 64px;
  --bottom-safe-area: env(safe-area-inset-bottom, 0px);
  --page-bottom-spacing: calc(var(--bottom-nav-height) + var(--bottom-safe-area) + 24px);
  --page-top-spacing: calc(env(safe-area-inset-top, 24px) + 16px);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
  overflow-x: hidden;
  overscroll-behavior-y: none;
}

.font-heading {
  font-family: 'Inter', sans-serif;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* Typography utilities */
.editorial-num {
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 1;
}

.editorial-label {
  text-transform: uppercase;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.15em;
  color: var(--color-text-secondary);
}

.editorial-headline {
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

/* Animations */
.skeleton {
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-elevated) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse-ring {
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(225, 6, 0, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(225, 6, 0, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(225, 6, 0, 0); }
}

@keyframes pulse-ring-green {
  0% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(0, 255, 102, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 255, 102, 0); }
  100% { transform: scale(0.8); box-shadow: 0 0 0 0 rgba(0, 255, 102, 0); }
}

button {
  -webkit-tap-highlight-color: transparent;
  outline: none;
}

/* Data Viz Elements */
.trend-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  font-size: 14px;
  font-weight: 900;
}
.trend-up { color: var(--color-trend-up); }
.trend-down { color: var(--color-trend-down); }
.trend-same { color: var(--color-trend-same); }

.form-dots {
  display: flex;
  gap: 2px;
}
.form-dot {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: var(--color-surface-elevated);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8px;
  font-weight: 800;
  color: #fff;
}
.form-dot.win { background: #FFB800; color: #000; }
.form-dot.podium { background: #C0C0C0; color: #000; }
.form-dot.dnf { background: var(--color-accent); }

/* Common UI */
.brand-header {
  margin-bottom: var(--space-4);
  display: flex;
  flex-direction: column;
}

/* Safe Area Paddings */
.page-wrapper {
  padding-bottom: var(--page-bottom-spacing);
}
.page {
  padding-bottom: var(--page-bottom-spacing);
}
`;

fs.writeFileSync('src/index.css', indexCSS, 'utf8');

const homeCSS = `.home-page {
  min-height: 100vh;
  padding: var(--page-top-spacing) 16px var(--page-bottom-spacing) 16px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.home-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.hh-left {
  display: flex;
  flex-direction: column;
}

.h-title {
  font-size: 26px;
  letter-spacing: -0.04em;
  margin-bottom: -4px;
  color: #fff;
}

.h-season {
  font-size: 10px;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  font-weight: 800;
}

.hh-right {
  display: flex;
  align-items: center;
  gap: 6px;
  background: var(--color-surface);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-border);
}

.status-dot {
  width: 6px;
  height: 6px;
  background: #00FF66;
  border-radius: 50%;
}

.status-dot.pulse {
  animation: pulse-ring-green 2s infinite;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.hero-top-info {
  padding: 16px;
  border-bottom: 1px solid var(--color-border-subtle);
  background: linear-gradient(to right, var(--color-accent-dim), transparent);
}

.hero-race-name {
  font-size: 28px;
  line-height: 1.1;
  margin-top: 4px;
  letter-spacing: -0.03em;
  color: #fff;
}

.hero-race-loc {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 800;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.hero-countdown {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  padding: 20px 0;
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
}

.cd-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
}

.cd-num {
  font-size: 32px;
  color: #fff;
  letter-spacing: -0.05em;
}

.cd-lbl {
  color: var(--color-accent);
  font-weight: 900;
}

.cd-sep {
  font-size: 24px;
  font-weight: 900;
  color: var(--color-text-muted);
  margin-top: -12px;
}

.hero-circuit-container {
  height: 140px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.circuit-bg-glow {
  position: absolute;
  width: 150px;
  height: 150px;
  background: var(--color-accent);
  filter: blur(80px);
  opacity: 0.15;
  border-radius: 50%;
  pointer-events: none;
}

.hero-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--color-border-subtle);
}

.hs-item {
  background: var(--color-surface);
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.hs-val {
  font-size: 14px;
  color: #fff;
  margin-top: 4px;
  font-weight: 800;
}

/* Modules Grid */
.modules-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.module {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.module-row {
  display: flex;
  gap: 16px;
}

.module-row > .module {
  flex: 1;
}

.m-head {
  padding: 8px 12px;
  background: var(--color-surface-elevated);
  border-bottom: 1px solid var(--color-border-subtle);
  display: flex;
  align-items: center;
}

.m-body {
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
}

/* Leader Module */
.leader-body {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(90deg, var(--color-surface) 50%, rgba(255,128,0,0.1));
}

.leader-info {
  display: flex;
  flex-direction: column;
}

.leader-name {
  font-size: 18px;
  color: #fff;
}

.leader-pts-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 4px;
}

.leader-pts {
  font-size: 24px;
  color: #fff;
}

.leader-img-box {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-border);
  background: var(--color-surface-highlight);
}

.leader-portrait {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

/* Session & Track */
.m-title {
  font-size: 16px;
  color: #fff;
}

.m-val {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.sector-bars {
  display: flex;
  gap: 4px;
  margin-top: 8px;
}

.s-bar {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: var(--color-surface-elevated);
}

/* Weekend Timeline */
.timeline-list {
  padding: 12px 0;
}

.tl-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  position: relative;
}

.tl-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-surface-elevated);
  margin-right: 16px;
  border: 2px solid var(--color-border);
  z-index: 2;
}

.tl-item::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 24px;
  bottom: -8px;
  width: 2px;
  background: var(--color-surface-elevated);
  z-index: 1;
}

.tl-item:last-child::before {
  display: none;
}

.tl-item.done .tl-dot {
  background: var(--color-border);
  border-color: var(--color-text-secondary);
}
.tl-item.done::before {
  background: var(--color-border);
}

.tl-item.active .tl-dot {
  background: var(--color-accent);
  border-color: var(--color-accent);
}
.tl-item.active::before {
  background: var(--color-accent-dim);
}

.tl-name {
  font-size: 12px;
  color: var(--color-text-secondary);
  flex: 1;
  font-weight: 800;
}

.tl-time {
  font-size: 12px;
  color: var(--color-text-muted);
}

/* Podium */
.podium-grid {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 140px;
  padding: 16px 16px 0 16px;
  gap: 8px;
}

.pod-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.pod-step img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--color-surface-highlight);
  border: 2px solid var(--color-surface-elevated);
  margin-bottom: 8px;
  z-index: 2;
}

.pod-bar {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 8px;
  border-radius: 4px 4px 0 0;
  box-shadow: inset 0 2px 0 rgba(255,255,255,0.2);
}

.pod-bar span {
  font-size: 14px;
  font-weight: 900;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0,0,0,0.5);
}

.p1 img { width: 60px; height: 60px; border-color: #FFD700; margin-bottom: -10px; }
.p1 .pod-bar { height: 80px; }
.p2 .pod-bar { height: 60px; }
.p3 .pod-bar { height: 40px; }

/* Track Status Animations */
.track-status[data-status="GREEN"] .status-text { color: #00FF66; }
.track-status[data-status="GREEN"] .s-bar { background: #00FF66; }

.track-status[data-status="YELLOW"] .status-text { color: #FFB800; }
.track-status[data-status="YELLOW"] .s-bar { background: #FFB800; }

.track-status[data-status="RED"] .status-text { color: #E10600; }
.track-status[data-status="RED"] .s-bar { background: #E10600; }

.track-status[data-status="VSC"] .status-text { color: #FFB800; }
.track-status[data-status="VSC"] .s-bar { background: #FFB800; }

@keyframes statusPulse {
  0% { opacity: 1; }
  50% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes statusBlink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

@media (prefers-reduced-motion: no-preference) {
  .track-status[data-status="YELLOW"] .status-bars {
    animation: statusPulse 1s ease-in-out infinite;
  }
  .track-status[data-status="RED"] .status-bars {
    animation: statusBlink 0.65s steps(2) infinite;
  }
  .track-status[data-status="VSC"] .status-bars {
    animation: statusPulse 1.3s ease-in-out infinite;
  }
}
`;
fs.writeFileSync('src/pages/Home.css', homeCSS, 'utf8');

console.log("Rewrote index.css and Home.css successfully");
