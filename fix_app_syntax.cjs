const fs = require('fs');
let app = fs.readFileSync('src/uygulama/src/App.tsx', 'utf8');

// The lines look like:
// <div className="relative w-full rounded-[16px] overflow-hidden " style={{ aspectRatio: imageAspect || (3/4) }}>border border-border">
// I want to change them to:
// <div className="relative w-full rounded-[16px] overflow-hidden border border-border" style={{ aspectRatio: imageAspect || (3/4) }}>
// Or for XRayRevealCard:
// <div className="relative w-full rounded-[16px] overflow-hidden " style={{ aspectRatio: imageAspect || (3/4) }}>border border-border bg-zinc-900 pointer-events-auto">
// To: <div className="relative w-full rounded-[16px] overflow-hidden border border-border bg-zinc-900 pointer-events-auto" style={{ aspectRatio: imageAspect || (3/4) }}>

app = app.replace(/<div className="relative w-full rounded-\[16px\] overflow-hidden " style=\{\{ aspectRatio: imageAspect \|\| \(3\/4\) \}\}>([^"]+)">/g, 
  '<div className="relative w-full rounded-[16px] overflow-hidden $1" style={{ aspectRatio: imageAspect || (3/4) }}>');

// For BrushRevealCard:
// <div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: imageAspect || (3/4) }}">
app = app.replace(/<div className="relative w-full rounded-\[16px\] overflow-hidden" style=\{\{ aspectRatio: imageAspect \|\| \(3\/4\) \}\}">/g, 
  '<div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: imageAspect || (3/4) }}>');

fs.writeFileSync('src/uygulama/src/App.tsx', app);
