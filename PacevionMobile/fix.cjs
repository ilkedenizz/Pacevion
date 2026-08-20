const fs = require("fs"); 
let c = fs.readFileSync("src/pages/Home.css", "utf8"); 
c = c.replace(/\\(RED|YELLOW|GREEN|VSC)\\/g, "\"$1\""); 
fs.writeFileSync("src/pages/Home.css", c);
