const fs = require('fs');
const path = require('path');

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes('"/color.png"')) {
    content = `import colorImg from '@/src/assets/color.png';\n` + content;
    content = content.replace(/"\/color\.png"/g, "colorImg");
    fs.writeFileSync(p, content);
  }
}
