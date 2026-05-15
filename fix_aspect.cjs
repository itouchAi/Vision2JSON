const fs = require('fs');
let appStr = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');

appStr = appStr.replace(/className="bento-card md:col-span-4 p-0 overflow-hidden relative aspect-\[3\/4\] md:aspect-\[4\/5\] bg-zinc-900 border border-zinc-800"/g, 'className="bento-card md:col-span-4 p-0 overflow-hidden relative bg-zinc-900 border border-zinc-800" style={{ aspectRatio: imageAspect || (4/5) }}');

appStr = appStr.replace(/className="bento-card md:col-span-4 p-0 overflow-hidden relative aspect-\[3\/4\] md:aspect-\[4\/5\]"/g, 'className="bento-card md:col-span-4 p-0 overflow-hidden relative" style={{ aspectRatio: imageAspect || (4/5) }}');

appStr = appStr.replace(/className="bento-card p-3 flex flex-col relative h-\[450px\]"/g, 'className="bento-card p-3 flex flex-col relative" style={{ aspectRatio: imageAspect || (3/4) }}');

fs.writeFileSync('src/uygulama/src/App.tsx', appStr);
