
// =====================================
// Firebase Imports
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

query,

where,

limit

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================
// Firebase Config
// =====================================

const firebaseConfig = {

apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

authDomain: "vpl-2k27.firebaseapp.com",

projectId: "vpl-2k27",

storageBucket: "vpl-2k27.firebasestorage.app",

messagingSenderId: "919265368604",

appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",

measurementId: "G-YL6CQ36HV6"

};

// =====================================
// Initialize Firebase
// =====================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// =====================================
// HTML Elements
// =====================================

const liveMatch=document.getElementById("liveMatch");

const upcomingMatch=document.getElementById("upcomingMatch");

const orangeLeader=document.getElementById("orangeLeader");

const purpleLeader=document.getElementById("purpleLeader");

const latestResult=document.getElementById("latestResult");

const pointsPreview=document.getElementById("pointsPreview");

const teamsCount=document.getElementById("teamsCount");

const playersCount=document.getElementById("playersCount");

const matchesCount=document.getElementById("matchesCount");

const completedCount=document.getElementById("completedCount");

// =====================================
// Load Tournament Statistics
// =====================================

async function loadTournamentStats(){

const players=await getDocs(collection(db,"registrations"));

playersCount.innerHTML=players.size;

const teams=await getDocs(collection(db,"teams"));

teams
  // =====================================
// Load Live Match
// =====================================

async function loadLiveMatch(){

try{

const snapshot=await getDocs(collection(db,"matches"));

let found=false;

snapshot.forEach(doc=>{

const match=doc.data();

if(match.status==="Live"){

found=true;

liveMatch.innerHTML=`

<h3>${match.team1} 🆚 ${match.team2}</h3>

<h2>

${match.liveRuns || 0}/${match.liveWickets || 0}

</h2>

<p>

Overs : ${match.liveOvers || "0.0"}

</p>

<p style="color:red;font-weight:bold;">

🔴 LIVE

</p>

<a href="live.html"

style="display:inline-block;
margin-top:15px;
padding:10px 18px;
background:red;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;">

📺 Watch Live

</a>

`;

}

});

if(!found){

liveMatch.innerHTML=

"<p>No Live Match Available</p>";

}

}catch(error){

console.error(error);

}

}

// =====================================
// Load Upcoming Match
// =====================================

async function loadUpcomingMatch(){

try{

const snapshot=await getDocs(collection(db,"matches"));

let found=false;

snapshot.forEach(doc=>{

const match=doc.data();

if(!found &&

(match.status==="Upcoming" ||

match.status==="Scheduled")){

found=true;

upcomingMatch.innerHTML=`

<h3>

${match.team1}

🆚

${match.team2}

</h3>

<p>

📅 ${match.matchDate || "-"}

</p>

<p>

🕒 ${match.matchTime || "-"}

</p>

<p>

🏟️ ${match.ground || "VPL Ground"}

</p>

`;

}

});

if(!found){

upcomingMatch.innerHTML=

"<p>No Upcoming Match</p>";

}

}catch(error){

console.error(error);

}

}
 // =====================================
// Load Orange Cap Holder
// =====================================

async function loadOrangeCap(){

try{

const snapshot=await getDocs(collection(db,"registrations"));

let players=[];

snapshot.forEach(doc=>{

players.push(doc.data());

});

players.sort((a,b)=>(b.runs||0)-(a.runs||0));

if(players.length>0){

const p=players[0];

orangeLeader.innerHTML=`

<h3>👑 ${p.playerName}</h3>

<p>🏏 Team : ${p.soldTo || "-"}</p>

<p>🔥 Runs : ${p.runs || 0}</p>

<p>⚡ Strike Rate : ${p.strikeRate || 0}</p>

`;

}else{

orangeLeader.innerHTML="<p>No Data Available</p>";

}

}catch(error){

console.error(error);

}

}

// =====================================
// Load Purple Cap Holder
// =====================================

async function loadPurpleCap(){

try{

const snapshot=await getDocs(collection(db,"registrations"));

let players=[];

snapshot.forEach(doc=>{

players.push(doc.data());

});

players.sort((a,b)=>(b.wickets||0)-(a.wickets||0));

if(players.length>0){

const p=players[0];

purpleLeader.innerHTML=`

<h3>👑 ${p.playerName}</h3>

<p>🏏 Team : ${p.soldTo || "-"}</p>

<p>🟣 Wickets : ${p.wickets || 0}</p>

<p>📉 Economy : ${p.economy || 0}</p>

`;

}else{

purpleLeader.innerHTML="<p>No Data Available</p>";

}

}catch(error){

console.error(error);

}

}

// =====================================
// Load Latest Result
// =====================================

async function loadLatestResult(){

try{

const snapshot=await getDocs(collection(db,"matches"));

let latest=null;

snapshot.forEach(doc=>{

const match=doc.data();

if(match.status==="Completed"){

latest=match;

}

});

if(latest){

latestResult.innerHTML=`

<h3>

${latest.team1}

🆚

${latest.team2}

</h3>

<p>

🏆 Winner :

<b>${latest.winner || "TBD"}</b>

</p>

<p>

Score :

${latest.liveRuns || 0}/${latest.liveWickets || 0}

(${latest.liveOvers || "0.0"} Overs)

</p>

`;

}else{

latestResult.innerHTML="<p>No Match Result Available</p>";

}

}catch(error){

console.error(error);

}

}
  // =====================================
// Load Top 4 Points Table
// =====================================

async function loadPointsPreview(){

try{

const snapshot=await getDocs(collection(db,"teams"));

let teams=[];

snapshot.forEach(doc=>{

teams.push(doc.data());

});

// Sort by Points

teams.sort((a,b)=>(b.points||0)-(a.points||0));

pointsPreview.innerHTML="";

teams.slice(0,4).forEach((team,index)=>{

pointsPreview.innerHTML+=`

<tr>

<td>${index+1}</td>

<td>${team.teamName || "-"}</td>

<td>${team.points || 0}</td>

</tr>

`;

});

if(teams.length===0){

pointsPreview.innerHTML=`

<tr>

<td colspan="3">

No Teams Found

</td>

</tr>

`;

}

}catch(error){

console.error(error);

}

}

// =====================================
// Auto Refresh Every 10 Seconds
// =====================================

setInterval(async()=>{

await loadTournamentStats();

await loadLiveMatch();

await loadUpcomingMatch();

await loadOrangeCap();

await loadPurpleCap();

await loadLatestResult();

await loadPointsPreview();

},10000);

// =====================================
// Initialize Home Page
// =====================================

async function initializeHome(){

try{

await loadTournamentStats();

await loadLiveMatch();

await loadUpcomingMatch();

await loadOrangeCap();

await loadPurpleCap();

await loadLatestResult();

await loadPointsPreview();

console.log("🏏 VPL 2K27 Home Loaded Successfully");

}catch(error){

console.error(error);

}

}

initializeHome();
