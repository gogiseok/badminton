// 기석 매치메이커 — 항상 깃허브의 최신 파일을 먼저 확인하고, 인터넷이 끊겼을 때만 보관해 둔 화면을 보여줌
const C='kmm-v2';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES.map(u=>new Request(u,{cache:'reload'})))).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  const page=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname);
  e.respondWith(fetch(page?new Request(r.url,{cache:'no-cache',credentials:'same-origin'}):r).then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;})
    .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('./index.html'):undefined))));});
