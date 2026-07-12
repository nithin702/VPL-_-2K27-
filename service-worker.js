
// =====================================
// VPL 2K27 Service Worker
// =====================================

const CACHE_NAME = "vpl2k27-v1";

// =====================================
// Files to Cache
// =====================================

const FILES_TO_CACHE = [

"/",

"/home.html",
"/home.css",
"/home.js",

"/index.html",
"/style.css",
"/script.js",

"/live.html",
"/live.css",
"/live.js",

"/result.html",
"/result.css",
"/result.js",

"/points.html",
"/points.css",
"/points.js",

"/gallery.html",
"/gallery.css",
"/gallery.js",

"/news.html",
"/news.css",
"/news.js",

"/dashboard.html",
"/dashboard.css",
"/dashboard.js",

"/offline.html"

];

// =====================================
// Install Event
// =====================================

self.addEventListener("install",(event)=>{

console.log("✅ Service Worker Installed");

event.waitUntil(

caches.open(CACHE_NAME)

.then(cache=>{

return cache.addAll(FILES_TO_CACHE);

})

);

self.skipWaiting();

});

// =====================================
// Activate Event
// =====================================

self.addEventListener("activate",(event)=>{

console.log("🚀 Service Worker Activated");

event.waitUntil(

caches.keys().then(keys=>{

return Promise.all(

keys.map(key=>{

if(key!==CACHE_NAME){

return caches.delete(key);

}

})

);

})

);

self.clients.claim();

});
// =====================================
// Fetch Event
// =====================================

self.addEventListener("fetch",(event)=>{

event.respondWith(

caches.match(event.request)

.then(response=>{

if(response){

return response;

}

return fetch(event.request)

.then(networkResponse=>{

if(

event.request.method==="GET" &&

event.request.url.startsWith("http")

){

const responseClone=networkResponse.clone();

caches.open(CACHE_NAME)

.then(cache=>{

cache.put(event.request,responseClone);

});

}

return networkResponse;

})

.catch(()=>{

if(event.request.mode==="navigate"){

return caches.match("/offline.html");

}

});

})

);

});

// =====================================
// Background Sync (Ready for Future)
// =====================================

self.addEventListener("sync",(event)=>{

if(event.tag==="sync-data"){

console.log("🔄 Background Sync Started");

}

});

// =====================================
// Push Notifications (Ready for Future)
// =====================================

self.addEventListener("push",(event)=>{

const data=event.data
?event.data.json()
:{
title:"VPL 2K27",
body:"New Tournament Update Available",
icon:"icons/icon-192.png"
};

event.waitUntil(

self.registration.showNotification(data.title,{

body:data.body,

icon:data.icon,

badge:"icons/icon-192.png",

vibrate:[200,100,200],

data:{

url:"/home.html"

}

})

);

});

// =====================================
// Notification Click
// =====================================

self.addEventListener("notificationclick",(event)=>{

event.notification.close();

event.waitUntil(

clients.openWindow("/home.html")

);

});
