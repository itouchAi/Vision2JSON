const fs = require('fs');
if (fs.existsSync('src/assets/depth.png')) {
  const buf = fs.readFileSync('src/assets/depth.png');
  console.log("src/assets: " + buf.slice(0, 8).toString('hex'));
} else {
  console.log("NOT FOUND src/assets/depth.png");
}
