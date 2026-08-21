import fs from 'fs';

const calendarCSS = `.calendar-page {
  min-height: 100vh;
  padding: var(--page-top-spacing) 16px var(--page-bottom-spacing) 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.cal-header {
  display: flex;
  flex-direction: column;
}

.cal-title {
  font-size: 26px;
  letter-spacing: -0.04em;
  color: #fff;
}

.cal-subtitle {
  font-size: 12px;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  font-weight: 800;
}

.cal-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cal-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 3px solid var(--color-accent);
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  overflow: hidden;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.cal-card:active {
  transform: scale(0.98);
  border-color: var(--color-text-secondary);
}

.cal-card-top {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border-subtle);
  background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 100%);
}

.cal-round-box {
  background: var(--color-surface-elevated);
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
}

.cal-round {
  font-size: 10px;
  color: var(--color-accent);
  letter-spacing: 0.1em;
}

.cal-race-title {
  font-size: 20px;
  color: #fff;
  letter-spacing: -0.02em;
  margin-top: 12px;
}

.cal-date-range {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-top: 4px;
}

.cal-flag {
  width: 48px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid var(--color-border);
  object-fit: cover;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
}

.cal-sessions {
  padding: 12px 16px;
  background: var(--color-bg);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cal-session-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cal-session-name {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 700;
  text-transform: uppercase;
}

.cal-session-time {
  font-size: 12px;
  color: #fff;
}

.cal-session-row.main {
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1px dashed var(--color-border-subtle);
}

.cal-session-row.main .cal-session-name {
  color: #fff;
}

.cal-session-row.main .cal-session-time {
  color: var(--color-accent);
}
`;
fs.writeFileSync('src/pages/Calendar.css', calendarCSS, 'utf8');
console.log("Rewrote Calendar.css successfully");
