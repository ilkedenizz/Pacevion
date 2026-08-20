const fs = require('fs');
['src/pages/Home.css', 'src/pages/Drivers.css', 'src/pages/Cars.css'].forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  let stripped = css.replace(/\\'/g, '').replace(/\\"/g, '');
  const singles = (stripped.match(/'/g)||[]).length;
  const doubles = (stripped.match(/"/g)||[]).length;
  console.log(f, 'singles:', singles, 'doubles:', doubles);
});
