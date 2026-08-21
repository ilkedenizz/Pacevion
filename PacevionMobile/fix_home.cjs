const fs = require('fs');

let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');
home = home.replace(/const CIRCUIT_INFO:[\s\S]*?};\n\n/, '');
home = home.replace(/const cInfo = CIRCUIT_INFO\[circuitId\] \|\| CIRCUIT_INFO\.default;/g, 'const cInfo = getCircuitDetails(circuitId);');
home = home.replace(/import { getNextSession/, "import { getCircuitDetails } from '../data/circuitData';\nimport { getNextSession");
fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
