const fs = require('fs');
const path = require('path');

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');

  let changed = false;

  if (content.includes("window.addEventListener('resize', handleResize)")) {
    content = content.replace(/window\.addEventListener\('resize', handleResize\);?/, 
        "const ro = new ResizeObserver(() => handleResize());\n    ro.observe(container);\n    window.addEventListener('resize', handleResize);");
    content = content.replace(/window\.removeEventListener\('resize', handleResize\);?/, 
        "ro.disconnect();\n      window.removeEventListener('resize', handleResize);");
    changed = true;
  }
  
  if (content.includes("window.addEventListener('resize', onResize)")) {
    content = content.replace(/window\.addEventListener\('resize', onResize\);?/, 
        "const ro = new ResizeObserver(() => onResize());\n    ro.observe(container);\n    window.addEventListener('resize', onResize);");
    content = content.replace(/window\.removeEventListener\('resize', onResize\);?/, 
        "ro.disconnect();\n      window.removeEventListener('resize', onResize);");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(p, content);
  }
}
