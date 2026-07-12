
// =====================================
// Firebase Imports
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

query,

where

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

const teamSelect=document.getElementById("teamSelect");

const teamLogo=document.getElementById("teamLogo");

const teamName=document.getElementById("teamName");

const captainName=document.getElementById("captainName");

const coachName=document.getElementById("coachName");

const homeGround=document.getElementById("homeGround");

const matchesPlayed=document.getElementById("matchesPlayed");

const matchesWon=document.getElementById("matchesWon");

const teamPoints=document.getElementById("teamPoints");

const netRunRate=document.getElementById("netRunRate");

const playersList=document.getElementById("playersList");

const teamAchievements=document.getElementById("teamAchievements");

// =====================================
// Variables
// =====================================

let allTeams=[];

let selectedTeam=null;

// =====================================
// Load Teams
// =====================================

async function loadTeams(){

try{

const snapshot=await getDocs(collection(db,"teams"));

teamSelect.innerHTML=`
<option value="">Select Team
// =====================================
// Team Selection
// =====================================

teamSelect.addEventListener("change", async ()=>{

const teamId=teamSelect.value;

if(teamId===""){

playersList.innerHTML="<p>Select a Team</p>";

return;

}

selectedTeam=allTeams.find(team=>team.id===teamId);

showTeamDetails();

await loadSquad(selectedTeam.teamName);

});

// =====================================
// Show Team Details
// =====================================

function showTeamDetails(){

teamLogo.src=selectedTeam.logo || "images/default-team.png";

teamName.innerHTML=selectedTeam.teamName || "-";

captainName.innerHTML=
`👑 Captain : ${selectedTeam.captain || "-"}`;

coachName.innerHTML=
`🧑‍🏫 Coach : ${selectedTeam.coach || "-"}`;

homeGround.innerHTML=
`🏟️ Ground : ${selectedTeam.ground || "VPL Ground"}`;

matchesPlayed.innerHTML=
selectedTeam.matchesPlayed || 0;

matchesWon.innerHTML=
selectedTeam.matchesWon || 0;

teamPoints.innerHTML=
selectedTeam.points || 0;

netRunRate.innerHTML=
selectedTeam.netRunRate || "0.00";

}

// =====================================
// Load Team Squad
// =====================================

async function loadSquad(team){

try{

playersList.innerHTML="Loading Squad...";

const q=query(

collection(db,"registrations"),

where("soldTo","==",team)

);

const snapshot=await getDocs(q);

playersList.innerHTML="";

if(snapshot.empty){

playersList.innerHTML=
"<p>No Players Found.</p>";

return;

}

snapshot.forEach(doc=>{

const player=doc.data();

playersList.innerHTML+=`

<div class="player-card">

<img
src="${player.photoUrl || 'images/default-player.png'}"
alt="Player">

<h3>${player.playerName}</h3>

<p>

🏏 ${player.playerRole || "-"}

</p>

<p>

Batting : ${player.battingStyle || "-"}

</p>

<p>

Bowling : ${player.bowlingStyle || "-"}

</p>

${player.playerName===selectedTeam.captain?

'<span class="captain-badge">👑 Captain</span>'

:''}

</div>

`;

});

}catch(error){

console.error("Load Squad Error :",error);

playersList.innerHTML=
"<p>Unable to load squad.</p>";

}

}
// =====================================
// Load Team Achievements
// =====================================

function loadAchievements(){

if(!selectedTeam){

teamAchievements.innerHTML="<p>No Team Selected</p>";

return;

}

teamAchievements.innerHTML=`

<p>🏆 Championships : ${selectedTeam.championships || 0}</p>

<p>🥈 Runner Ups : ${selectedTeam.runnerUps || 0}</p>

<p>🎖 Fair Play Awards : ${selectedTeam.fairPlay || 0}</p>

<p>🔥 Winning Streak : ${selectedTeam.winningStreak || 0}</p>

`;

}

// =====================================
// Auto Refresh
// =====================================

setInterval(async()=>{

await loadTeams();

if(selectedTeam){

const team=allTeams.find(t=>t.id===selectedTeam.id);

if(team){

selectedTeam=team;

showTeamDetails();

loadAchievements();

await loadSquad(selectedTeam.teamName);

}

}

},10000);

// =====================================
// Initialize Page
// =====================================

async function initializeTeamProfile(){

try{

await loadTeams();

teamAchievements.innerHTML=`

<p>

🏆 Select a Team to View Details

</p>

`;

console.log("🏏 Team Profile Loaded Successfully");

}catch(error){

console.error(error);

}

}

initializeTeamProfile();
