const fs = require('fs');
const buf = fs.readFileSync('public/depth.png');
console.log(buf.slice(0, 8).toString('hex'));
