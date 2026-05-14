const fs = require('fs');
const path = require('path');

let appStr = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');
appStr = appStr.replace(/useState\("\/color\.png"\)/g, "useState(colorImg)");
appStr = appStr.replace(/useState\('\/color\.png'\)/g, "useState(colorImg)");
fs.writeFileSync('src/uygulama/src/App.tsx', appStr);
