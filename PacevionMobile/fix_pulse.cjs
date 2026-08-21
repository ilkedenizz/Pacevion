const fs = require('fs');
let css = fs.readFileSync('src/pages/Home.css', 'utf8');

css = css.replace(/@keyframes pulse \{[\s\S]*?\}/, 
`@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0.8; }
}`);
css = css.replace(/box-shadow:[^;]+;/g, ''); // just remove any box-shadow from the pulse if any is left, but the regex above replaced the keyframes

fs.writeFileSync('src/pages/Home.css', css, 'utf8');
