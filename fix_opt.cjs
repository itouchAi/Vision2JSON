const fs = require('fs');

const file = 'src/uygulama/src/components/OpticalLensCard.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  `const texBase = loader.load("/depth.png", (t) => {
        if (t.image && t.image.width) {
            material.uniforms.uImageResolution.value.set(t.image.width, t.image.height);
        }
    });`,
  `const texBase = loader.load("/depth.png");`
);

fs.writeFileSync(file, content);
