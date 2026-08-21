import fs from 'fs';

const liveFeedCSS = `.live-page {
  min-height: 100vh;
  padding: var(--page-top-spacing) 16px var(--page-bottom-spacing) 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.lf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.lf-title {
  font-size: 26px;
  letter-spacing: -0.04em;
  color: #fff;
}

.lf-status-badge {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 255, 102, 0.1);
  padding: 6px 12px;
  border-radius: 4px;
  border: 1px solid rgba(0, 255, 102, 0.3);
}

.lf-status-text {
  font-size: 12px;
  color: #00FF66;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.lf-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lf-item {
  display: flex;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left-width: 3px;
  padding: 10px 12px;
  border-radius: 4px;
}

.lf-pos {
  width: 28px;
  font-size: 16px;
  color: #fff;
}

.lf-driver {
  flex: 1;
  font-size: 14px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding-left: 12px;
}

.lf-team-color {
  width: 4px;
  height: 20px;
  border-radius: 2px;
  margin-left: 8px;
  margin-right: 12px;
}

.lf-gap {
  font-size: 14px;
  color: #fff;
  text-align: right;
  min-width: 80px;
}

.lf-gap.leader {
  color: var(--color-text-secondary);
}

.lf-gap.dnf {
  color: var(--color-accent);
}

.lf-gap.lapped {
  color: var(--color-text-secondary);
}

.lf-fastest {
  color: #9c27b0; /* Purple for fastest lap */
  font-size: 12px;
  margin-left: 8px;
}

.lf-loading-box {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  height: 48px;
  margin-bottom: 4px;
}
`;
fs.writeFileSync('src/pages/LiveFeed.css', liveFeedCSS, 'utf8');
console.log("Rewrote LiveFeed.css successfully");
