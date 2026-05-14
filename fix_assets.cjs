const fs = require('fs');
const path = require('path');

let appStr = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');
appStr = `import arkaplanVideo from '@/src/assets/arkaplan.mp4';
import arkaplanImg from '@/src/assets/arkaplan.jpg';
import karakterImg from '@/src/assets/karakter.png';
import colorImg from '@/src/assets/color.png';
import depthImg from '@/src/assets/depth.png';\n` + appStr;

appStr = appStr.replace(/const \[revealImageSrc, setRevealImageSrc\] = useState\('\/color.png'\);/g, "const [revealImageSrc, setRevealImageSrc] = useState(colorImg);");
appStr = appStr.replace(/src="\/arkaplan.mp4"/g, "src={arkaplanVideo}");
appStr = appStr.replace(/bgSrc="\/arkaplan.jpg"/g, "bgSrc={arkaplanImg}");
appStr = appStr.replace(/fgSrc="\/karakter.png"/g, "fgSrc={karakterImg}");
appStr = appStr.replace(/topImage="\/depth.png"/g, "topImage={depthImg}");
appStr = appStr.replace(/depthMapSrc="\/depth.png"/g, "depthMapSrc={depthImg}");
fs.writeFileSync('src/uygulama/src/App.tsx', appStr);

const dir = 'src/uygulama/src/components';
const files = fs.readdirSync(dir);
for (const file of files) {
  if (!file.endsWith('.tsx')) continue;
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf8');
  if (content.includes("'/depth.png'")) {
    content = `import depthImg from '@/src/assets/depth.png';\n` + content;
    content = content.replace(/'\/depth\.png'/g, "depthImg");
    fs.writeFileSync(p, content);
  }
}
