const sharp = require('sharp');
const fs = require('fs');

if (!fs.existsSync('assets')) fs.mkdirSync('assets');

// Premium Racing "P" logo
// We make it large enough to fit exactly the safe zone of 1024x1024.
// The safe zone is about 66% of the center, so roughly 675x675 area.
// P shape: 
const pSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Precision geometric P shape -->
  <!-- Outer P -->
  <path d="M260 220 H620 C763.59 220 880 336.41 880 480 C880 623.59 763.59 740 620 740 H440 V820 C440 842.09 422.09 860 400 860 H300 C277.91 860 260 842.09 260 820 V220 Z" fill="#E10600" />
  <!-- Inner Cutout -->
  <path d="M440 400 H620 C664.18 400 700 435.82 700 480 C700 524.18 664.18 560 620 560 H440 V400 Z" fill="#08090B" />
</svg>`;

const bgSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#08090B" />
</svg>`;

const pBuffer = Buffer.from(pSvg);
const bgBuffer = Buffer.from(bgSvg);

async function generate() {
  try {
    await sharp(bgBuffer).png().toFile('assets/icon-background.png');
    await sharp(pBuffer).png().toFile('assets/icon-foreground.png');
    
    await sharp(bgBuffer)
      .composite([{ input: pBuffer }])
      .png().toFile('assets/icon.png');
      
    const splashBg = `<svg width="2732" height="2732" viewBox="0 0 2732 2732" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="2732" height="2732" fill="#08090B" /></svg>`;
    const splashBgBuffer = Buffer.from(splashBg);
    
    // Scale P up for splash screen by rendering a larger SVG
    const splashPSvg = `<svg width="2732" height="2732" viewBox="0 0 2732 2732" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(854, 854)">
        <path d="M260 220 H620 C763.59 220 880 336.41 880 480 C880 623.59 763.59 740 620 740 H440 V820 C440 842.09 422.09 860 400 860 H300 C277.91 860 260 842.09 260 820 V220 Z" fill="#E10600" />
        <path d="M440 400 H620 C664.18 400 700 435.82 700 480 C700 524.18 664.18 560 620 560 H440 V400 Z" fill="#08090B" />
      </g>
    </svg>`;
    
    await sharp(splashBgBuffer)
      .composite([{ input: Buffer.from(splashPSvg) }])
      .png().toFile('assets/splash.png');
      
    await sharp(splashBgBuffer)
      .composite([{ input: Buffer.from(splashPSvg) }])
      .png().toFile('assets/splash-dark.png');
      
    console.log('Icons generated successfully');
  } catch (err) {
    console.error(err);
  }
}
generate();
