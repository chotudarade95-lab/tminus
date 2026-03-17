const CACHE_NAME = "tminus-cache-v3";

self.addEventListener("install", e => {
self.skipWaiting();
});

self.addEventListener("activate", e => {
e.waitUntil(
caches.keys().then(keys =>
Promise.all(
keys.map(key => {
if(key !== CACHE_NAME){
return caches.delete(key);
}
})
)
)
);
self.clients.claim();
});

self.addEventListener("fetch", e => {

if(
e.request.url.includes("firebase") ||
e.request.url.includes("firestore")
){
return;
}

e.respondWith(
fetch(e.request)
.then(res=>{
const clone=res.clone();
caches.open(CACHE_NAME).then(cache=>{
cache.put(e.request,clone);
});
return res;
})
.catch(()=>caches.match(e.request))
);

});
