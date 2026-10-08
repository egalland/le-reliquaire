import { readFile, writeFile, mkdir, rm, cp, readdir } from 'node:fs/promises';
import { build } from 'esbuild';
import { build as viteBuild } from 'vite';
await viteBuild({configFile:'vite.reliquaire.config.ts'});
const types={html:'text/html; charset=utf-8',js:'text/javascript; charset=utf-8',css:'text/css; charset=utf-8',png:'image/png',svg:'image/svg+xml',woff2:'font/woff2',json:'application/json'};
const assets={};
async function collect(dir,prefix=''){for(const entry of await readdir(dir,{withFileTypes:true})){const path=prefix+entry.name;if(entry.isDirectory())await collect(dir+'/'+entry.name,path+'/');else assets['/'+path]={type:types[entry.name.split('.').pop()]||'application/octet-stream',data:(await readFile(dir+'/'+entry.name)).toString('base64')}}}
await collect('public');
await rm('dist',{recursive:true,force:true});await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});await mkdir('.sites-runtime',{recursive:true});
const worker=await readFile('worker/index.js','utf8');
await writeFile('.sites-runtime/worker-entry.js',worker.replace("import { assets } from './assets.js';",'const assets = '+JSON.stringify(assets)+';'));
await build({entryPoints:['.sites-runtime/worker-entry.js'],outfile:'dist/server/index.js',bundle:true,format:'esm',platform:'browser',target:'es2022',minify:true});
await cp('.openai/hosting.json','dist/.openai/hosting.json');await cp('drizzle','dist/.openai/drizzle',{recursive:true});console.log('Le Reliquaire built.');
