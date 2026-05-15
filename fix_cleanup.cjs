const fs = require('fs');
const path = require('path');

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);

for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');

  let changed = false;

  // Replace dead code return:
  // return () => ro.disconnect();
  //   window.removeEventListener('resize', handleResize);
  const re1 = /return \(\) => ro\.disconnect\(\);\s*window\.removeEventListener\('resize', (onResize|handleResize)\);/g;
  if (re1.test(content)) {
    content = content.replace(re1, (match, p1) => {
      return `return () => {\n      ro.disconnect();\n      window.removeEventListener('resize', ${p1});\n    };`;
    });
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(p, content);
  }
}
