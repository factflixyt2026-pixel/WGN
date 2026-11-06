/* WayGo Experience: supportive progress, clear navigation, no pressure loops */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function state(){try{return JSON.parse(localStorage.getItem('waygo_study_v2')||'{}')}catch{return{}}}
function today(){return new Date().toLocaleDateString('en-CA')}
function countToday(){return(state().attempts||[]).filter(x=>x.date===today()).length}
function safeText(el,s){if(el)el.textContent=s}
function nav(){const file=location.pathname.split('/').pop()||'index.html';document.querySelectorAll('.links a,.bottom a').forEach(a=>{const href=a.getAttribute('href')||'';if(href===file)a.setAttribute('aria-current','page')});}
function home(){const hero=$('.hero');if(!hero||!['home.html','index.html'].includes(location.pathname.split('/').pop()))return;
 const last=Number(localStorage.getItem('waygo_last_question'))||1;
 const n=countToday(),goal=10;
 const section=document.createElement('section');section.className='wg-section wg-spotlight';section.setAttribute('aria-label','Tvoje dnešné učenie');
 section.innerHTML='<div class="wg-kicker">Tvoj priestor na učenie</div><h2>Stačí jeden malý krok.</h2><p>Pokračuj tam, kde si skončila. Učebná kartička ti najprv vysvetlí tému a potom si ju precvičíš.</p><div class="wg-mini-stats"><div class="wg-mini"><strong id="wgToday">'+n+'</strong><span>Dnes vyriešené</span></div><div class="wg-mini"><strong>'+goal+'</strong><span>Voliteľný denný cieľ</span></div><div class="wg-mini"><strong>'+Math.max(0,goal-n)+'</strong><span>Do dnešného cieľa</span></div></div><div class="wg-progress" role="progressbar" aria-label="Denný cieľ" aria-valuemin="0" aria-valuemax="'+goal+'" aria-valuenow="'+Math.min(n,goal)+'"><div style="width:'+Math.min(100,n/goal*100)+'%"></div></div><div class="actions"><a class="btn" href="feed.html#q'+last+'">Pokračovať v učení</a><a class="btn alt" href="study.html">Môj pokrok</a></div>';
 hero.insertAdjacentElement('afterend',section);
}
function feed(){if(!location.pathname.endsWith('feed.html'))return;const el=$('#feed');if(!el)return;
 const mission=document.createElement('div');mission.className='wg-feed-mission';mission.innerHTML='<div class="wg-topline"><h3>Dnešné učenie</h3><span class="small" id="wgMissionCount"></span></div><div class="wg-progress" role="progressbar" aria-label="Denný cieľ 10 otázok" aria-valuemin="0" aria-valuemax="10"><div id="wgMissionBar"></div></div><p id="wgMissionText"></p>';
 el.parentNode.insertBefore(mission,el);
 function update(){const n=countToday(),bar=$('#wgMissionBar');safeText($('#wgMissionCount'),n+' / 10');if(bar){bar.style.width=Math.min(100,n/10*100)+'%';bar.parentNode.setAttribute('aria-valuenow',String(Math.min(n,10)))}safeText($('#wgMissionText'),n>=10?'Dnešný cieľ je splnený. Môžeš si dopriať prestávku.':'Každá otázka je malý pokrok. Cieľ si môžeš prispôsobiť svojmu dňu.');}
 update();const observer=new MutationObserver(()=>{update();const q=$('.question',el);if(q&&!q.dataset.wgReady){q.dataset.wgReady='1';if(!$('#wgBreakLink',q)){const a=document.createElement('a');a.id='wgBreakLink';a.href='study.html';a.className='wg-bottom-link';a.textContent='Ukončiť blok a pozrieť si pokrok';q.append(a)}}});observer.observe(el,{childList:true,subtree:true});
 // Gestures are intentionally not intercepted: native scrolling and answer taps stay predictable.
}
function accessible(){document.querySelectorAll('button:not([type])').forEach(b=>{if(!b.closest('form'))b.type='button'});}
function init(){nav();home();feed();accessible();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
