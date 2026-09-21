const DB={get(k,d=null){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){localStorage.setItem(k,JSON.stringify(v))}};
const user=()=>DB.get('session');
function guard(){if(!user())location.href='patient-login.html'}
function logout(){localStorage.removeItem('session');location.href='../index.html'}
async function api(url,method='GET',body){
  const r=await fetch('/api'+url,{method,headers:{'Content-Type':'application/json',...(user()?{Authorization:'Bearer '+user().token}:{})},body:body&&JSON.stringify(body)});
  const d=await r.json().catch(()=>({}));
  if(r.status===401&&user())logout();
  if(!r.ok)throw new Error(d.error||'Something went wrong. Try again.');
  return d;
}
function msg(t){document.getElementById('err').textContent=t}
const form=e=>{e.preventDefault();return Object.fromEntries(new FormData(e.target))};
function nav(){const h=document.querySelector('header');if(!h)return;const u=user();
h.innerHTML=`<strong>HMIS</strong><nav>${u?`<a href="dashboard.html">Dashboard</a><a href="#" onclick="logout()">Log out (${u.name})</a>`:''}</nav>`}
async function register(e){const f=form(e);try{await api('/register','POST',f);location.href='patient-login.html'}catch(x){msg(x.message)}}
async function login(e){const f=form(e);try{DB.set('session',await api('/login','POST',f));location.href='dashboard.html'}catch(x){msg(x.message)}}
async function book(e){const f=form(e);try{const a=await api('/appointments','POST',f);DB.set('lastAppt',a.id);location.href='case-summary.html'}catch(x){alert(x.message)}}
async function saveCase(e){const f=form(e);try{await api('/appointments/'+DB.get('lastAppt'),'PATCH',f);location.href='prescription.html'}catch(x){alert(x.message)}}
async function pay(){try{await api('/appointments/'+DB.get('lastAppt')+'/pay','POST');location.href='confirmation.html'}catch(x){alert(x.message)}}
const lastAppt=()=>api('/appointments/'+DB.get('lastAppt')).catch(()=>null);
window.addEventListener('DOMContentLoaded',nav);