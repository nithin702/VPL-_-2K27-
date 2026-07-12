// =====================================
// Firebase Imports
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================
// Firebase Config
// =====================================

const firebaseConfig = {

apiKey:"AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

authDomain:"vpl-2k27.firebaseapp.com",

projectId:"vpl-2k27",

storageBucket:"vpl-2k27.firebasestorage.app",

messagingSenderId:"919265368604",

appId:"1:919265368604:web:41587c7dd08f4c5d991dd9",

measurementId:"G-YL6CQ36HV6"

};

// =====================================
// Initialize Firebase
// =====================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// =====================================
// HTML Elements
// =====================================

const breakingTicker = document.getElementById("breakingTicker");

const newsContainer = document.getElementById("newsContainer");

const
  // =====================================
// Load Upcoming Events
// =====================================

async function loadEvents(){

try{

const snapshot = await getDocs(collection(db,"events"));

eventsContainer.innerHTML="";

if(snapshot.empty){

eventsContainer.innerHTML=

"<p>No Upcoming Events</p>";

return;

}

snapshot.forEach(doc=>{

const event = doc.data();

eventsContainer.innerHTML += `

<div class="event-card">

<h3>${event.title}</h3>

<p>

📅 ${event.date || "-"}

</p>

<p>

🕒 ${event.time || "-"}

</p>

<p>

📍 ${event.location || "VPL Ground"}

</p>

<p>

${event.description || ""}

</p>

</div>

`;

});

}catch(error){

console.error("Event Load Error :",error);

eventsContainer.innerHTML=

"<p>Unable to load events.</p>";

}

}

// =====================================
// Load Tournament Notices
// =====================================

async function loadNotices(){

try{

const snapshot = await getDocs(collection(db,"notices"));

noticeContainer.innerHTML="";

if(snapshot.empty){

noticeContainer.innerHTML=

"<p>No Notices Available</p>";

return;

}

snapshot.forEach(doc=>{

const notice = doc.data();

noticeContainer.innerHTML += `

<div class="notice-card">

<h3>${notice.title}</h3>

<p>

${notice.description}

</p>

<p class="news-date">

📅 ${notice.date || "-"}

</p>

</div>

`;

});

}catch(error){

console.error("Notice Load Error :",error);

noticeContainer.innerHTML=

"<p>Unable to load notices.</p>";

}

}
// =====================================
// Auto Refresh
// =====================================

setInterval(async()=>{

    await loadNews();

    await loadEvents();

    await loadNotices();

},30000);

// =====================================
// Initialize News Page
// =====================================

async function initializeNews(){

    try{

        await loadNews();

        await loadEvents();

        await loadNotices();

        console.log("📢 VPL News Loaded Successfully");

    }catch(error){

        console.error("News Initialization Error :",error);

    }

}

initializeNews();

// =====================================
// Refresh Button (Optional)
// =====================================

window.refreshNews = async function(){

    await loadNews();

    await loadEvents();

    await loadNotices();

    alert("✅ News Updated Successfully");

};

// =====================================
// Page Visibility Refresh
// =====================================

document.addEventListener("visibilitychange",async()=>{

    if(!document.hidden){

        await loadNews();

        await loadEvents();

        await loadNotices();

    }

});
