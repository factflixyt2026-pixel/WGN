/* WayGo local SVG icon system. No emoji or external icon CDN required. */
(()=>{'use strict';
const paths={"home":"<path d=\"m3 10 9-7 9 7v10H3V10Z\"/><path d=\"M9 20v-7h6v7\"/>","user":"<circle cx=\"12\" cy=\"8\" r=\"4\"/><path d=\"M4 21a8 8 0 0 1 16 0\"/>","globe": "<circle cx=\"12\" cy=\"12\" r=\"10\"/><path d=\"M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20\"/>", "zap": "<path d=\"m13 2-3 8H5l6 12 3-8h5z\"/>", "arrow-up-right": "<path d=\"M7 17 17 7M7 7h10v10\"/>", "users": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3a4 4 0 0 1 0 8M22 21v-2a4 4 0 0 0-3-3.87\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/>", "brain": "<path d=\"M12 18V5a3 3 0 0 0-6 0 4 4 0 0 0-2 7 4 4 0 0 0 2 7 3 3 0 0 0 6-1ZM12 18V5a3 3 0 0 1 6 0 4 4 0 0 1 2 7 4 4 0 0 1-2 7 3 3 0 0 1-6-1Z\"/>", "dna": "<path d=\"M2 15c6-2 14-4 20-12M2 9c6 2 14 4 20 12M7 7l3 3m4 4 3 3M7 17l3-3m4-4 3-3\"/>", "trophy": "<path d=\"M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4ZM7 6H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4\"/>", "moon": "<path d=\"M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z\"/>", "book-open": "<path d=\"M12 7v14M3 18V4a2 2 0 0 1 2-2h3a4 4 0 0 1 4 4 4 4 0 0 1 4-4h3a2 2 0 0 1 2 2v14h-5a4 4 0 0 0-4 3 4 4 0 0 0-4-3H3Z\"/>", "sun": "<circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41\"/>", "sparkles": "<path d=\"m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3ZM19 17l.7 1.3L21 19l-1.3.7L19 21l-.7-1.3L17 19l1.3-.7L19 17Z\"/>", "medal": "<circle cx=\"12\" cy=\"15\" r=\"6\"/><path d=\"m8 2 4 7 4-7M5 2h4m6 0h4m-7 11v4\"/>", "party-popper": "<path d=\"m5 20 9-9M3 21l4-12 8 8-12 4ZM14 4l1 2m5 1-2 1m-2 4 2 1M18 2l1 2\"/>", "alert-triangle": "<path d=\"m10.3 3.9-8.1 14a2 2 0 0 0 1.7 3h16.2a2 2 0 0 0 1.7-3l-8.1-14a2 2 0 0 0-3.4 0ZM12 9v4m0 4h.01\"/>", "lock-keyhole": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3m-4 5v2\"/>", "lock": "<rect x=\"4\" y=\"10\" width=\"16\" height=\"12\" rx=\"2\"/><path d=\"M8 10V7a4 4 0 0 1 8 0v3\"/>", "heart": "<path d=\"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z\"/>", "flower": "<circle cx=\"12\" cy=\"12\" r=\"2\"/><path d=\"M12 10C5 1 17 1 12 10Zm2 2c9-7 9 5 0 0Zm-2 2c7 9-5 9 0 0Zm-2-2c-9 7-9-5 0 0Z\"/>", "waves": "<path d=\"M2 6c3-3 5 3 8 0s5-3 8 0 3 0 4 0M2 12c3-3 5 3 8 0s5-3 8 0 3 0 4 0M2 18c3-3 5 3 8 0s5-3 8 0 3 0 4 0\"/>", "leaf": "<path d=\"M20 4C8 4 4 10 4 16a4 4 0 0 0 4 4c6 0 12-4 12-16ZM4 20c4-6 8-9 13-12\"/>", "sunrise": "<path d=\"M12 2v4m-8 6H2m20 0h-2M5 5l2 2m12-2-2 2M2 20h20M6 16a6 6 0 0 1 12 0M12 9v7m-3-3 3 3 3-3\"/>", "flask-conical": "<path d=\"M9 3h6m-5 0v7L4 20a1 1 0 0 0 1 2h14a1 1 0 0 0 1-2l-6-10V3M7 16h10\"/>", "ruler": "<path d=\"M21 3 3 21m0-7v7h7M13 5l6 6m-9-3 2 2m-5 1 2 2\"/>", "pencil": "<path d=\"m15 5 4 4M3 21l4-1 13-13a3 3 0 0 0-4-4L3 16v5Z\"/>", "pen-line": "<path d=\"m12 19 7-7 3 3-7 7-4 1 1-4ZM2 17h7m-7 4h6M5 4l4 4\"/>", "highlighter": "<path d=\"m9 11 4 4 9-9-4-4-9 9ZM3 17l4 4 6-6-4-4-6 6ZM2 22h12\"/>", "file-pen-line": "<path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8M14 2v6h6M14 2l6 6v5M8 13h4M8 17h3m4 3 5-5 2 2-5 5-3 1 1-3Z\"/>", "arrow-down-left": "<path d=\"m17 7-10 10m10 0H7V7\"/>"};
const rx=/\[\[wg:([a-z-]+)\]\]/g;
function make(name){
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('width','1em');svg.setAttribute('height','1em');
 svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.classList.add('wg-svg-icon');
 const template=document.createElement('template');template.innerHTML='<svg xmlns="'+ns+'">'+(paths[name]||paths['sparkles'])+'</svg>';
 const inner=template.content.firstChild;while(inner.firstChild)svg.appendChild(inner.firstChild);
 return svg;
}
function replaceNode(node){
 const value=node.nodeValue;if(!value||!value.includes('[[wg:'))return;
 const parent=node.parentElement;if(!parent)return;
 if(['SCRIPT','STYLE','TEXTAREA','OPTION','TITLE'].includes(parent.tagName))return;
 const frag=document.createDocumentFragment();let last=0,m;rx.lastIndex=0;
 while((m=rx.exec(value))){if(m.index>last)frag.append(document.createTextNode(value.slice(last,m.index)));frag.append(make(m[1]));last=rx.lastIndex}
 if(last===0)return;if(last<value.length)frag.append(document.createTextNode(value.slice(last)));
 node.replaceWith(frag);
}
function scan(root){if(root.nodeType===3){replaceNode(root);return}if(root.nodeType!==1&&root.nodeType!==9)return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);nodes.forEach(replaceNode)}
function start(){const style=document.createElement('style');style.textContent='.wg-svg-icon{display:inline-block;vertical-align:-.14em;flex-shrink:0;stroke:currentColor}';document.head.append(style);scan(document.body);
 const obs=new MutationObserver(records=>{for(const r of records){if(r.type==='characterData')replaceNode(r.target);else for(const n of r.addedNodes)scan(n)}});obs.observe(document.body,{childList:true,subtree:true,characterData:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
