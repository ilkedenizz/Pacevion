const fs = require('fs');
let css = fs.readFileSync('src/pages/Home.css', 'utf8');

css = css.replace(/padding: 12px 16px;\s*background: linear-gradient\(90deg, var\(--color-surface\) 50%, rgba\(255,128,0,0\.1\)\);/m, 
`padding: 16px 32px;
  background: linear-gradient(90deg, var(--color-surface) 30%, rgba(255,128,0,0.15));`);

fs.writeFileSync('src/pages/Home.css', css, 'utf8');
