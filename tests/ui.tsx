import {JSDOM} from 'jsdom';
import {registerHooks} from 'node:module';
registerHooks({load(url,context,next){if(url.endsWith('.css'))return {format:'module',source:'',shortCircuit:true};return next(url,context)}});
import {Miniflare} from 'miniflare';
import {readFile,readdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const mf=new Miniflare({modules:true,scriptPath:'dist/server/index.js',compatibilityDate:'2026-07-30',d1Databases:{DB:'ui-test'},r2Buckets:['BUCKET']});
const db=await mf.getD1Database('DB');for(const name of (await readdir('drizzle')).filter(v=>v.endsWith('.sql')).sort())for(const sql of (await readFile('drizzle/'+name,'utf8')).split('--> statement-breakpoint'))if(sql.trim())await db.prepare(sql).run();
const dom=new JSDOM('<!doctype html><div id="root"></div>',{url:'https://test.invalid/reliquaire/',pretendToBeVisual:true});
for(const k of ['window','document','navigator','location','history','localStorage','Element','Node','SVGElement','HTMLElement','HTMLInputElement','HTMLDialogElement','Event','MouseEvent'])Object.defineProperty(globalThis,k,{value:(dom.window as any)[k],configurable:true,writable:true});
(globalThis as any).ResizeObserver=class {observe(){}disconnect(){}};(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
(dom.window.SVGSVGElement.prototype as any).createSVGRect=()=>({});dom.window.HTMLElement.prototype.scrollIntoView=()=>{};dom.window.HTMLDialogElement.prototype.showModal=function(){this.open=true};dom.window.HTMLDialogElement.prototype.close=function(){this.open=false};
globalThis.fetch=async(input:any,init:any={})=>{const path=String(input);if(path.startsWith('/api/reliquaire'))return mf.dispatchFetch('https://test.invalid'+path,{...init,headers:{...init.headers,'oai-authenticated-user-id':'owner'}}) as any;throw Error('Unexpected fetch '+path)};
const React=await import('react'),{act}=React,{createRoot}=await import('react-dom/client'),{default:App}=await import('../reliquaire/client/app');
const root=createRoot(document.getElementById('root')!);await act(async()=>{root.render(<App/>)});
async function settle(){await act(async()=>{await new Promise(r=>setTimeout(r,100))})}
async function until(fn:()=>any){for(let n=0;n<50;n++){if(fn())return;await settle()}throw Error('UI timeout: '+document.body.textContent)}
const buttons=()=>Array.from(document.querySelectorAll('button'));
async function click(text:string){const b=buttons().find(b=>b.textContent?.includes(text));assert.ok(b,'Button '+text);await act(async()=>b.click());await settle()}
function label(text:string){const l=Array.from(document.querySelectorAll('label')).find(l=>l.textContent?.startsWith(text));assert.ok(l,'Label '+text);return l.querySelector('input, select, textarea') as HTMLInputElement}
async function input(el:HTMLInputElement,v:string){await act(async()=>{const proto=el.tagName==='SELECT'?dom.window.HTMLSelectElement.prototype:dom.window.HTMLInputElement.prototype;Object.getOwnPropertyDescriptor(proto,'value')!.set!.call(el,v);el.dispatchEvent(new dom.window.Event(el.tagName==='SELECT'?'change':'input',{bubbles:true}))});await settle()}
async function submit(el:HTMLElement){const form=el.closest('form')!;await act(async()=>form.dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true})));await settle()}
await until(()=>document.body.textContent?.includes('Deux')||buttons().some(b=>b.textContent?.includes('Grande Arche')));
await click('Maître de jeu');await until(()=>document.body.textContent?.includes('NOUVEAU DÉPART'));
await input(label('Mode'),'screen');await submit(label('Nom de la session'));await until(()=>buttons().some(b=>b.textContent?.includes('Donner le départ')));
await click('Donner le départ');await until(()=>document.body.textContent?.includes('En cours'));
await click('Enquête');await until(()=>document.body.textContent?.includes('Créer une équipe'));
await input(label('Nom de l’équipe'),'UI Archivistes');await input(label('Membre 1'),'Alice');await submit(label('Nom de l’équipe'));await until(()=>document.querySelector('dialog[open]')?.textContent?.includes('Ton équipe est créée'));
await click('C’est gardé, continuer');await until(()=>buttons().some(b=>b.className.includes('mission-card')));
await click('Grande Arche');await until(()=>document.querySelector('dialog[open]')?.textContent?.includes('Votre réponse'));
await input(label('Votre réponse'),'200');await submit(label('Votre réponse'));await until(()=>document.querySelector('dialog[open]')?.textContent?.includes('Le seuil · relique obtenue'));
await click('Voir le carnet');await until(()=>document.body.textContent?.includes('1. Le seuil'));
await click('Points');await until(()=>document.body.textContent?.includes('Votre score'));assert.ok(document.body.textContent?.includes('100 pts'));
await click('Messages');await input(document.querySelector('input[aria-label="Message au maître de jeu"]') as HTMLInputElement,'Bonjour depuis le client');await submit(document.querySelector('.message-form input')!);await until(()=>document.body.textContent?.includes('Bonjour depuis le client'));
assert.ok(localStorage.getItem('reliquaire.captain'));await act(async()=>root.unmount());await mf.dispose();dom.window.close();console.log('PASS: real React UI: GM creates/starts screen session, creates team, solves puzzle, journal, points and message, captain saved.');
