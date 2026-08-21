const fs = require('fs');
let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');
c = c.replace(/const circuitId = nextRace\.Circuit\?\.circuitId \|\| 'default';/,
  "const circuitId = (nextRace.Circuit?.circuitId || 'default').toLowerCase();");
fs.writeFileSync('src/pages/Home.tsx', c);
