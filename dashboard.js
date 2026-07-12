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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =====================================
// HTML Elements
// =====================================

const totalPlayers=document.getElementById("totalPlayers");

const totalTeams=document.getElementById("totalTeams");

const totalMatches=document.getElementById("totalMatches");

const liveMatches=document.getElementById("liveMatches");

const completedMatches=document.getElementById("completedMatches");

const registeredToday=document.getElementById("registeredToday");

const orangeCapLeader=document.getElementById("orangeCapLeader");

const purpleCapLeader=document.getElementById("purpleCapLeader");

const topTeam=document.getElementById("topTeam");

const currentLiveMatch=document.getElementById("currentLiveMatch");

const recentRegistrations=document.getElementById("recentRegistrations");

// =====================================
// Load Dashboard Statistics
// =====================================

async function loadStatistics(){

try{

// Players
  // =====================================
// Load Tournament Analytics
// =====================================

async function loadAnalytics(){

try{

// ---------- Orange Cap ----------

const playerSnap=await getDocs(collection(db,"registrations"));

let players=[];

playerSnap.forEach(doc=>{

players.push(doc.data());

});

players.sort((a,b)=>(b.runs||0)-(a.runs||0));

if(players.length>0){

orangeCapLeader.innerHTML=

`${players[0].playerName}<br>🏏 ${players[0].runs||0} Runs`;

}else{

orangeCapLeader.innerHTML="No Data";

}

// ---------- Purple Cap ----------

players.sort((a,b)=>(b.wickets||0)-(a.wickets||0));

if(players.length>0){

purpleCapLeader.innerHTML=

`${players[0].playerName}<br>🎯 ${players[0].wickets||0} Wickets`;

}else{

purpleCapLeader.innerHTML="No Data";

}

// ---------- Top Team ----------

const teamSnap=await getDocs(collection(db,"teams"));

let teams=[];

teamSnap.forEach(doc=>{

teams.push(doc.data());

});

teams.sort((a,b)=>(b.points||0)-(a.points||0));

if(teams.length>0){

topTeam.innerHTML=

`${teams[0].teamName}<br>🏆 ${teams[0].points||0} Points`;

}else{

topTeam.innerHTML="No Data";

}

// ---------- Live Match ----------

const matchSnap=await getDocs(collection(db,"matches"));

let found=false;

matchSnap.forEach(doc=>{

const match=doc.data();

if(match.status==="Live" && !found){

currentLiveMatch.innerHTML=

`${match.teamA} 🆚 ${match.teamB}`;

found=true;

}

});

if(!found){

currentLiveMatch.innerHTML="No Live Match";

}

}catch(error){

console.error("Analytics Error :",error);

}

}

// =====================================
// Recent Registrations
// =====================================

async function loadRecentRegistrations(){

try{

const snapshot=await getDocs(collection(db,"registrations"));

let
  // =====================================
// Auto Refresh Dashboard
// =====================================

setInterval(async()=>{

    await loadStatistics();

    await loadAnalytics();

    await loadRecentRegistrations();

},30000);

// =====================================
// Backup & Restore Buttons
// =====================================

document.getElementById("backupBtn").addEventListener("click",()=>{

    alert("💾 Backup feature will be connected to Firebase Storage in the next update.");

});

document.getElementById("restoreBtn").addEventListener("click",()=>{

    alert("⬆️ Restore feature will be available in the next update.");

});

// =====================================
// Website Settings Buttons
// =====================================

document.getElementById("changeBanner").addEventListener("click",()=>{

    alert("🖼 Banner Change feature coming soon.");

});

document.getElementById("changeLogo").addEventListener("click",()=>{

    alert("🏆 Logo Change feature coming soon.");

});

document.getElementById("changeSeason").addEventListener("click",()=>{

    alert("📅 Season Update feature coming soon.");

});

document.getElementById("websiteStatus").addEventListener("click",()=>{

    alert("🌐 Website Status: ONLINE ✅");

});

// =====================================
// Initialize Dashboard
// =====================================

async function initializeDashboard(){

    try{

        await loadStatistics();

        await loadAnalytics();

        await loadRecentRegistrations();

        console.log("👑 Super Admin Dashboard Loaded Successfully");

    }catch(error){

        console.error("Dashboard Initialization Error :",error);

    }

}

initializeDashboard();

// =====================================
// Refresh Dashboard
// =====================================

window.refreshDashboard = async function(){

    await loadStatistics();

    await loadAnalytics();

    await loadRecentRegistrations();

    alert("✅ Dashboard Refreshed Successfully");

};
  
