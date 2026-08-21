import fs from 'fs';

let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');

c = c.replace(/<div className="cd-box">\s*<span className="cd-num font-mono">([\s\S]*?)<\/span>\s*<span className="cd-lbl">([\s\S]*?)<\/span>\s*<\/div>/g, 
  `<div className="cd-box">
                <span className="cd-num font-mono">$1</span>
                <span className="cd-lbl editorial-label">$2</span>
              </div>`);

c = c.replace(/className="m-title"/g, 'className="m-title font-heading editorial-headline"');
c = c.replace(/className="m-val"/g, 'className="m-val font-mono"');

fs.writeFileSync('src/pages/Home.tsx', c, 'utf8');
