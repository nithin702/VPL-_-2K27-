
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

const orangeTable = document.getElementById("orangeTable");

const totalPlayers = document.getElementById("totalPlayers");

const totalRuns = document.getElementById("totalRuns");

const highestScore = document.getElementById("highestScore");

const lastUpdated = document.getElementById("lastUpdated");

// ======================================
// Variables
// ======================================

let players = [];
// ======================================
// Display Orange Cap Holder
// ======================================

function displayLeader(){

if(players.length===0){

leaderCard.innerHTML="<p>No Players Found.</p>";

return;

}

const leader=players[0];

leaderCard.innerHTML=`

<h3>👑 ${leader.playerName}</h3>

<p>

🏏 Team : <b>${leader.soldTo || leader.teamName || "-"}</b>

<br><br>

🔥 Runs : <b>${leader.runs || 0}</b>

<br>

🏏 Balls : <b>${leader.balls || 0}</b>

<br>

⚡ Strike Rate : <b>${leader.strikeRate || 0}</b>

<br>

4️⃣ Fours : <b>${leader.fours || 0}</b>

<br>

6️⃣ Sixes : <b>${leader.sixes || 0}</b>

</p>

`;

displaySummary();

displayTable();

}

// ======================================
// Tournament Summary
// ======================================

function displaySummary(){

totalTournamentRuns=0;

let highest=0;

players.forEach(player=>{

const runs=player.runs || 0;

totalTournamentRuns+=runs;

if(runs>highest){

highest=runs;

}

});

totalPlayers.innerHTML=
`👥 Total Players : ${players.length}`;

totalRuns.innerHTML=
`🏏 Total Runs : ${totalTournamentRuns}`;

highestScore.innerHTML=
`🔥 Highest Score : ${highest}`;

lastUpdated.innerHTML=
new Date().toLocaleString();

}
// ======================================
// Display Leaderboard Table
// ======================================

function displayTable(){

orangeTable.innerHTML="";

players.forEach((player,index)=>{

orangeTable.innerHTML += `

<tr>

<td>${index+1}</td>

<td>${player.playerName || "-"}</td>

<td>${player.soldTo || player.teamName || "-"}</td>

<td>${player.runs || 0}</td>

<td>${player.balls || 0}</td>

<td>${player.strikeRate || 0}</td>

<td>${player.fours || 0}</td>

<td>${player.sixes || 0}</td>

</tr>

`;

});

}

// ======================================
// Auto Refresh
// ======================================

setInterval(async()=>{

await loadPlayers();

},10000);

// ======================================
// Refresh when page becomes active
// ======================================

document.addEventListener("visibilitychange",async()=>{

if(!document.hidden){

await loadPlayers();

}

});

// ======================================
// Initialize
// ======================================

async function initializeOrangeCap(){

try{

await loadPlayers();

console.log("🟠 Orange Cap Loaded Successfully");

}catch(error){

console.error(error);

leaderCard.innerHTML="<p>Failed to load Orange Cap.</p>";

}

}

initializeOrangeCap();
