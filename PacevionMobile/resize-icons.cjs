const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

const srcFile = path.join(__dirname, 'assets', 'icon-foreground.png');
const resDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'res');

const sizes = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};

async function generateIcons() {
  try {
    const image = await Jimp.read(srcFile);
    
    for (const [folder, size] of Object.entries(sizes)) {
      const folderPath = path.join(resDir, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      
      const resized = image.clone().resize({ w: size, h: size });
      
      const launcherPath = path.join(folderPath, 'ic_launcher.png');
      const launcherRoundPath = path.join(folderPath, 'ic_launcher_round.png');
      
      await resized.write(launcherPath);
      await resized.write(launcherRoundPath);
      
      console.log('Generated ' + size + ' in ' + folder);
      
      const bg = path.join(folderPath, 'ic_launcher_background.png');
      const fg = path.join(folderPath, 'ic_launcher_foreground.png');
      if (fs.existsSync(bg)) fs.unlinkSync(bg);
      if (fs.existsSync(fg)) fs.unlinkSync(fg);
    }
    
    const anydpiPath = path.join(resDir, 'mipmap-anydpi-v26');
    if (fs.existsSync(anydpiPath)) {
      fs.rmSync(anydpiPath, { recursive: true, force: true });
      console.log('Removed mipmap-anydpi-v26 folder');
    }
    
    console.log('Done!');
  } catch (err) {
    console.error('Error generating icons:', err);
  }
}

generateIcons();
