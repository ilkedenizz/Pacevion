const https = require('https');
const fs = require('fs');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
            const urlObj = new URL(url);
            redirectUrl = urlObj.origin + redirectUrl;
        }
        download(redirectUrl, dest).then(resolve).catch(reject);
      } else {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(resolve); });
      }
    }).on('error', reject);
  });
}

async function main() {
  const wikiAudi = 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Audi_F1_showcar_%282022%29.jpg';
  const wikiCad = 'https://upload.wikimedia.org/wikipedia/commons/2/25/General_Motors_Andretti_Cadillac_F1_concept_livery.jpg';
  
  await download(wikiAudi, 'public/assets/img/cars/audi.jpg');
  await download(wikiCad, 'public/assets/img/cars/cadillac.jpg');
  console.log('Downloaded directly from Wikipedia Commons');
}

main();
