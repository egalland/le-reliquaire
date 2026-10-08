import { assets } from './assets.js';
import { reliquaireApi } from '../reliquaire/server/api.ts';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/reliquaire/'))return reliquaireApi(request,env);
 if(url.pathname==='/reliquaire')return Response.redirect(url.origin+'/reliquaire/'+url.search,302);
 if(!['GET','HEAD'].includes(request.method))return new Response('Méthode non autorisée',{status:405});
 const name=url.pathname==='/'||url.pathname==='/reliquaire/'?'/reliquaire/index.html':url.pathname;
 const asset=assets[name];if(!asset)return new Response('Page introuvable',{status:404});
 return new Response(request.method==='HEAD'?null:Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0)),{headers:{'Content-Type':asset.type,'Cache-Control':'private, no-cache','X-Content-Type-Options':'nosniff'}});
}};
