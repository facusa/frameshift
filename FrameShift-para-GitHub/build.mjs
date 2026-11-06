import {mkdir,copyFile,cp,rm} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','script.js']) await copyFile(file,`dist/${file}`);
await cp('public','dist/public',{recursive:true,filter:source=>!source.endsWith('/.DS_Store')});
await cp('milo-maple','dist/milo-maple',{recursive:true,filter:source=>!source.endsWith('/.DS_Store')});
console.log('FrameShift built successfully in dist/');
