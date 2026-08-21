const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(/const CIRCUIT_INFO: Record<string, \{ laps: number; distance: string \}> = \{[\s\S]*?\};\n\n/, '');

fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
