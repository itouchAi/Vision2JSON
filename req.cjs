const https = require('https');
https.get('https://vision2-json.vercel.app/depth.png', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
  let ext = '';
  res.on('data', d => ext += d.toString('hex').slice(0, 10));
  res.on('end', () => console.log('Snippet:', ext.slice(0, 50)));
});
