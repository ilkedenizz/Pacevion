const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = 'public/assets/img/drivers';
const outDir = path.join(dir, 'portraits');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.readdirSync(dir).forEach(file => {
  if (file.endsWith('.webp') && !file.includes('portrait')) {
    const p = path.join(dir, file);
    sharp(p)
      .metadata()
      .then(info => {
        // We want a portrait aspect ratio, let's say 1:1 or 4:5.
        // Let's do a square for the head and shoulders, starting a little bit down if needed, but Y=0 is safest.
        // Actually, let's make it 1:1 square.
        const width = info.width;
        // height of crop is same as width
        let cropHeight = width;
        if (cropHeight > info.height) cropHeight = info.height;
        
        return sharp(p)
          .extract({ left: 0, top: 0, width: width, height: cropHeight })
          .toFile(path.join(outDir, file.replace('.webp', '-portrait.webp')));
      })
      .then(() => console.log('Cropped ' + file))
      .catch(err => console.error('Error on ' + file, err));
  }
});
