import type {Campaign,Mission,Point,Team} from "./types";
export const normalize=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/\s+/g," ");
export function distance(a:Point,b:Point){const r=Math.PI/180;const h=Math.sin((b.lat-a.lat)*r/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin((b.lng-a.lng)*r/2)**2;return 6371000*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h));}
export const inZone=(p:Point,m:Mission,accuracy:number)=>accuracy<=Math.max(150,m.radius*2)&&distance(p,m)<=m.radius;
export const missionPoints=(campaign:Campaign,hints:number)=>Math.max(0,campaign.points-hints*campaign.hintPenalty);
export const sortTeams=(teams:Team[])=>[...teams].sort((a,b)=>b.score-a.score||a.penalty-b.penalty||a.elapsed-b.elapsed||a.name.localeCompare(b.name,"fr"));
export const formatTime=(seconds:number)=>{const s=Math.max(0,Math.floor(seconds));return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;};
export function shortestOrder(start:Point,missions:Mission[]){if(missions.length>9){const todo=[...missions],out:Mission[]=[];let p=start;while(todo.length){todo.sort((a,b)=>distance(p,a)-distance(p,b));const m=todo.shift()!;p=m;out.push(m);}return out;}let best:Mission[]=[];let cost=Infinity;function visit(p:Point,left:Mission[],order:Mission[],d:number){if(d>=cost)return;if(!left.length){best=order;cost=d;return;}left.forEach((m,i)=>visit(m,left.filter((_,j)=>j!==i),[...order,m],d+distance(p,m)));}visit(start,missions,[],0);return best;}
