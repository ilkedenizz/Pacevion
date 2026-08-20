const fs = require('fs'); const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) results = results.concat(walk(file));
    else if (file.endsWith('.css')) results.push(file);
  });
  return results;
}
walk('src').forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  const opens = (css.match(/\/\*/g)||[]).length;
  const closes = (css.match(/\*\//g)||[]).length;
  if (opens !== closes) {
    console.log(f, 'opens:', opens, 'closes:', closes);
  }
});
