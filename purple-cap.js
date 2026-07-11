
// ======================================
// Firebase Imports
// ======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,

collection,

getDocs

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ======================================
// Firebase Config
// ======================================

const firebaseConfig = {

apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

authDomain: "vpl-2k27.firebaseapp.com",

projectId: "vpl-2k27",

storageBucket: "vpl-2k27.firebasestorage.app",

messagingSenderId: "919265368604",

appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",

measurementId: "G-YL6CQ36HV6"

};

// ======================================
// Initialize Firebase
// ======================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ======================================
// HTML Elements
// ======================================

const leaderCard = document.getElementById("leaderCard");

const purpleTable = document.getElementById("purpleTable");

const totalBowlers = document.getElementById("totalBowlers");

const totalWickets = document.getElementById("totalWickets");

const bestBowling = document.getElementById("bestBowling");

const lastUpdated = document.getElementById("lastUpdated");

// ======================================
// Variables
// ======================================

let bowlers = [];

let totalTournamentWickets = 0;

// ======================================
// Load Bowlers
// ======================================

async function loadBowlers(){

try{

bowlers=[];

const snapshot=await getDocs(collection(db,"registrations"));

snapshot.forEach((docSnap)=>{

const player=docSnap.data();

player.id=docSnap.id;

bowlers.push(player);

});

// Sort by Wickets

bowlers.sort((a,b)=>(b.wickets||0)-(a.wickets||0));

displayLeader();

}catch(error){

console.error("Purple Cap Error :",error);

leaderCard.innerHTML="<p>Unable to load bowlers.</p>";
  // ======================================
// Display Purple Cap Holder
// ======================================

function displayLeader(){

if(bowlers.length===0){

leaderCard.innerHTML="<p>No Bowlers Found.</p>";

return;

}

const leader=bowlers[0];

leaderCard.innerHTML=`

<h3>👑 ${leader.playerName}</h3>

<p>

🏏 Team :
<b>${leader.soldTo || leader.teamName || "-"}</b>

<br><br>

🟣 Wickets :
<b>${leader.wickets || 0}</b>

<br>

🎯 Runs Conceded :
<b>${leader.runsConceded || 0}</b>

<br>

🏏 Overs :
<b>${leader.oversBowled || 0}</b>

<br>

📊 Economy :
<b>${leader.economy || 0}</b>

</p>

`;

displaySummary();

displayTable();

}

// ======================================
// Tournament Summary
// ======================================

function displaySummary(){

totalTournamentWickets=0;

let best=0;

bowlers.forEach(player=>{

const wickets=player.wickets || 0;

totalTournamentWickets+=wickets;

if(wickets>best){

best=wickets;

}

});

totalBowlers.innerHTML=
`🎯 Total Bowlers : ${bowlers.length}`;

totalWickets.innerHTML=
`🟣 Total Wickets : ${totalTournamentWickets}`;

bestBowling.innerHTML=
`🏆 Best Bowling : ${best} Wickets`;

lastUpdated.innerHTML=
new Date().toLocaleString();

}
  // ======================================
// Display Purple Cap Table
// ======================================

function displayTable(){

purpleTable.innerHTML="";

bowlers.forEach((player,index)=>{

purpleTable.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${player.playerName || "-"}</td>

<td>${player.soldTo || player.teamName || "-"}</td>

<td>${player.wickets || 0}</td>

<td>${player.oversBowled || 0}</td>

<td>${player.runsConceded || 0}</td>

<td>${player.economy || 0}</td>

</tr>

`;

});

}

// ======================================
// Auto Refresh
// ======================================

setInterval(async()=>{

await loadBowlers();

},10000);

// ======================================
// Refresh When Page Becomes Active
// ======================================

document.addEventListener("visibilitychange",async()=>{

if(!document.hidden){

await loadBowlers();

}

});

// ======================================
// Initialize Purple Cap
// ======================================

async function initializePurpleCap(){

try{

await loadBowlers();

console.log("🟣 Purple Cap Loaded Successfully");

}catch(error){

console.error(error);

leaderCard.innerHTML="<p>Failed to load Purple Cap.</p>";

}

}

initializePurpleCap();
