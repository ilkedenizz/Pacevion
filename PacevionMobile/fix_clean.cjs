const fs = require('fs');

// HOME.TSX
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Use Circuit Data
home = home.replace(/const CIRCUIT_INFO:[\s\S]*?};\n\n/, '');
home = home.replace(/const cInfo = CIRCUIT_INFO\[circuitId\] \|\| CIRCUIT_INFO\.default;/g, 'const cInfo = getCircuitDetails(circuitId);');
home = home.replace(/import { getNextSession/, "import { getCircuitDetails } from '../data/circuitData';\nimport { HomeCountdown } from '../components/common/HomeCountdown';\nimport { getNextSession");

// Replace countdown logic
home = home.replace(/const \[now, setNow\] = useState\(new Date\(\)\);\s*useEffect\(\(\) => \{\s*const timer = setInterval\(\(\) => \{\s*setNow\(new Date\(\)\);\s*\}, 60000\);\s*return \(\) => clearInterval\(timer\);\s*\}, \[\]\);/g, "const now = useMemo(() => new Date(), []);");
home = home.replace(/const timeLeft = useMemo\(\(\) => \{[\s\S]*?\}, \[nextSessionInfo, now\]\);/g, "");

// Replace countdown JSX
home = home.replace(/<div className="hero-countdown">[\s\S]*?<div className="hero-circuit-container">/, 
`{nextSessionInfo && <HomeCountdown targetDate={nextSessionInfo.sessionDate.toISOString()} />}
          <div className="hero-circuit-container">`);

// Remove unused imports
home = home.replace(/import \{ useState, useMemo, useEffect \} from 'react';/, "import { useMemo } from 'react';");

fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');

// RACEDETAILS.TSX
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

// Replace circuit detail
rd = rd.replace(/import { useParams, useNavigate/, "import { getCircuitDetails } from '../data/circuitData';\nimport { CountdownTimer } from '../components/common/CountdownTimer';\nimport { useParams, useNavigate");
rd = rd.replace(/let totalLapsStr = '[^']+';/, "let totalLapsStr = getCircuitDetails(raceInfo?.Circuit?.circuitId || '').laps.toString();");
rd = rd.replace(/totalLapsStr = winner\.laps \|\| '[^']+';/, "");

// Replace countdown logic
rd = rd.replace(/const \[countdown, setCountdown\] = useState<Countdown \| null>\(null\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[raceInfo, isCompleted\]\);/g, '');
rd = rd.replace(/\{!isCompleted && countdown && \!countdown\.isPassed && \([\s\S]*?\}\)/g, 
`{!isCompleted && raceInfo && (
  <CountdownTimer 
    targetDate={\`\${raceInfo.date}T\${raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : raceInfo.time + 'Z') : '00:00:00Z'}\`}
    className="rd-countdown"
  />
)}`);

// Remove unused imports
rd = rd.replace(/import React, \{ useState, useEffect, useMemo \} from 'react';/, "import React, { useMemo } from 'react';");

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
