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
  let stripped = css.replace(/\\'/g, '').replace(/\\"/g, '');
  const singles = (stripped.match(/'/g)||[]).length;
  const doubles = (stripped.match(/"/g)||[]).length;
  if (singles % 2 !== 0 || doubles % 2 !== 0) {
    console.log(f, 'singles:', singles, 'doubles:', doubles);
  }
});
