const fs = require('fs');
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

rd = rd.replace(/interface Countdown \{[\s\S]*?seconds: number;\s*isPassed: boolean;\s*\}/, '');
rd = rd.replace(/\{countdown && !countdown\.isPassed && \([\s\S]*?<\/div>\s*\)\}/, 
`{!isCompleted && raceInfo && (
  <CountdownTimer 
    targetDate={\`\${raceInfo.date}T\${raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : raceInfo.time + 'Z') : '00:00:00Z'}\`}
    className="rd-countdown"
  />
)}`);

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
