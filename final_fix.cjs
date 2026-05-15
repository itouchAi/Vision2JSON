const fs = require('fs');
const path = require('path');

// Fix App.tsx
let appStr = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');

appStr = appStr.replace(/import arkaplanVideo from '@\/src\/assets\/arkaplan.mp4';\n/g, '');
appStr = appStr.replace(/import arkaplanImg from '@\/src\/assets\/arkaplan.jpg';\n/g, '');
appStr = appStr.replace(/import karakterImg from '@\/src\/assets\/karakter.png';\n/g, '');
appStr = appStr.replace(/import colorImg from '@\/src\/assets\/color.png';\n/g, '');
appStr = appStr.replace(/import depthImg from '@\/src\/assets\/depth.png';\n/g, '');

appStr = appStr.replace(/useState\(colorImg\)/g, 'useState("/color.png")');
appStr = appStr.replace(/{arkaplanVideo}/g, '"/arkaplan.mp4"');
appStr = appStr.replace(/{arkaplanImg}/g, '"/arkaplan.jpg"');
appStr = appStr.replace(/{karakterImg}/g, '"/karakter.png"');
appStr = appStr.replace(/{depthImg}/g, '"/depth.png"');

fs.writeFileSync('src/uygulama/src/App.tsx', appStr);

// Fix all components
const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/import depthImg from '@\/src\/assets\/depth.png';\n/g, '');
  content = content.replace(/import colorImg from '@\/src\/assets\/color.png';\n/g, '');
  
  content = content.replace(/depthImg/g, '"/depth.png"');
  content = content.replace(/colorImg/g, '"/color.png"');
  
  // adding crossOrigin
  content = content.replace(/const img = new Image\(\);/g, "const img = new Image();\n    img.crossOrigin = 'anonymous';");
  content = content.replace(/new THREE\.TextureLoader\(\)/g, "new THREE.TextureLoader().setCrossOrigin('anonymous')");
  
  fs.writeFileSync(p, content);
}
