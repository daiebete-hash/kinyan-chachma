const names={"סנהדרין":{id:"sanhedrin",title:"מסכת סנהדרין",weeks:75,end:"דף קי״ג ע״ב",short:"75 שבועות לימוד"},"בבא קמא":{id:"bavakama",title:"מסכת בבא קמא",weeks:79,end:"דף קי״ט ע״ב",short:"79 שבועות לימוד"}};
const heads=["שבוע","תאריכי השבוע","פרשת השבוע","ימי לימוד","ההספק","הפרק"];
let currentId=null;
function isStudy(r){return r[3]!=null&&r[4]!=null}
function renderCards(){
 document.getElementById('cards').innerHTML=Object.entries(names).map(([k,n])=>`<article class="program-card" onclick="show('${n.id}')"><i class="stripe"></i><h3>${n.title}</h3><div class="sub">תכנית לימוד שבועית מסודרת</div><div class="card-bottom"><div class="badges"><span class="badge">${n.weeks} שבועות לימוד</span><span class="badge">סיום ${n.end}</span></div><div class="open-link">לצפייה בלוח <span>←</span></div></div></article>`).join('')
}
function show(id){
 currentId=id; document.getElementById('home').classList.add('hide'); document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));
 const key=Object.keys(names).find(k=>names[k].id===id),n=names[key],rows=DATA[key]||[],study=rows.filter(isStudy).length;
 const chapters=[...new Set(rows.map(r=>r[5]).filter(Boolean))];
 document.getElementById(id).innerHTML=`<div class="view-head"><div class="view-head-top"><div class="view-title"><div class="bookmark">✦</div><div><h2>${n.title}</h2><p>${n.short} · סיום ${n.end}</p></div></div><div class="actions"><button class="btn" onclick="home()">→ חזרה למסכתות</button><button class="btn primary" onclick="window.print()">הדפסה</button></div></div><div class="progress"><i style="width:${Math.round(study/rows.length*100)}%"></i></div><div class="count">${study} שבועות לימוד מתוך ${rows.length} שבועות בלוח</div><div class="controls"><input class="search" id="q-${id}" placeholder="חיפוש לפי שבוע, תאריך, פרשה, דף או פרק…" oninput="filter('${id}')"><select class="select" id="mode-${id}" onchange="filter('${id}')"><option value="all">הצגת כל השבועות</option><option value="study">שבועות לימוד בלבד</option><option value="break">בין הזמנים / ללא לימוד</option></select><select class="select" id="chapter-${id}" onchange="filter('${id}')"><option value="all">כל הפרקים</option>${chapters.map(c=>`<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join('')}</select></div></div><div class="tablebox"><table><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody id="body-${id}">${rows.map((r,i)=>rowHtml(r,i)).join('')}</tbody></table><div id="empty-${id}" class="empty hide">לא נמצאו שבועות התואמים לחיפוש.</div></div>`;
 document.getElementById(id).classList.add('active'); window.scrollTo({top:0,behavior:'smooth'});
}
function rowHtml(r,i){const study=isStudy(r);return `<tr data-study="${study}" data-chapter="${escapeAttr(r[5]||'')}" class="${study?'':'break-row'}">${r.map((v,j)=>`<td class="${j===0?'week-cell':''} ${j===4?'daf':''} ${j===5?'chapter':''}">${v==null?(j===2?'—':'—'):escapeHtml(String(v))}</td>`).join('')}</tr>`}
function filter(id){
 const q=(document.getElementById('q-'+id)?.value||'').trim().toLowerCase(),mode=document.getElementById('mode-'+id)?.value||'all',chapter=document.getElementById('chapter-'+id)?.value||'all';
 let visible=0;document.querySelectorAll('#body-'+id+' tr').forEach(tr=>{const text=tr.innerText.toLowerCase(),okQ=!q||text.includes(q),okMode=mode==='all'||(mode==='study'&&tr.dataset.study==='true')||(mode==='break'&&tr.dataset.study==='false'),okChapter=chapter==='all'||tr.dataset.chapter===chapter;const show=okQ&&okMode&&okChapter;tr.style.display=show?'':'none';if(show)visible++});document.getElementById('empty-'+id)?.classList.toggle('hide',visible!==0)
}
function home(){currentId=null;document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById('home').classList.remove('hide');window.scrollTo({top:0,behavior:'smooth'})}
function scrollToPrograms(){document.getElementById('programs').scrollIntoView({behavior:'smooth'})}
function scrollToInfo(){document.getElementById('info').scrollIntoView({behavior:'smooth'})}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function escapeAttr(s){return escapeHtml(s)}
window.addEventListener('kinyan-data-ready',renderCards);