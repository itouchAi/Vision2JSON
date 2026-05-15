const fs = require('fs');
let app = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');

// Inside App component, define dynamic column classes
app = app.replace('const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);', 
`const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const isLandscape = imageAspect && imageAspect > 1.2;
  const gridClass = isLandscape ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-2" : "grid-cols-1 md:grid-cols-3";
  const heroCardClass = isLandscape ? "md:col-span-12 lg:col-span-6" : "md:col-span-4";
  const heroTextClass = isLandscape ? "md:col-span-12 lg:col-span-12" : "md:col-span-4";`);

// Update rows
app = app.replace(/<div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">/g, '<div className={`grid ${gridClass} gap-4 items-stretch`}>');

// Update Info section grid cols
app = app.replace(/className="bento-card md:col-span-4 flex flex-col justify-center bg-zinc-900\/30"/, 
'className={`bento-card ${heroTextClass} flex flex-col justify-center bg-zinc-900/30`}');

app = app.replace(/className="bento-card md:col-span-4 p-0 overflow-hidden relative bg-zinc-900 border border-zinc-800" style=\{\{ aspectRatio: imageAspect \|\| \(4\/5\) \}\}/, 
'className={`bento-card ${heroCardClass} p-0 overflow-hidden relative bg-zinc-900 border border-zinc-800`} style={{ aspectRatio: imageAspect || (4/5) }}');

app = app.replace(/className="bento-card md:col-span-4 p-0 overflow-hidden relative" style=\{\{ aspectRatio: imageAspect \|\| \(4\/5\) \}\}/, 
'className={`bento-card ${heroCardClass} p-0 overflow-hidden relative`} style={{ aspectRatio: imageAspect || (4/5) }}');

// Update typical bento card
app = app.replace(/className="bento-card p-3 flex flex-col relative" style=\{\{ aspectRatio: imageAspect \|\| \(3\/4\) \}\}/g, 
'className="bento-card p-3 flex flex-col relative w-full h-full"');

// Update inner image container
app = app.replace(/<div className="relative w-full flex-grow rounded-\[16px\] overflow-hidden/g, 
'<div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: imageAspect || (3/4) }}');

fs.writeFileSync('src/uygulama/src/App.tsx', app);
