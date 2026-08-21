const fs = require('fs');
let css = fs.readFileSync('src/pages/Home.css', 'utf8');

css = css.replace(/padding: 20px 0;/, 'padding: 12px 0;');
css = css.replace(/height: 140px;/, 'height: 100px;');
css = css.replace(/padding: 16px;/g, 'padding: 8px 16px;');

fs.writeFileSync('src/pages/Home.css', css, 'utf8');
