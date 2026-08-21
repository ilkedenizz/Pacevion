import fs from 'fs';

const moreCSS = `.more-page {
  min-height: 100vh;
  padding: var(--page-top-spacing) 16px var(--page-bottom-spacing) 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.more-header {
  font-size: 32px;
  letter-spacing: -0.04em;
  color: #fff;
}

.more-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.more-section-title {
  font-size: 14px;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 800;
  margin-left: 8px;
}

.more-list {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.more-item {
  display: flex;
  align-items: center;
  padding: 16px;
  text-decoration: none;
  border-bottom: 1px solid var(--color-border-subtle);
  transition: background 0.2s ease;
}

.more-item:active {
  background: var(--color-surface-elevated);
}

.more-item:last-child {
  border-bottom: none;
}

.mi-icon {
  width: 24px;
  height: 24px;
  color: var(--color-accent);
  margin-right: 16px;
}

.mi-text {
  flex: 1;
  font-size: 16px;
  color: #fff;
  font-weight: 500;
}

.mi-chevron {
  width: 20px;
  height: 20px;
  color: var(--color-text-secondary);
}
`;
fs.writeFileSync('src/pages/More.css', moreCSS, 'utf8');
console.log("Rewrote More.css successfully");
