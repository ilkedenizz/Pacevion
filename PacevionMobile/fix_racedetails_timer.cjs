const fs = require('fs');
let rd = fs.readFileSync('src/pages/RaceDetails.tsx', 'utf8');

// Add import
rd = rd.replace(/import \{ getCircuitDetails \} from '\.\.\/data\/circuitData';/, "import { getCircuitDetails } from '../data/circuitData';\nimport { CountdownTimer } from '../components/common/CountdownTimer';");

// Remove state and effect
rd = rd.replace(/const \[countdown, setCountdown\] = useState<Countdown \| null>\(null\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[raceInfo, isCompleted\]\);/g, '');

// Fix target string creation
rd = rd.replace(/\{!isCompleted && countdown && \!countdown\.isPassed && \([\s\S]*?\}\)/g, 
`{!isCompleted && raceInfo && (
  <CountdownTimer 
    targetDate={\`\${raceInfo.date}T\${raceInfo.time ? (raceInfo.time.endsWith('Z') ? raceInfo.time : raceInfo.time + 'Z') : '00:00:00Z'}\`}
    className="rd-countdown"
  />
)}`);

fs.writeFileSync('src/pages/RaceDetails.tsx', rd, 'utf8');
