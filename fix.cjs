const fs = require('fs');
const path = require('path');

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/const img = new Image\(\);/g, "const img = new Image();\n    img.crossOrigin = 'anonymous';");
  content = content.replace(/new THREE\.TextureLoader\(\)/g, "new THREE.TextureLoader().setCrossOrigin('anonymous')");
  
  fs.writeFileSync(p, content);
}
