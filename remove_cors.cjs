const fs = require('fs');
const path = require('path');

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  
  content = content.replace(/img\.crossOrigin = 'anonymous';\n/g, "");
  content = content.replace(/img\.crossOrigin = 'anonymous';/g, "");
  content = content.replace(/\.setCrossOrigin\('anonymous'\)/g, "");
  
  fs.writeFileSync(p, content);
}
