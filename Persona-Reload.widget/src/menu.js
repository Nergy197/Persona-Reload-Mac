(function(){
'use strict';
const apps=window.PERSONA_APPS,NS='http://www.w3.org/2000/svg';
const list=document.getElementById('app-list'),toast=document.getElementById('toast');
let pressed=-1,selected=0,native=false,timer,counter=0,pending=new Map(),widths=[],frame=0,lastTime=0,settleUntil=0;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const angles=[-22,-15,-10,-16,-9,-12,-6,8],offsets=[55,48,22,13,30,3,-10,18],colors=['#77fefc','#16cffb','#7de6fd'];
const svg=el('svg',{viewBox:'0 0 820 1000',preserveAspectRatio:'xMinYMid meet',class:'menu-svg','aria-label':'Ứng dụng Mac'});list.appendChild(svg);
function el(name,attrs={}){const n=document.createElementNS(NS,name);for(const[k,v]of Object.entries(attrs))n.setAttribute(k,v);return n}
const defs=el('defs'),mask=el('mask',{id:'cursor-mask',maskUnits:'userSpaceOnUse',x:-100,y:-100,width:1200,height:1300});
mask.append(el('rect',{x:-100,y:-100,width:1200,height:1300,fill:'black'}));
const maskG=el('g'),maskP=el('polygon',{fill:'white'});maskG.append(maskP);mask.append(maskG);defs.append(mask);svg.append(defs);
// One cursor shared by all rows. It travels from its previous position.
const cursorG=el('g',{'aria-hidden':'true'}),pink=el('polygon',{fill:'#fd77d9'}),white=el('polygon',{fill:'white'});
cursorG.append(pink,white);svg.append(cursorG);
const layer=el('g'),redLayer=el('g',{mask:'url(#cursor-mask)','aria-hidden':'true'}),hitLayer=el('g');svg.append(layer,redLayer,hitLayer);
let states=apps.map((a,i)=>target(i)),cursor={x:0,y:0,angle:0,width:300,scale:1};
const rows=apps.map((app,i)=>{
 const group=el('g'),text=el('text',{x:0,y:0,'font-size':74});text.textContent=app.label;group.append(text);layer.append(group);
 const redGroup=el('g'),redText=el('text',{x:0,y:0,'font-size':74,fill:'#ff0000'});redText.textContent=app.label;redGroup.append(redText);redLayer.append(redGroup);
 const hit=el('rect',{class:'hit',x:0,y:0,width:350,height:57,rx:0,tabindex:0,role:'button','aria-label':app.vi,'data-app':app.id});
 // pointermove (not pointerenter): rows slide under a still cursor when the selection changes,
 // and that must not re-select. Launch the row pressed even if another row is under the cursor on release.
 hit.addEventListener('pointermove',()=>{if(selected!==i)select(i)});hit.addEventListener('focus',()=>{if(selected!==i)select(i)});
 hit.addEventListener('pointerdown',e=>{if(e.button===0){pressed=i;select(i)}});
 hit.addEventListener('keydown',e=>{if(e.key===' '){e.preventDefault();launch(i)}});hitLayer.append(hit);
 return{group,text,redGroup,redText,hit};
});
function target(i){return{x:145+(offsets[i]||0)+(i===selected?-8:0),y:246+i*58-(i<selected?30:0)-(i===selected?7:0),angle:angles[i]||0,scale:i===selected?1.42:1}}
function polygon(w,h=1){return(-40)+','+(10*h)+' '+(w+46)+','+(-52*h)+' '+(w+16)+','+(-3*h)}
function transform(s){return'translate('+s.x+' '+s.y+') rotate('+s.angle+') skewX(-13) scale('+(s.scale*.82)+' '+s.scale+')'}
function measure(){widths=rows.map(r=>r.text.getComputedTextLength());const s=target(selected);cursor={...s,width:widths[selected]||300};states=apps.map((a,i)=>target(i));render(performance.now());kick()}
function render(now){
 for(let i=0;i<rows.length;i++){
  const r=rows[i],s=states[i];r.group.setAttribute('transform',transform(s));r.redGroup.setAttribute('transform',transform(s));
  r.text.setAttribute('fill',i===selected?'#050509':colors[i%3]);r.redGroup.style.display=i===selected?'':'none';
  // Hit targets follow the visible labels, including their independent rotation.
  r.hit.setAttribute('x',-8);r.hit.setAttribute('y',-66);r.hit.setAttribute('height',79);r.hit.setAttribute('width',(widths[i]||300)+18);r.hit.setAttribute('transform',transform(s));
 }
 cursorG.setAttribute('transform',transform(cursor));maskG.setAttribute('transform',transform(cursor));
 const points=polygon(cursor.width);white.setAttribute('points',points);maskP.setAttribute('points',points);
 // Short independent pulse of the pink edge, rather than bouncing the label.
 const phase=now%850,pulse=reduced.matches?0:phase>600?Math.sin((phase-600)/250*Math.PI):0;
 pink.setAttribute('points',polygon(cursor.width+8+9*pulse,1.065+.045*pulse));
 pink.setAttribute('transform','translate('+(-5-4*pulse)+' '+(2+2*pulse)+')');
}
function tick(now){frame=0;if(document.hidden)return;const dt=Math.min(40,now-(lastTime||now-16));lastTime=now;const ease=reduced.matches?1:1-Math.exp(-dt/40);let moving=false;
 for(let i=0;i<states.length;i++){const t=target(i);for(const k of ['x','y','angle','scale']){const diff=t[k]-states[i][k];states[i][k]+=diff*ease;if(Math.abs(diff)>.02)moving=true}}
 const t={...target(selected),width:widths[selected]||300};for(const k of ['x','y','angle','scale','width'])cursor[k]+=(t[k]-cursor[k])*ease;
 render(now);
 if(moving||now<settleUntil)frame=requestAnimationFrame(tick);
}
function kick(){settleUntil=performance.now()+350;if(!frame){lastTime=0;frame=requestAnimationFrame(tick)}}
// No idle cursor pulse: a 30 fps SVG repaint cost ~30% of the WebKit GPU process.
function select(i){if(i<0||i>=apps.length)return;const changed=selected!==i;selected=i;
 document.getElementById('description').textContent=apps[i].detail;document.getElementById('description-vi').textContent=apps[i].vi;
 rows.forEach((r,j)=>r.hit.setAttribute('aria-pressed',String(j===i)));// Re-parenting the hit target between mousedown and mouseup cancels the click in WebKit.
 if(hitLayer.lastChild!==rows[i].hit)hitLayer.append(rows[i].hit);
 if(changed){const d=document.querySelector('.description');d.classList.remove('changing');void d.offsetWidth;d.classList.add('changing')}
 kick();
}
function notify(message){clearTimeout(timer);toast.textContent=message;toast.classList.add('visible');timer=setTimeout(()=>toast.classList.remove('visible'),3500)}
function launch(i){select(i);if(!native){notify('Xem thử '+apps[i].label+' — cài qua Übersicht để mở app thật.');return}
 const app=apps[i];if(!/^[A-Za-z0-9.-]+$/.test(app.bundle||'')){notify('Thiếu bundle id cho '+app.label+' trong config.js.');return}
 // open alone is enough: for a running app LaunchServices sends the reopen event and activates it,
 // which unhides it and lets the app restore minimized/closed windows. (A separate osascript reopen
 // hung for minutes on apps that never answer, e.g. Electron apps.)
 fetch('/run/',{method:'POST',body:'/usr/bin/open -b '+app.bundle}).then(r=>{if(!r.ok)notify('Không mở được '+app.label+'. Kiểm tra app đã cài trên máy.')}).catch(()=>notify('Chưa kết nối được Übersicht. Hãy Refresh All Widgets.'))
}
// Served by Übersicht's local server (not file://) means /run/ is available.
if(location.protocol.startsWith('http')){native=true;document.getElementById('mode').textContent='DESKTOP / READY'}
window.addEventListener('pointerup',()=>{const i=pressed;pressed=-1;if(i>=0)launch(i)});
document.addEventListener('keydown',e=>{if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const next=(selected+(e.key==='ArrowDown'?1:-1)+apps.length)%apps.length;select(next);rows[next].hit.focus({preventScroll:true})}else if(e.key==='Enter'){e.preventDefault();launch(selected)}else if(e.key==='Escape'){toast.classList.remove('visible');document.activeElement?.blur()}else if(e.key.toLowerCase()==='f'&&!e.metaKey&&!e.ctrlKey){fontInput.click()}});
// Optional font supplied locally by the user; never uploads the font.
const fontInput=document.createElement('input');fontInput.type='file';fontInput.accept='.otf,.ttf,.woff,.woff2';fontInput.hidden=true;document.body.append(fontInput);
async function setFont(data){const f=new FontFace('ReloadCustom',data);await f.load();document.fonts.add(f);measure();notify('Đã áp dụng font bạn chọn.')}
fontInput.addEventListener('change',async()=>{const f=fontInput.files[0];if(!f)return;try{await setFont(await f.arrayBuffer())}catch(e){notify('Không đọc được font. Hãy dùng tệp OTF, TTF hoặc WOFF.')}});
function clock(){const n=new Date();document.getElementById('date').textContent=String(n.getMonth()+1).padStart(2,'0')+' / '+String(n.getDate()).padStart(2,'0');document.getElementById('weekday').textContent=n.toLocaleDateString('en-US',{weekday:'long'}).toUpperCase();document.getElementById('time').textContent=n.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'})}
select(0);clock();setInterval(clock,30000);document.fonts.ready.then(measure);document.addEventListener('visibilitychange',()=>{if(!document.hidden)kick()});
})();
