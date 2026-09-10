import fs from 'node:fs';

const wrapper=fs.readFileSync('static-test-v995.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const files=new Set();
for(const src of wrapper.matchAll(/['"](assets\/[^'"]+\.js)['"]/g)) files.add(src[1]);
for(const src of index.matchAll(/src=["'](assets\/[^"'?]+\.js)/g)) files.add(src[1]);
let bad=[];
for(const file of [...files]){
  const code=fs.readFileSync(file,'utf8');
  try{ new Function(code); }
  catch(e){ bad.push({file,error:e.message}); }
}
console.log(JSON.stringify({checked:files.size,bad},null,2));
if(bad.length) process.exit(1);
