const fs = require('fs');
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

rd = rd.replace(/raceDetails\?\.Circuit/g, "raceInfo?.Circuit");

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
