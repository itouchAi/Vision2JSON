const fs = require('fs');

const file = 'src/uygulama/src/components/OpticalLensCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /const texReveal = loader\.load\(bottomImage\);/, 
  `const texReveal = loader.load(bottomImage, (t) => {
        if (t.image && t.image.width) {
            material.uniforms.uImageResolution.value.set(t.image.width, t.image.height);
        }
    });`
);

fs.writeFileSync(file, content);
