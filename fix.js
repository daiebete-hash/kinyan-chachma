(function(){
  function localToday(){const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
  function safeEsc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
  if(typeof getCurrentIndex==='function') getCurrentIndex=function(){const t=localToday();let i=0;WEEK_STARTS.forEach((d,j)=>{if(d<=t)i=j});return i};
  if(typeof go==='function') go=async function(view){const el=document.getElementById(view);if(!el)return;document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));el.classList.add('active');document.querySelectorAll('.navbtn').forEach(x=>x.classList.toggle('active',x.dataset.view===view));try{if(view==='home')renderHome();else if(view==='plan')await renderPlan();else if(view==='personal')await renderPersonal();else if(view==='admin')await renderAdmin()}catch(e){console.error(e);el.innerHTML=`<div class="card error">אירעה שגיאה בטעינת הדף.<br><small>${safeEsc(e.message||'שגיאה לא ידועה')}</small></div>`}};
  function bindNav(){document.querySelectorAll('.navbtn').forEach(b=>{b.onclick=()=>go(b.dataset.view)})}
  function patch(){currentIndex=getCurrentIndex();bindNav();const admin=document.getElementById('adminNav');if(admin)admin.onclick=()=>go('admin')}
  patch();
  window.addEventListener('kinyan-data-ready',patch);
  if(window.sb&&sb.auth)sb.auth.onAuthStateChange(()=>setTimeout(patch,50));
})();
