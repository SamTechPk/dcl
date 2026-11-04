const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const root=path.join(__dirname,'..'),file=path.join(root,'index.html'),code=fs.readFileSync(path.join(__dirname,'inquiry.js'),'utf8');
let html=fs.readFileSync(file,'utf8');
html=html.replace(/<script>[\s\S]*?<\/script>/,()=>'<script>'+code+'</script>');
const hash=crypto.createHash('sha256').update(code).digest('base64');
html=html.replace(/script-src 'sha256-[^']+'/,()=>"script-src 'sha256-"+hash+"'");
fs.writeFileSync(file,html);fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.writeFileSync(path.join(root,'dist/index.html'),html);
fs.cpSync(path.join(root,'assets'),path.join(root,'dist/assets'),{recursive:true});fs.copyFileSync(path.join(root,'favicon.ico'),path.join(root,'dist/favicon.ico'));
console.log('Built static preview and refreshed script CSP hash.');
