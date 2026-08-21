const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(/const CIRCUIT_INFO:[\s\S]*?};\n/, '');

fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
