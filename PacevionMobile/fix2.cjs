const fs = require('fs');
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

rd = rd.replace(/let totalLapsStr = '[^']+';/, "let totalLapsStr = getCircuitDetails(raceDetails?.Circuit?.circuitId || '').laps.toString();");
rd = rd.replace(/totalLapsStr = winner\.laps \|\| '[^']+';/, "");

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
