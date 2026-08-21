const fs = require('fs');
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

// Add import
rd = rd.replace(/import { useParams, useNavigate/, "import { getCircuitDetails } from '../data/circuitData';\nimport { useParams, useNavigate");

// Replace totalLapsStr
rd = rd.replace(/let totalLapsStr = '-';/, "let totalLapsStr = getCircuitDetails(raceDetails?.Circuit?.circuitId || '').laps.toString();");
rd = rd.replace(/totalLapsStr = winner\.laps \|\| '-';/, "");

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
