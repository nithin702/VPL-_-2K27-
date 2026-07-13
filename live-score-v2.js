// =======================================
// VPL 2K27 LIVE SCORE V2
// Part 1 - Firebase + Initialization
// =======================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

doc,

updateDoc,

query,

where

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =======================================
// Firebase Config
// =======================================

const firebaseConfig={

apiKey:"AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

authDomain:"vpl-2k27.firebaseapp.com",

projectId:"vpl-2k27",

storageBucket:"vpl-2k27.firebasestorage.app",

messagingSenderId:"919265368604",

appId:"1:919265368604:web:41587c7dd08f4c5d991dd9",

measurementId:"G-YL6CQ36HV6"

};

const app=initializeApp(firebaseConfig);

const db=getFirestore(app);

// =======================================
// HTML Elements
// =======================================

const matchSelect=document.getElementById("matchSelect");
const tossWinner=document.getElementById("tossWinner");
const tossDecision=document.getElementById("tossDecision");
const startMatchBtn=document.getElementById("startMatchBtn");

const liveScore=document.getElementById("liveScore");
const overs=document.getElementById("overs");

const battingTeam=document.getElementById("battingTeam");

const strikerName=document.getElementById("strikerName");
const nonStrikerName=document.getElementById("nonStrikerName");
const bowlerName=document.getElementById("bowlerName");

const strikerRuns=document.getElementById("strikerRuns");
const nonStrikerRuns=document.getElementById("nonStrikerRuns");

const bowlerFigures=document.getElementById("bowlerFigures");

const commentaryBox=document.getElementById("commentaryBox");

const ballHistory=document.getElementById("ballHistory");

// =======================================
// Match Variables
// =======================================

let matches=[];

let players=[];

let selectedMatch=null;

let battingPlayers=[];

let bowlingPlayers=[];

let striker=null;

let nonStriker=null;

let bowler=null;

let totalRuns=0;

let totalWickets=0;

let totalBalls=0;

let innings=1;

let target=0;

let lastOver=[];

let ballHistoryArray=[];

// =======================================
// Load Matches
// =======================================

async function loadMatches(){

matchSelect.innerHTML='<option value="">Select Match</option>';

matches=[];

const snapshot=await getDocs(collection(db,"matches"));

snapshot.forEach((d)=>{

const match=d.data();

match.id=d.id;

matches.push(match);

matchSelect.innerHTML+=`

<option value="${match.id}">

${match.matchNumber} |

${match.team1}

vs

${match.team2}

</option>

`;

});

}

loadMatches();
// =======================================
// MATCH SELECTION
// =======================================

matchSelect.addEventListener("change", async ()=>{

const id=matchSelect.value;

if(id==="") return;

selectedMatch=matches.find(m=>m.id===id);

tossWinner.innerHTML=`

<option value="${selectedMatch.team1}">

${selectedMatch.team1}

</option>

<option value="${selectedMatch.team2}">

${selectedMatch.team2}

</option>

`;

});

// =======================================
// LOAD TEAM PLAYERS
// =======================================

async function loadPlayers(teamName){

const list=[];

const q=query(

collection(db,"registrations"),

where("soldTo","==",teamName)

);

const snapshot=await getDocs(q);

snapshot.forEach((docSnap)=>{

const p=docSnap.data();

p.id=docSnap.id;

p.runs=0;

p.balls=0;

p.fours=0;

p.sixes=0;

p.wickets=0;

p.overs=0;

p.runsGiven=0;

list.push(p);

});

return list;

}

// =======================================
// START MATCH
// =======================================

startMatchBtn.addEventListener("click",async()=>{

if(!selectedMatch){

alert("Select Match");

return;

}

const toss=tossWinner.value;

const decision=tossDecision.value;

let battingTeamName;

let bowlingTeamName;

if(decision==="bat"){

battingTeamName=toss;

bowlingTeamName=

toss===selectedMatch.team1

?

selectedMatch.team2

:

selectedMatch.team1;

}else{

bowlingTeamName=toss;

battingTeamName=

toss===selectedMatch.team1

?

selectedMatch.team2

:

selectedMatch.team1;

}

battingPlayers=

await loadPlayers(battingTeamName);

bowlingPlayers=

await loadPlayers(bowlingTeamName);

if(battingPlayers.length<2){

alert("Not enough batting players.");

return;

}

if(bowlingPlayers.length<1){

alert("No bowling players.");

return;

}

striker=battingPlayers[0];

nonStriker=battingPlayers[1];

bowler=bowlingPlayers[0];

battingTeam.innerHTML=battingTeamName;

strikerName.innerHTML=striker.playerName;

nonStrikerName.innerHTML=

nonStriker.playerName;

bowlerName.innerHTML=

bowler.playerName;

commentaryBox.innerHTML=`

<div class="comment">

🏏 Match Started

</div>

`;

updateScoreBoard();

});
// =======================================
// UPDATE SCOREBOARD
// =======================================

function updateScoreBoard(){

liveScore.innerHTML=`${totalRuns}/${totalWickets}`;

overs.innerHTML=

`Overs : ${Math.floor(totalBalls/6)}.${totalBalls%6}`;

strikerRuns.innerHTML=

`${striker.runs} (${striker.balls})`;

nonStrikerRuns.innerHTML=

`${nonStriker.runs} (${nonStriker.balls})`;

bowlerFigures.innerHTML=

`${bowler.wickets}-${bowler.runsGiven}

(${Math.floor(bowler.overs/6)}.${bowler.overs%6})`;

}

// =======================================
// COMMENTARY
// =======================================

function addComment(text){

commentaryBox.innerHTML=

`<div class="comment">

${text}

</div>`

+

commentaryBox.innerHTML;

}

// =======================================
// BALL HISTORY
// =======================================

function updateBallHistory(ball){

ballHistoryArray.push(ball);

if(ballHistoryArray.length>36){

ballHistoryArray.shift();

}

ballHistory.innerHTML="";

ballHistoryArray.forEach(item=>{

ballHistory.innerHTML+=

`<span class="ball">

${item}

</span>`;

});

}

// =======================================
// ADD RUNS
// =======================================

function scoreRuns(run){

totalRuns+=run;

totalBalls++;

striker.runs+=run;

striker.balls++;

if(run===4) striker.fours++;

if(run===6) striker.sixes++;

bowler.runsGiven+=run;

bowler.overs++;

updateBallHistory(run);

addComment(

`${striker.playerName}

scores

${run}

run${run==1?"":"s"}`

);

if(run%2===1){

let temp=striker;

striker=nonStriker;

nonStriker=temp;

}

if(totalBalls%6===0){

let temp=striker;

striker=nonStriker;

nonStriker=temp;

lastOver=[];

}

updateScoreBoard();

}

// =======================================
// BUTTON EVENTS
// =======================================

document.getElementById("btn0").onclick=

()=>scoreRuns(0);

document.getElementById("btn1").onclick=

()=>scoreRuns(1);

document.getElementById("btn2").onclick=

()=>scoreRuns(2);

document.getElementById("btn3").onclick=

()=>scoreRuns(3);

document.getElementById("btn4").onclick=

()=>scoreRuns(4);

document.getElementById("btn6").onclick=

()=>scoreRuns(6);
// =======================================
// EXTRAS
// =======================================

function addWide(){

totalRuns++;

bowler.runsGiven++;

updateBallHistory("WD");

addComment("🌐 Wide Ball");

updateScoreBoard();

}

function addNoBall(){

totalRuns++;

bowler.runsGiven++;

updateBallHistory("NB");

addComment("🚫 No Ball");

updateScoreBoard();

}

function addBye(){

totalRuns++;

totalBalls++;

striker.balls++;

bowler.overs++;

updateBallHistory("B");

addComment("🏃 Bye - 1 Run");

if(totalBalls%6===0){

let temp=striker;
striker=nonStriker;
nonStriker=temp;

}else{

let temp=striker;
striker=nonStriker;
nonStriker=temp;

}

updateScoreBoard();

}

function addLegBye(){

totalRuns++;

totalBalls++;

striker.balls++;

bowler.overs++;

updateBallHistory("LB");

addComment("🦵 Leg Bye - 1 Run");

if(totalBalls%6===0){

let temp=striker;
striker=nonStriker;
nonStriker=temp;

}else{

let temp=striker;
striker=nonStriker;
nonStriker=temp;

}

updateScoreBoard();

}

// =======================================
// WICKET
// =======================================

function addWicket(){

totalWickets++;

totalBalls++;

striker.balls++;

bowler.wickets++;

bowler.overs++;

updateBallHistory("W");

addComment(

`❌ WICKET!

${striker.playerName} OUT`

);

updateScoreBoard();

alert(

"Select New Batsman (Part 5 lo complete chestham)"

);

}

// =======================================
// BUTTON EVENTS
// =======================================

document.getElementById("btnWide").onclick=addWide;

document.getElementById("btnNoBall").onclick=addNoBall;

document.getElementById("btnBye").onclick=addBye;

document.getElementById("btnLegBye").onclick=addLegBye;

document.getElementById("btnWicket").onclick=addWicket;

// =======================================
// UNDO (Temporary)
// =======================================

document.getElementById("btnUndo").onclick=()=>{

alert("Undo feature will be completed in Part 5.");

};

// =======================================
// FIREBASE LIVE UPDATE
// =======================================

async function updateLiveMatch(){

if(!selectedMatch) return;

try{

await updateDoc(

doc(db,"matches",selectedMatch.id),

{

liveRuns:totalRuns,

liveWickets:totalWickets,

liveOvers:

`${Math.floor(totalBalls/6)}.${totalBalls%6}`,

status:"Live",

lastUpdated:new Date()

}

);

}catch(error){

console.error(error);

}

}

setInterval(updateLiveMatch,3000);
// =======================================
// NEW BATSMAN
// =======================================

document.getElementById("newBatsmanBtn").onclick=()=>{

const available=battingPlayers.filter(

p=>p.id!==striker.id &&

p.id!==nonStriker.id

);

if(available.length===0){

alert("No batsman available.");

return;

}

const name=prompt(

"Enter New Batsman Name\n\n"+

available.map(p=>p.playerName).join("\n")

);

const player=available.find(

p=>p.playerName.toLowerCase()==

name?.toLowerCase()

);

if(!player){

alert("Player not found.");

return;

}

striker=player;

strikerName.innerHTML=striker.playerName;

strikerRuns.innerHTML="0 (0)";

addComment("🏏 New Batsman : "+player.playerName);

updateScoreBoard();

};

// =======================================
// CHANGE BOWLER
// =======================================

document.getElementById("changeBowlerBtn").onclick=()=>{

const available=bowlingPlayers.filter(

p=>p.id!==bowler.id

);

const name=prompt(

"Enter Bowler Name\n\n"+

available.map(p=>p.playerName).join("\n")

);

const player=available.find(

p=>p.playerName.toLowerCase()==

name?.toLowerCase()

);

if(!player){

alert("Bowler not found.");

return;

}

bowler=player;

bowlerName.innerHTML=player.playerName;

addComment("🎯 New Bowler : "+player.playerName);

updateScoreBoard();

};

// =======================================
// FINISH INNINGS
// =======================================

document.getElementById("finishInningsBtn").onclick=()=>{

target=totalRuns+1;

innings=2;

document.getElementById("target").innerHTML=target;

addComment(

"🏁 Innings Finished. Target : "+target

);

alert("Second Innings Started.");

};

// =======================================
// END MATCH
// =======================================

document.getElementById("endMatchBtn").onclick=

async()=>{

if(!selectedMatch) return;

await updateDoc(

doc(db,"matches",selectedMatch.id),

{

status:"Completed",

liveRuns:totalRuns,

liveWickets:totalWickets,

liveOvers:

`${Math.floor(totalBalls/6)}.${totalBalls%6}`,

target:target,

completed:true,

lastUpdated:new Date()

}

);

addComment("🏆 Match Finished");

alert("Match Completed Successfully!");

};

// =======================================
// UNDO (Basic)
// =======================================

document.getElementById("btnUndo").onclick=()=>{

alert("Advanced Undo will be added in Version 2.");

};

// =======================================
// AUTO SAVE
// =======================================

setInterval(()=>{

updateLiveMatch();

},5000);

console.log("🏏 VPL Live Score V2 Loaded Successfully");
