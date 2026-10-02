// Underwater sway for hair tips and ribbons: each layer is redrawn as thin horizontal
// slices shifted by a sine wave, still at the root and strongest at the tips.
// (WebKit does not animate SVG filters on HTML elements, so this uses canvas.)
(()=>{
const host=document.querySelector('.character');if(!host)return;
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const IW=1560,IH=1008,ROW=4; // source image size; slice height in image px
const clamp=v=>Math.max(0,Math.min(1,v));
const layers=[
 // box = [x0,y0,x1,y1] in image px; ramp(y) = 0 at the root, 1 at the tips
 {src:'hair.png',box:[0,540,340,1008],ramp:y=>clamp((y-600)/320),amp:9,k:.032,w:2.1},
 {src:'ribbon.png',box:[190,60,470,445],ramp:y=>clamp((440-y)/320),amp:13,k:.022,w:1.5}
];
const cv=document.createElement('canvas');cv.className='ripple';host.append(cv);
const g=cv.getContext('2d');let cw=0,ch=0;
// Canvas covers only the hair/ribbon area (not the full screen) to keep GPU uploads small.
let s=1,ox=0,oy=0;const pad=Math.max(...layers.map(L=>L.amp))+2;
const bx0=Math.min(...layers.map(L=>L.box[0]))-pad,by0=Math.min(...layers.map(L=>L.box[1])),bx1=Math.max(...layers.map(L=>L.box[2]))+pad,by1=Math.max(...layers.map(L=>L.box[3]));
function size(){const d=devicePixelRatio||1;cw=host.clientWidth;ch=host.clientHeight;
 // Same mapping as CSS "background: 35% 50% / cover" used by the other layers.
 s=Math.max(cw/IW,ch/IH);ox=(cw-IW*s)*.35;oy=(ch-IH*s)*.5;
 const L=ox+bx0*s,T=oy+by0*s,w=(bx1-bx0)*s,h=(by1-by0)*s;
 Object.assign(cv.style,{left:L+'px',top:T+'px',width:w+'px',height:h+'px'});
 cv.width=Math.ceil(w*d);cv.height=Math.ceil(h*d);g.setTransform(d,0,0,d,-L*d,-T*d)}
function draw(t){
 g.clearRect(ox+bx0*s,oy+by0*s,(bx1-bx0)*s,(by1-by0)*s);
 for(const L of layers){if(!L.img.complete)continue;const[x0,y0,x1,y1]=L.box,bw=x1-x0;
  for(let y=y0;y<y1;y+=ROW){
   const dx=L.amp*L.ramp(y)*(Math.sin(y*L.k-t*L.w)+.35*Math.sin(y*L.k*2.3-t*L.w*1.7));
   g.drawImage(L.img,x0,y,bw,ROW,ox+(x0+dx)*s,oy+y*s,bw*s,ROW*s+.6);
  }}
}
layers.forEach(L=>{L.img=new Image();L.img.onload=()=>draw(0);L.img.src=L.src});
size();addEventListener('resize',()=>{size();draw(performance.now()/1000)});
setInterval(()=>{if(!document.hidden&&!reduced.matches&&!paused())draw(performance.now()/1000)},66); // ~15 fps: each redraw costs GPU time, so keep it low

// Animate only while no app window is on screen over the desktop. desktop-covered (tiny
// CoreGraphics helper, ~3 ms) prints 1/0; html.paused freezes every CSS animation.
const root=document.documentElement,paused=()=>root.classList.contains('paused');
function poll(){if(document.hidden)return;fetch('/run/',{method:'POST',body:'Persona-Reload.widget/src/desktop-covered'})
 .then(r=>r.ok?r.text():'0').then(t=>root.classList.toggle('paused',t.trim()==='1')).catch(()=>{})}
if(location.protocol.startsWith('http')){poll();setInterval(poll,1000);document.addEventListener('visibilitychange',poll)}
})();
