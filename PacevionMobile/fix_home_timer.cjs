const fs = require('fs');
let home = fs.readFileSync('src/pages/Home.tsx', 'utf8');

home = home.replace(/import \{ getNextSession/, "import { HomeCountdown } from '../components/common/HomeCountdown';\nimport { getNextSession");

home = home.replace(/const \[now, setNow\] = useState\(new Date\(\)\);\s*useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/g, "const now = new Date();");

home = home.replace(/const timeLeft = useMemo\(\(\) => \{[\s\S]*?\}, \[nextSessionInfo, now\]\);/g, "");

home = home.replace(/<div className="hero-countdown">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g, 
`{nextSessionInfo && <HomeCountdown targetDate={nextSessionInfo.sessionDate.toISOString()} />}`);

fs.writeFileSync('src/pages/Home.tsx', home, 'utf8');
