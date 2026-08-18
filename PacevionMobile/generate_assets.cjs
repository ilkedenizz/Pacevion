const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Background for Adaptive Icon (Solid Graphite)
const bgSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#08090B" />
</svg>
`;

// Foreground for Adaptive Icon (The P and Red Dot) - scaled slightly to fit inside the safe zone (66% of 1024 = 675px)
const fgSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(180, 160) scale(0.7) skewX(-15)">
    <rect x="280" y="240" width="160" height="544" fill="#F5F5F5" />
    <path d="M 440,240 L 620,240 C 780,240 840,320 840,432 C 840,544 780,624 620,624 L 440,624 Z" fill="#F5F5F5" />
    <path d="M 440,380 L 600,380 C 650,380 670,400 670,432 C 670,464 650,484 600,484 L 440,484 Z" fill="#08090B" />
    <rect x="460" y="664" width="120" height="120" fill="#E10600" />
  </g>
</svg>
`;

// Standard Icon (Combined)
const iconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#08090B" rx="200" />
  <g transform="translate(180, 160) scale(0.7) skewX(-15)">
    <rect x="280" y="240" width="160" height="544" fill="#F5F5F5" />
    <path d="M 440,240 L 620,240 C 780,240 840,320 840,432 C 840,544 780,624 620,624 L 440,624 Z" fill="#F5F5F5" />
    <path d="M 440,380 L 600,380 C 650,380 670,400 670,432 C 670,464 650,484 600,484 L 440,484 Z" fill="#08090B" />
    <rect x="460" y="664" width="120" height="120" fill="#E10600" />
  </g>
</svg>
`;

// Splash Screen (2732x2732)
const splashSvg = `
<svg width="2732" height="2732" viewBox="0 0 2732 2732" xmlns="http://www.w3.org/2000/svg">
  <rect width="2732" height="2732" fill="#08090B" />
  <g transform="translate(870, 850) scale(1) skewX(-15)">
    <rect x="280" y="240" width="160" height="544" fill="#F5F5F5" />
    <path d="M 440,240 L 620,240 C 780,240 840,320 840,432 C 840,544 780,624 620,624 L 440,624 Z" fill="#F5F5F5" />
    <path d="M 440,380 L 600,380 C 650,380 670,400 670,432 C 670,464 650,484 600,484 L 440,484 Z" fill="#08090B" />
    <rect x="460" y="664" width="120" height="120" fill="#E10600" />
  </g>
</svg>
`;

async function generate() {
  await sharp(Buffer.from(bgSvg)).png().toFile(path.join(assetsDir, 'icon-background.png'));
  await sharp(Buffer.from(fgSvg)).png().toFile(path.join(assetsDir, 'icon-foreground.png'));
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(assetsDir, 'icon-only.png'));
  await sharp(Buffer.from(iconSvg)).png().toFile(path.join(assetsDir, 'icon.png'));
  await sharp(Buffer.from(splashSvg)).png().toFile(path.join(assetsDir, 'splash.png'));
  await sharp(Buffer.from(splashSvg)).png().toFile(path.join(assetsDir, 'splash-dark.png'));
  console.log('Assets generated successfully!');
}

generate().catch(console.error);
