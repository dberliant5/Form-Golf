import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const wrapper=fs.readFileSync('static-test-v995.html','utf8');
const index=fs.readFileSync('index.html','utf8');
const files=new Set();
for(const src of wrapper.matchAll(/['"](assets\/[^'"]+\.js)['"]/g)) files.add(src[1]);
for(const src of index.matchAll(/src=["'](assets\/[^"'?]+\.js)/g)) files.add(src[1]);
let bad=[];
for(const file of [...files]){
  const p=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});
  if(p.status!==0) bad.push({file,status:p.status,stderr:p.stderr,stdout:p.stdout});
}
console.log(JSON.stringify({checked:files.size,bad},null,2));
if(bad.length) process.exit(1);
