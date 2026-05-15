const fs = require('fs');
const path = require('path');

function fix(file) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const tex1 = loader\.load\("\/depth\.png", \(t\) => \{\n\s+material\.uniforms\.uImageResolution\.value\.set\(t\.image\.width, t\.image\.height\);\n\s+\}\);/, 
    'const tex1 = loader.load("/depth.png");');
  
  content = content.replace(/const texBase = loader\.load\("\/depth\.png", \(t\) => \{\n\s+material\.uniforms\.uImageResolution\.value\.set\(t\.image\.width, t\.image\.height\);\n\s+\}\);/, 
    'const texBase = loader.load("/depth.png");');
    
  if (content.includes('tex2 = loader.load(bottomImage);')) {
    content = content.replace(/const tex2 = loader\.load\(bottomImage\);/, 
      'const tex2 = loader.load(bottomImage, (t) => { material.uniforms.uImageResolution.value.set(t.image.width, t.image.height); });');
  }
  
  if (content.includes('texColor = loader.load(bottomImage);')) {
    content = content.replace(/const texColor = loader\.load\(bottomImage\);/, 
      'const texColor = loader.load(bottomImage, (t) => { material.uniforms.uImageResolution.value.set(t.image.width, t.image.height); });');
  }

  fs.writeFileSync(file, content);
}

fix('src/uygulama/src/components/LiquidGlitchCard.tsx');
fix('src/uygulama/src/components/OpticalLensCard.tsx');

