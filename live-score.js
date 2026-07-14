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

// ================= FIREBASE =================

const firebaseConfig = {
apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",
authDomain: "vpl-2k27.firebaseapp.com",
projectId: "vpl-2k27",
storageBucket: "vpl-2k27.firebasestorage.app",
messagingSenderId: "919265368604",
appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",
measurementId: "G-YL6CQ36HV6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= ELEMENTS =================

const matchSelect=document.getElementById("matchSelect");
const tossWinner=document.getElementById("tossWinner");
const tossDecision=document.getElementById("tossDecision");
const startMatchBtn=document.getElementById("startMatchBtn");

const battingTeam=document.getElementById("battingTeam");
const inningsText=document.getElementById("inningsText");

const liveScore=document.getElementById("liveScore");
const overs=document.getElementById("overs");

const backBtn=document.getElementById("backBtn");

// ================= VARIABLES =================

let allMatches=[];
let currentMatch=null;

let firstBattingTeam="";
let firstBowlingTeam="";

let totalRuns=0;
let wickets=0;
let balls=0;

// ================= BACK =================

backBtn.onclick=()=>{

window.location.href="admin.html";

};

// ================= LOAD MATCHES =================

async function loadMatches(){

matchSelect.innerHTML=
`<option value="">Select Match</option>`;

tossWinner.innerHTML=
`<option value="">Select Team</option>`;

allMatches=[];

try{

const snapshot=await getDocs(collection(db,"matches"));
    console.log("Totale docs:",snapshot.size);

snapshot.forEach(docSnap=>{
    console.log(docSnap.id,docSnap.data());

const match=docSnap.data();

match.id=docSnap.id;

allMatches.push(match);

matchSelect.innerHTML+=`
<option value="${match.id}">
${match.matchNumber} | ${match.team1} 🆚 ${match.team2}
</option>`;

});

console.log("Matches :",allMatches.length);

}catch(err){

console.error(err);

alert("Unable to load matches.");

}

}

// ================= MATCH CHANGE =================

matchSelect.addEventListener("change",()=>{

const id=matchSelect.value;

if(id==="") return;

currentMatch=allMatches.find(m=>m.id===id);

tossWinner.innerHTML=`

<option value="">Select Team</option>

<option value="${currentMatch.team1}">
${currentMatch.team1}
</option>

<option value="${currentMatch.team2}">
${currentMatch.team2}
</option>

`;

});

// ================= START MATCH =================

startMatchBtn.addEventListener("click",()=>{

if(!currentMatch){

alert("Select Match");

return;

}

if(tossWinner.value===""){

alert("Select Toss Winner");

return;

}

const tossWin=tossWinner.value;

const decision=tossDecision.value;

if(decision==="bat"){

firstBattingTeam=tossWin;

firstBowlingTeam=
tossWin===currentMatch.team1
?currentMatch.team2
:currentMatch.team1;

}else{

firstBowlingTeam=tossWin;

firstBattingTeam=
tossWin===currentMatch.team1
?currentMatch.team2
:currentMatch.team1;

}

battingTeam.innerText=firstBattingTeam;

inningsText.innerText="1st Innings";

liveScore.innerText="0 / 0";

overs.innerText="Overs : 0.0 / 15";

alert("Match Started");

});
// ================= PLAYERS =================

let allPlayers = [];

let strikerPlayer = null;
let nonStrikerPlayer = null;
let bowlerPlayer = null;

const playerModal = document.getElementById("playerModal");

const strikerSelect = document.getElementById("strikerSelect");
const nonStrikerSelect = document.getElementById("nonStrikerSelect");
const bowlerSelect = document.getElementById("bowlerSelect");

const confirmPlayersBtn = document.getElementById("confirmPlayersBtn");
const cancelPlayersBtn = document.getElementById("cancelPlayersBtn");

// ================= LOAD PLAYERS =================

async function loadPlayers() {

    allPlayers = [];

    strikerSelect.innerHTML =
    `<option value="">Select Striker</option>`;

    nonStrikerSelect.innerHTML =
    `<option value="">Select Non-Striker</option>`;

    bowlerSelect.innerHTML =
    `<option value="">Select Bowler</option>`;

    // ---------- Batting Team ----------

    const battingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", firstBattingTeam)
    );

    const battingSnapshot = await getDocs(battingQuery);

    battingSnapshot.forEach(docSnap => {

        const player = docSnap.data();

        player.id = docSnap.id;

        allPlayers.push(player);

        strikerSelect.innerHTML += `
        <option value="${player.id}">
        ${player.playerName}
        </option>`;

        nonStrikerSelect.innerHTML += `
        <option value="${player.id}">
        ${player.playerName}
        </option>`;

    });

    // ---------- Bowling Team ----------

    const bowlingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", firstBowlingTeam)
    );

    const bowlingSnapshot = await getDocs(bowlingQuery);

    bowlingSnapshot.forEach(docSnap => {

        const player = docSnap.data();

        player.id = docSnap.id;

        allPlayers.push(player);

        bowlerSelect.innerHTML += `
        <option value="${player.id}">
        ${player.playerName}
        </option>`;

    });

    playerModal.style.display = "flex";

}

// ================= START MATCH UPDATE =================

// Part 1 lo unna
// startMatchBtn.addEventListener(...)
// function lo

// alert("Match Started");

// line REMOVE chesi

await loadPlayers();

// line matrame add cheyyi.

// ================= CONFIRM PLAYERS =================

confirmPlayersBtn.onclick = () => {

    if (
        strikerSelect.value === "" ||
        nonStrikerSelect.value === "" ||
        bowlerSelect.value === ""
    ) {

        alert("Select all players");

        return;

    }

    if (strikerSelect.value === nonStrikerSelect.value) {

        alert("Striker & Non-Striker cannot be same");

        return;

    }

    strikerPlayer =
    allPlayers.find(p => p.id === strikerSelect.value);

    nonStrikerPlayer =
    allPlayers.find(p => p.id === nonStrikerSelect.value);

    bowlerPlayer =
    allPlayers.find(p => p.id === bowlerSelect.value);

    playerModal.style.display = "none";

    document.getElementById("strikerName").innerText =
    strikerPlayer.playerName;

    document.getElementById("nonStrikerName").innerText =
    nonStrikerPlayer.playerName;

    document.getElementById("bowlerName").innerText =
    bowlerPlayer.playerName;

};

cancelPlayersBtn.onclick = () => {

    playerModal.style.display = "none";

};
// ================= SCORE BUTTONS =================

const btn0=document.getElementById("btn0");
const btn1=document.getElementById("btn1");
const btn2=document.getElementById("btn2");
const btn3=document.getElementById("btn3");
const btn4=document.getElementById("btn4");
const btn6=document.getElementById("btn6");

const btnWide=document.getElementById("btnWide");
const btnNoBall=document.getElementById("btnNoBall");
const btnBye=document.getElementById("btnBye");
const btnLegBye=document.getElementById("btnLegBye");

const ballHistory=document.getElementById("ballHistory");
const commentaryBox=document.getElementById("commentaryBox");

let history=[];

// ================= REFRESH SCORE =================

function refreshScore(){

liveScore.innerText=`${totalRuns} / ${wickets}`;

overs.innerText=
`Overs : ${Math.floor(balls/6)}.${balls%6} / 15`;

}

// ================= COMMENTARY =================

function addComment(text){

commentaryBox.innerHTML=
`<p>${text}</p>`+
commentaryBox.innerHTML;

}

// ================= BALL HISTORY =================

function addHistory(text){

history.push(text);

if(history.length>6){

history.shift();

}

ballHistory.innerHTML=history.join(" ");

}

// ================= NORMAL RUN =================

function addRuns(run){

totalRuns+=run;

balls++;

refreshScore();

addHistory(run);

addComment(`${strikerPlayer.playerName} scored ${run} run(s).`);

if(run===1||run===3){

let temp=strikerPlayer;
strikerPlayer=nonStrikerPlayer;
nonStrikerPlayer=temp;

document.getElementById("strikerName").innerText=
strikerPlayer.playerName;

document.getElementById("nonStrikerName").innerText=
nonStrikerPlayer.playerName;

}

}

// ================= BUTTON EVENTS =================

btn0.onclick=()=>addRuns(0);

btn1.onclick=()=>addRuns(1);

btn2.onclick=()=>addRuns(2);

btn3.onclick=()=>addRuns(3);

btn4.onclick=()=>addRuns(4);

btn6.onclick=()=>addRuns(6);

// ================= EXTRAS =================

btnWide.onclick=()=>{

totalRuns++;

refreshScore();

addHistory("Wd");

addComment("Wide Ball");

};

btnNoBall.onclick=()=>{

totalRuns++;

refreshScore();

addHistory("Nb");

addComment("No Ball");

};

btnBye.onclick=()=>{

totalRuns++;

balls++;

refreshScore();

addHistory("B");

addComment("Bye");

};

btnLegBye.onclick=()=>{

totalRuns++;

balls++;

refreshScore();

addHistory("Lb");

addComment("Leg Bye");

};
// ================= WICKET =================

const btnWicket=document.getElementById("btnWicket");

btnWicket.onclick=()=>{

wickets++;

balls++;

refreshScore();

addHistory("W");

addComment(
`❌ ${strikerPlayer.playerName} OUT`
);

document.getElementById("strikerScore").innerText="OUT";

alert("Select New Batsman");

};

// ================= PLAYER STATS =================

let strikerRuns=0;
let strikerBalls=0;

let nonStrikerRuns=0;
let nonStrikerBalls=0;

// ================= UPDATE BATSMAN =================

function updateBatsman(run){

if(strikerPlayer==null) return;

strikerRuns+=run;
strikerBalls++;

document.getElementById("strikerScore").innerText=
`${strikerRuns} (${strikerBalls})`;

}

// ================= MODIFY addRuns() =================

// addRuns() function lo

// refreshScore();

// line mundu

updateBatsman(run);

// add cheyyi.

// ================= CHANGE BOWLER =================

const changeBowlerBtn=
document.getElementById("changeBowlerBtn");

changeBowlerBtn.onclick=()=>{

playerModal.style.display="flex";

bowlerSelect.value="";

alert("Select New Bowler");

};

// ================= OVER COMPLETE =================

function checkOver(){

if(balls>0 && balls%6===0){

let temp=strikerPlayer;

strikerPlayer=nonStrikerPlayer;

nonStrikerPlayer=temp;

document.getElementById("strikerName").innerText=
strikerPlayer.playerName;

document.getElementById("nonStrikerName").innerText=
nonStrikerPlayer.playerName;

alert("🏏 Over Completed");

}

}

// ================= MODIFY refreshScore() =================

// refreshScore() function last lo

checkOver();

// add cheyyi.

// ================= PARTNERSHIP =================

let partnershipRuns=0;
let partnershipBalls=0;

function updatePartnership(run){

partnershipRuns+=run;
partnershipBalls++;

document.getElementById("partnership").innerText=

`${partnershipRuns} Runs (${partnershipBalls} Balls)`;

}

// ================= MODIFY addRuns() =================

// updateBatsman(run);

// line kinda

updatePartnership(run);

// add cheyyi.

// ================= CURRENT RUN RATE =================

function updateCRR(){

const overValue=balls/6;

const crr=
overValue===0
?0
:(totalRuns/overValue).toFixed(2);

document.getElementById("crr").innerText=crr;

}

// ================= MODIFY refreshScore() =================

// checkOver();

// line kinda

updateCRR();

// add cheyyi.
// ================= FINISH INNINGS =================

const finishInningsBtn =
document.getElementById("finishInningsBtn");

const startSecondInningsBtn =
document.getElementById("startSecondInningsBtn");

const endMatchBtn =
document.getElementById("endMatchBtn");

let innings = 1;
let target = 0;

// ================= FINISH INNINGS =================

finishInningsBtn.onclick = () => {

if(innings===1){

target=totalRuns+1;

document.getElementById("target").innerText=target;

document.getElementById("inningsResult").style.display="block";

document.getElementById("inningsScore").innerText=
`${totalRuns}/${wickets} (${Math.floor(balls/6)}.${balls%6})`;

document.getElementById("inningsMessage").innerText=
`${firstBowlingTeam} need ${target} runs to win`;

alert("1st Innings Finished");

}else{

endMatch();

}

};

// ================= START SECOND INNINGS =================

startSecondInningsBtn.onclick=()=>{

innings=2;

totalRuns=0;
wickets=0;
balls=0;

history=[];

refreshScore();

ballHistory.innerHTML="";

document.getElementById("lastOver").innerText="-";

document.getElementById("needRuns").innerText=target;

battingTeam.innerText=firstBowlingTeam;

inningsText.innerText="2nd Innings";

playerModal.style.display="flex";

};

// ================= REQUIRED RUN RATE =================

function updateRRR(){

if(innings!==2) return;

const ballsLeft=90-balls;

const runsLeft=target-totalRuns;

document.getElementById("needRuns").innerText=
runsLeft<=0?0:runsLeft;

if(ballsLeft<=0){

document.getElementById("rrr").innerText="0.00";

return;

}

const oversLeft=ballsLeft/6;

const rrr=(runsLeft/oversLeft).toFixed(2);

document.getElementById("rrr").innerText=
rrr;

}

// refreshScore() function LAST lo add cheyyi

updateRRR();

// ================= END MATCH =================

function endMatch(){

document.getElementById("matchResult").style.display="block";

let winner="";

if(totalRuns>=target){

winner=firstBowlingTeam;

document.getElementById("winnerText").innerText=
`${winner} WON 🎉`;

document.getElementById("resultDescription").innerText=
`${winner} chased ${target}`;

}else{

winner=firstBattingTeam;

document.getElementById("winnerText").innerText=
`${winner} WON 🎉`;

document.getElementById("resultDescription").innerText=
`${winner} defended ${target-1}`;

}

}

// ================= END MATCH BUTTON =================

endMatchBtn.onclick=()=>{

endMatch();

};

// ================= FIREBASE SAVE =================

async function saveMatch(){

if(!currentMatch) return;

await updateDoc(

doc(db,"matches",currentMatch.id),

{

liveRuns:totalRuns,

liveWickets:wickets,

liveOvers:`${Math.floor(balls/6)}.${balls%6}`,

status:"Completed",

winner:document.getElementById("winnerText").innerText,

updatedAt:new Date().toISOString()

}

);

}

// endMatch() function LAST lo add cheyyi

saveMatch();
// ================= FIREBASE LIVE SAVE =================

async function saveLiveScore() {

    if (!currentMatch) return;

    try {

        await updateDoc(doc(db, "matches", currentMatch.id), {

            liveRuns: totalRuns,
            liveWickets: wickets,
            liveOvers: `${Math.floor(balls / 6)}.${balls % 6}`,

            battingTeam: battingTeam.innerText,
            bowlingTeam:
                innings === 1 ? firstBowlingTeam : firstBattingTeam,

            striker: strikerPlayer ? strikerPlayer.playerName : "",
            nonStriker: nonStrikerPlayer ? nonStrikerPlayer.playerName : "",
            bowler: bowlerPlayer ? bowlerPlayer.playerName : "",

            commentary: commentaryBox.innerHTML,
            ballHistory: history,

            lastUpdated: new Date().toISOString()

        });

    } catch (err) {

        console.error(err);

    }

}

// ================= AUTO SAVE =================

setInterval(() => {

    saveLiveScore();

}, 3000);

// ================= PLAYER SCORE =================

function updatePlayerCard() {

    document.getElementById("strikerScore").innerText =
        `${strikerRuns} (${strikerBalls})`;

    document.getElementById("nonStrikerScore").innerText =
        `${nonStrikerRuns} (${nonStrikerBalls})`;

}

// ================= BOUNDARIES =================

let strikerFours = 0;
let strikerSixes = 0;

function updateBoundary(run) {

    if (run === 4) {

        strikerFours++;

        document.getElementById("strikerFours").innerText =
            strikerFours;

    }

    if (run === 6) {

        strikerSixes++;

        document.getElementById("strikerSixes").innerText =
            strikerSixes;

    }

}

// ================= MODIFY addRuns() =================

// updateBatsman(run);

// తర్వాత add చేయి

updateBoundary(run);

updatePlayerCard();

// ================= MATCH SUMMARY =================

function updateSummary() {

    document.getElementById("summaryRuns").innerText =
        totalRuns;

    document.getElementById("summaryWickets").innerText =
        wickets;

    document.getElementById("summaryOvers").innerText =
        `${Math.floor(balls/6)}.${balls%6}`;

    document.getElementById("summaryRunRate").innerText =
        document.getElementById("crr").innerText;

}

// refreshScore() చివర add చేయి

updateSummary();
// ================= UNDO SYSTEM =================

const btnUndo = document.getElementById("btnUndo");

let undoStack = [];

function saveState(){

undoStack.push({

runs: totalRuns,
wickets: wickets,
balls: balls,

strikerRuns,
strikerBalls,

nonStrikerRuns,
nonStrikerBalls,

partnershipRuns,
partnershipBalls,

history: [...history]

});

}

btnUndo.onclick=()=>{

if(undoStack.length===0){

alert("Nothing to Undo");

return;

}

const last=undoStack.pop();

totalRuns=last.runs;
wickets=last.wickets;
balls=last.balls;

strikerRuns=last.strikerRuns;
strikerBalls=last.strikerBalls;

nonStrikerRuns=last.nonStrikerRuns;
nonStrikerBalls=last.nonStrikerBalls;

partnershipRuns=last.partnershipRuns;
partnershipBalls=last.partnershipBalls;

history=[...last.history];

ballHistory.innerHTML=history.join(" ");

refreshScore();

updatePlayerCard();

};

// ================= MODIFY addRuns() =================

// addRuns() function FIRST line lo

saveState();

// add cheyyi.

// ================= MODIFY WICKET =================

// btnWicket.onclick function FIRST line lo

saveState();

// add cheyyi.

// ================= NEW BATSMAN =================

const newBatsmanBtn =
document.getElementById("newBatsmanBtn");

newBatsmanBtn.onclick=()=>{

playerModal.style.display="flex";

strikerSelect.value="";

bowlerSelect.value=bowlerPlayer.id;

};

// ================= RETIRED HURT =================

const retiredBtn=
document.getElementById("retiredBtn");

retiredBtn.onclick=()=>{

addComment(
`${strikerPlayer.playerName} retired hurt`
);

playerModal.style.display="flex";

strikerSelect.value="";

};

// ================= CHANGE BOWLER =================

changeBowlerBtn.onclick=()=>{

playerModal.style.display="flex";

bowlerSelect.value="";

};

// ================= CONFIRM PLAYER UPDATE =================

// confirmPlayersBtn.onclick function END lo

if(strikerSelect.value!==""){

strikerPlayer=
allPlayers.find(
p=>p.id===strikerSelect.value
);

document.getElementById("strikerName").innerText=
strikerPlayer.playerName;

}

if(bowlerSelect.value!==""){

bowlerPlayer=
allPlayers.find(
p=>p.id===bowlerSelect.value
);

document.getElementById("bowlerName").innerText=
bowlerPlayer.playerName;

}

// ================= LAST OVER =================

let overBalls=[];

function updateLastOver(ball){

overBalls.push(ball);

if(overBalls.length>6){

overBalls.shift();

}

document.getElementById("lastOver").innerText=
overBalls.join(" ");

}

// ================= MODIFY addHistory() =================

// addHistory(text);

// line kinda

updateLastOver(text);

// add cheyyi.

// ================= BOWLER FIGURES =================

let bowlerRuns=0;
let bowlerWickets=0;

function updateBowler(run,isWicket=false){

bowlerRuns+=run;

if(isWicket){

bowlerWickets++;

}

document.getElementById("bowlerFigures").innerText=

`${bowlerRuns} - ${bowlerWickets} (${Math.floor(balls/6)}.${balls%6})`;

const eco=
balls===0
?0
:(bowlerRuns/(balls/6)).toFixed(2);

document.getElementById("bowlerEco").innerText=
eco;

}

// ================= MODIFY addRuns() =================

// updateBoundary(run);

// line kinda

updateBowler(run,false);

// ================= MODIFY WICKET =================

// wickets++;

// line kinda

updateBowler(0,true);
// ================= AUTO WINNER CHECK =================

function checkWinner(){

if(innings!==2) return;

if(totalRuns>=target){

endMatch();

return;

}

if(balls>=90){

endMatch();

return;

}

if(wickets>=10){

endMatch();

return;

}

}

// refreshScore() function END lo add cheyyi

checkWinner();

// ================= MATCH RESUME =================

async function loadLiveMatch(){

if(!currentMatch) return;

const snapshot=await getDocs(collection(db,"matches"));

snapshot.forEach(docSnap=>{

if(docSnap.id===currentMatch.id){

const data=docSnap.data();

if(data.liveRuns!=null){

totalRuns=data.liveRuns||0;
wickets=data.liveWickets||0;

}

}

});

refreshScore();

}

// ================= PLAYER FIREBASE UPDATE =================

async function savePlayerStats(player){

if(!player) return;

await updateDoc(

doc(db,"registrations",player.id),

{

matchRuns:strikerRuns,
matchBalls:strikerBalls,
matchFours:strikerFours,
matchSixes:strikerSixes

}

);

}

// ================= SAVE ALL PLAYERS =================

async function saveAllPlayers(){

await savePlayerStats(strikerPlayer);

await savePlayerStats(nonStrikerPlayer);

}

// endMatch() function START lo add cheyyi

saveAllPlayers();

// ================= POINTS TABLE READY =================

async function updatePointsTable(){

console.log("Points Table Update Ready");

}

// endMatch() function LAST lo add cheyyi

updatePointsTable();

// ================= SUPER OVER =================

function startSuperOver(){

innings=3;

target=0;

totalRuns=0;
wickets=0;
balls=0;

history=[];

refreshScore();

battingTeam.innerText="SUPER OVER";

inningsText.innerText="Super Over";

playerModal.style.display="flex";

}

// ================= EXPORT READY =================

function exportMatchData(){

return{

match:currentMatch,

runs:totalRuns,

wickets:wickets,

overs:`${Math.floor(balls/6)}.${balls%6}`,

target,

winner:
document.getElementById("winnerText").innerText,

commentary:
commentaryBox.innerHTML,

ballHistory:history

};

}

// ================= MATCH COMPLETE =================

console.log("✅ VPL 2K27 Live Score Engine Loaded");

// ================= MATCH TIMER =================

let matchStartTime = null;

function startMatchTimer() {

    matchStartTime = new Date();

}

function getMatchDuration() {

    if (!matchStartTime) return "00:00";

    const diff = Math.floor((new Date() - matchStartTime) / 1000);

    const min = Math.floor(diff / 60);

    const sec = diff % 60;

    return `${min}:${sec < 10 ? "0" : ""}${sec}`;

}

// ================= LIVE TIMER =================

setInterval(() => {

    const timer = document.getElementById("matchTimer");

    if (timer) {

        timer.innerText = getMatchDuration();

    }

}, 1000);

// ================= FALL OF WICKETS =================

let fallOfWickets = [];

function addFallOfWicket() {

    fallOfWickets.push(

        `${wickets}-${totalRuns}`

    );

    const fow = document.getElementById("fallOfWickets");

    if (fow) {

        fow.innerText = fallOfWickets.join(" | ");

    }

}

// btnWicket.onclick లో wickets++ తర్వాత add cheyyi

addFallOfWicket();

// ================= MATCH STATUS =================

function updateMatchStatus(text) {

    const status = document.getElementById("matchStatus");

    if (status) {

        status.innerText = text;

    }

}

// Match start

updateMatchStatus("LIVE");

// End Match

// endMatch() function lo

updateMatchStatus("COMPLETED");

// ================= AUTO SAVE EVERY BALL =================

// addRuns() LAST lo

saveLiveScore();

// btnWide.onclick LAST lo

saveLiveScore();

// btnNoBall.onclick LAST lo

saveLiveScore();

// btnBye.onclick LAST lo

saveLiveScore();

// btnLegBye.onclick LAST lo

saveLiveScore();

// btnWicket.onclick LAST lo

saveLiveScore();

// ================= VERSION =================

console.log("🏏 VPL 2K27 Live Score v2.0 Ready");
// ================= PLAYER OF THE MATCH =================

function calculatePlayerOfMatch() {

let player = strikerPlayer;

let score = (strikerRuns || 0);

score += (strikerFours || 0) * 2;
score += (strikerSixes || 0) * 3;

return {
name: player ? player.playerName : "Unknown",
score: score
};

}

// ================= ORANGE CAP =================

async function updateOrangeCap() {

console.log("Updating Orange Cap...");

// Future Firebase leaderboard update

}

// ================= PURPLE CAP =================

async function updatePurpleCap() {

console.log("Updating Purple Cap...");

// Future Firebase leaderboard update

}

// ================= TOURNAMENT STATS =================

async function updateTournamentStats() {

console.log("Updating Tournament Stats...");

// Matches
// Runs
// Wickets
// Highest Score
// Best Bowling

}

// ================= MATCH REPORT =================

function generateMatchReport(){

return{

matchNumber:currentMatch.matchNumber,

team1:currentMatch.team1,

team2:currentMatch.team2,

winner:
document.getElementById("winnerText").innerText,

score:
`${totalRuns}/${wickets}`,

overs:
`${Math.floor(balls/6)}.${balls%6}`,

target,

fallOfWickets,

commentary:
commentaryBox.innerHTML,

ballHistory:history,

playerOfMatch:
calculatePlayerOfMatch()

};

}

// ================= PRINT REPORT =================

function printMatchReport(){

const report = generateMatchReport();

console.log(report);

window.print();

}

// ================= FIREBASE FINAL SAVE =================

async function finalSave(){

if(!currentMatch) return;

await updateDoc(

doc(db,"matches",currentMatch.id),

{

status:"Completed",

winner:
document.getElementById("winnerText").innerText,

playerOfMatch:
calculatePlayerOfMatch().name,

matchReport:
generateMatchReport(),

completedAt:
new Date().toISOString()

}

);

}

// ================= MODIFY endMatch() =================

// endMatch() function LAST lo add cheyyi

finalSave();

updateOrangeCap();

updatePurpleCap();

updateTournamentStats();

// ================= VERSION =================

console.log("🏆 VPL 2K27 Live Score v2.1 Final Build Ready");
// ================= PART 11 =================
// ADVANCED MATCH FEATURES

// ================= MATCH LOG =================

let matchLog = [];

function addMatchLog(event){

matchLog.push({

time:new Date().toLocaleTimeString(),

event:event,

score:`${totalRuns}/${wickets}`,

overs:`${Math.floor(balls/6)}.${balls%6}`

});

}

// ================= MODIFY EVENTS =================

// addRuns() END lo

addMatchLog(`${run} Run(s)`);

// btnWide.onclick END lo

addMatchLog("Wide");

// btnNoBall.onclick END lo

addMatchLog("No Ball");

// btnBye.onclick END lo

addMatchLog("Bye");

// btnLegBye.onclick END lo

addMatchLog("Leg Bye");

// btnWicket.onclick END lo

addMatchLog("Wicket");

// ================= LAST WICKET =================

let lastWicket = "-";

function updateLastWicket(){

lastWicket=

`${strikerPlayer.playerName} ${totalRuns}/${wickets}`;

const box=document.getElementById("lastWicket");

if(box){

box.innerText=lastWicket;

}

}

// btnWicket.onclick lo wickets++ tarvatha

updateLastWicket();

// ================= HIGHEST PARTNERSHIP =================

let highestPartnership=0;

function checkHighestPartnership(){

if(partnershipRuns>highestPartnership){

highestPartnership=partnershipRuns;

}

}

// updatePartnership() END lo

checkHighestPartnership();

// ================= REQUIRED BALLS =================

function updateNeedBalls(){

if(innings!==2)return;

const ballsLeft=90-balls;

const need=document.getElementById("needBalls");

if(need){

need.innerText=ballsLeft;

}

}

// refreshScore() END lo

updateNeedBalls();

// ================= AUTO BACKUP =================

async function autoBackup(){

try{

localStorage.setItem(

"liveScoreBackup",

JSON.stringify({

runs:totalRuns,

wickets,

balls,

history,

target,

innings

})

);

}catch(e){

console.log(e);

}

}

setInterval(autoBackup,5000);

// ================= RESTORE =================

function restoreBackup(){

const data=

localStorage.getItem("liveScoreBackup");

if(!data)return;

const backup=JSON.parse(data);

totalRuns=backup.runs||0;

wickets=backup.wickets||0;

balls=backup.balls||0;

history=backup.history||[];

target=backup.target||0;

innings=backup.innings||1;

refreshScore();

}

restoreBackup();

console.log("✅ Part 11 Loaded");
// ================= PART 12 =================
// ADVANCED TOURNAMENT FEATURES

// ================= AUTO MAN OF THE MATCH =================

function autoManOfTheMatch(){

let motm={
name:strikerPlayer ? strikerPlayer.playerName : "-",
runs:strikerRuns,
balls:strikerBalls,
fours:strikerFours,
sixes:strikerSixes
};

document.getElementById("winnerText").innerHTML+=
`<br><br>⭐ Player of the Match : ${motm.name}`;

}

// ================= MATCH ID =================

function generateMatchID(){

return "VPL-"+Date.now();

}

const liveMatchID=generateMatchID();

// ================= SHARE SCORE =================

function shareScore(){

const text=

`${battingTeam.innerText}

${totalRuns}/${wickets}

Overs ${Math.floor(balls/6)}.${balls%6}`;

if(navigator.share){

navigator.share({

title:"VPL 2K27 Live Score",

text:text

});

}

}

// ================= LIVE STATUS =================

function updateLiveStatus(){

const live=document.getElementById("matchStatus");

if(!live)return;

if(innings===1){

live.innerText="🟢 LIVE • 1st Innings";

}else{

live.innerText="🟢 LIVE • 2nd Innings";

}

}

// refreshScore() END lo

updateLiveStatus();

// ================= REQUIRED MESSAGE =================

function updateNeedMessage(){

if(innings!==2)return;

const need=target-totalRuns;

const ballsLeft=90-balls;

const msg=document.getElementById("resultDescription");

if(msg){

msg.innerText=

`${need} Runs Needed from ${ballsLeft} Balls`;

}

}

// refreshScore() END lo

updateNeedMessage();

// ================= AUTO COMPLETE =================

function autoCompleteMatch(){

if(innings!==2)return;

if(totalRuns>=target){

endMatch();

}

}

// refreshScore() END lo

autoCompleteMatch();

// ================= FINAL SAVE =================

window.addEventListener("beforeunload",()=>{

saveLiveScore();

});

// ================= LOAD COMPLETE =================

console.log("🏏 VPL 2K27 Live Score Part 12 Loaded Successfully");
// ================= PART 13 =================
// PREMIUM LIVE SCORE FEATURES

// ================= BATSMAN STRIKE RATE =================

function updateStrikeRate(){

const sr =
strikerBalls === 0
? 0
: ((strikerRuns / strikerBalls) * 100).toFixed(2);

const box=document.getElementById("strikerSR");

if(box){

box.innerText=sr;

}

}

// ================= BOWLER ECONOMY =================

function updateEconomy(){

const oversBowled=balls/6;

const eco=
oversBowled===0
?0
:(bowlerRuns/oversBowled).toFixed(2);

const box=document.getElementById("bowlerEco");

if(box){

box.innerText=eco;

}

}

// ================= MATCH PROGRESS =================

function updateProgress(){

const percent=((balls/90)*100).toFixed(0);

const bar=document.getElementById("matchProgress");

if(bar){

bar.style.width=percent+"%";

}

}

// ================= AUTO REQUIRED RATE =================

function updateRequiredRate(){

if(innings!==2)return;

const runsLeft=target-totalRuns;

const oversLeft=(90-balls)/6;

const rrr=
oversLeft<=0
?0
:(runsLeft/oversLeft).toFixed(2);

document.getElementById("rrr").innerText=rrr;

}

// ================= REFRESH =================

// refreshScore() function END lo

updateStrikeRate();

updateEconomy();

updateProgress();

updateRequiredRate();

// ================= LIVE ENGINE =================

console.log("✅ Part 13 Loaded Successfully");
// ================= PART 14 =================
// LIVE DASHBOARD ENHANCEMENTS

// ================= AUTO STRIKE CHANGE =================

function changeStrike(){

let temp = strikerPlayer;

strikerPlayer = nonStrikerPlayer;

nonStrikerPlayer = temp;

document.getElementById("strikerName").innerText =
strikerPlayer.playerName;

document.getElementById("nonStrikerName").innerText =
nonStrikerPlayer.playerName;

}

// ================= LAST BALL RESULT =================

let lastBall="-";

function updateLastBall(ball){

lastBall=ball;

const box=document.getElementById("lastBall");

if(box){

box.innerText=lastBall;

}

}

// addHistory(text) END lo add cheyyi

updateLastBall(text);

// ================= LIVE TARGET BAR =================

function updateTargetBar(){

if(innings!==2)return;

const percent=Math.min(

(totalRuns/target)*100,

100

);

const bar=document.getElementById("targetBar");

if(bar){

bar.style.width=percent+"%";

}

}

// ================= TEAM LOGOS =================

function loadTeamLogos(){

const team1Logo=document.getElementById("team1Logo");

const team2Logo=document.getElementById("team2Logo");

if(team1Logo){

team1Logo.src=`logos/${firstBattingTeam}.png`;

}

if(team2Logo){

team2Logo.src=`logos/${firstBowlingTeam}.png`;

}

}

// ================= AUTO SAVE EVERY BALL =================

async function saveEveryBall(){

await saveLiveScore();

console.log("Ball Saved");

}

// addRuns() END lo

saveEveryBall();

// ================= CROWD MESSAGE =================

function crowdReaction(run){

if(run===4){

addComment("👏 Crowd cheers for FOUR!");

}

if(run===6){

addComment("🔥 Huge SIX!");

}

}

// addRuns() END lo

crowdReaction(run);

// ================= DASHBOARD REFRESH =================

// refreshScore() END lo

updateTargetBar();

console.log("✅ Part 14 Loaded");
// ================= PART 15 =================
// TOURNAMENT PREMIUM FEATURES

// ================= LIVE MATCH INFO =================

function updateMatchInfo(){

const info=document.getElementById("matchInfo");

if(!info) return;

info.innerHTML=`
${currentMatch.matchNumber}<br>
${firstBattingTeam} 🆚 ${firstBowlingTeam}
`;

}

// ================= CURRENT RUN RATE COLOR =================

function updateCRRColor(){

const crr=parseFloat(document.getElementById("crr").innerText);

const box=document.getElementById("crr");

if(crr>=10){

box.style.color="#00ff66";

}else if(crr>=7){

box.style.color="#FFD700";

}else{

box.style.color="#ff4444";

}

}

// ================= REQUIRED RATE COLOR =================

function updateRRRColor(){

const box=document.getElementById("rrr");

if(!box)return;

const rrr=parseFloat(box.innerText);

if(rrr<=8){

box.style.color="#00ff66";

}else if(rrr<=12){

box.style.color="#FFD700";

}else{

box.style.color="#ff3333";

}

}

// ================= MATCH RESULT SOUND =================

function playResultSound(){

const audio=new Audio("sounds/win.mp3");

audio.play().catch(()=>{});

}

// endMatch() END lo add cheyyi

playResultSound();

// ================= LIVE STATUS DOT =================

function updateLiveDot(){

const dot=document.getElementById("liveDot");

if(dot){

dot.style.background="red";

dot.style.animation="blink 1s infinite";

}

}

// ================= REFRESH =================

// refreshScore() function END lo add cheyyi

updateCRRColor();

updateRRRColor();

updateLiveDot();

// ================= FINAL MESSAGE =================

console.log("🏆 VPL 2K27 Live Score Part 15 Loaded Successfully");
// ================= PART 16 =================
// ADVANCED LIVE SCORE FEATURES

// ================= WAGON WHEEL DATA =================

let wagonWheel=[];

function addShot(run){

wagonWheel.push({

run:run,

ball:balls,

time:new Date().toLocaleTimeString()

});

}

// addRuns() END lo add cheyyi

addShot(run);

// ================= BOUNDARY COUNT =================

let totalFours=0;
let totalSixes=0;

function updateBoundaryCount(run){

if(run===4){

totalFours++;

}

if(run===6){

totalSixes++;

}

const fourBox=document.getElementById("totalFours");

const sixBox=document.getElementById("totalSixes");

if(fourBox){

fourBox.innerText=totalFours;

}

if(sixBox){

sixBox.innerText=totalSixes;

}

}

// addRuns() END lo add cheyyi

updateBoundaryCount(run);

// ================= HIGHEST OVER =================

let currentOverRuns=0;
let highestOver=0;

function updateOverRuns(run){

currentOverRuns+=run;

if(currentOverRuns>highestOver){

highestOver=currentOverRuns;

}

if(balls>0 && balls%6===0){

currentOverRuns=0;

}

}

// addRuns() END lo add cheyyi

updateOverRuns(run);

// ================= LIVE PARTNERSHIP BAR =================

function updatePartnershipBar(){

const bar=document.getElementById("partnershipBar");

if(!bar)return;

bar.style.width=Math.min(partnershipRuns,100)+"%";

}

// refreshScore() END lo add cheyyi

updatePartnershipBar();

// ================= AUTO BACKUP FIREBASE =================

setInterval(()=>{

saveLiveScore();

},10000);

// ================= ENGINE VERSION =================

console.log("🏏 VPL 2K27 Live Score Part 16 Loaded Successfully");
// ================= PART 17 =================
// MATCH ANALYTICS & RECORDS

// ================= DOT BALLS =================

let dotBalls = 0;

function updateDotBalls(run){

if(run===0){

dotBalls++;

}

const box=document.getElementById("dotBalls");

if(box){

box.innerText=dotBalls;

}

}

// addRuns() END lo add cheyyi

updateDotBalls(run);

// ================= TOTAL EXTRAS =================

let totalExtras=0;

function updateExtras(type){

totalExtras++;

const box=document.getElementById("extras");

if(box){

box.innerText=totalExtras;

}

addComment(`${type} Extra`);

}

// btnWide.onclick END lo

updateExtras("Wide");

// btnNoBall.onclick END lo

updateExtras("No Ball");

// btnBye.onclick END lo

updateExtras("Bye");

// btnLegBye.onclick END lo

updateExtras("Leg Bye");

// ================= BOUNDARY PERCENTAGE =================

function updateBoundaryPercentage(){

const boundaries=(totalFours*4)+(totalSixes*6);

const percent=

totalRuns===0

?0

:((boundaries/totalRuns)*100).toFixed(1);

const box=document.getElementById("boundaryPercent");

if(box){

box.innerText=percent+"%";

}

}

// refreshScore() END lo

updateBoundaryPercentage();

// ================= MATCH RECORD =================

function checkRecord(){

if(totalRuns>=200){

addComment("🏆 New Tournament Highest Score!");

}

if(strikerRuns>=100){

addComment(`💯 Century by ${strikerPlayer.playerName}`);

}

if(strikerRuns>=50 && strikerRuns<100){

addComment(`🔥 Fifty by ${strikerPlayer.playerName}`);

}

}

// refreshScore() END lo

checkRecord();

// ================= LIVE ENGINE =================

console.log("✅ Part 17 Loaded Successfully");
// ================= PART 18 =================
// ADVANCED MATCH INSIGHTS

// ================= POWERPLAY TRACKER =================

let powerplayRuns = 0;

function updatePowerplay(run){

if(balls < 36){

powerplayRuns += run;

const box = document.getElementById("powerplayRuns");

if(box){

box.innerText = powerplayRuns;

}

}

}

// addRuns() END lo add cheyyi

updatePowerplay(run);

// ================= WORM GRAPH DATA =================

let wormData=[];

function updateWorm(){

wormData.push({

over:Math.floor(balls/6)+(balls%6)/10,

runs:totalRuns

});

}

// refreshScore() END lo add cheyyi

updateWorm();

// ================= HIGHEST SCORER =================

let highestScorer={

name:"",
runs:0

};

function updateHighestScorer(){

if(strikerRuns>highestScorer.runs){

highestScorer.name=strikerPlayer.playerName;

highestScorer.runs=strikerRuns;

}

const box=document.getElementById("highestScorer");

if(box){

box.innerText=

`${highestScorer.name} (${highestScorer.runs})`;

}

}

// refreshScore() END lo

updateHighestScorer();

// ================= BEST BOWLER =================

function updateBestBowler(){

const box=document.getElementById("bestBowler");

if(box){

box.innerText=

`${bowlerPlayer.playerName} (${bowlerWickets}/${bowlerRuns})`;

}

}

// refreshScore() END lo

updateBestBowler();

// ================= LIVE REQUIRED BALLS =================

function updateNeedPerBall(){

if(innings!==2)return;

const ballsLeft=90-balls;

const runsLeft=Math.max(target-totalRuns,0);

const box=document.getElementById("needPerBall");

if(box){

box.innerText=

`${runsLeft} from ${ballsLeft}`;

}

}

// refreshScore() END lo

updateNeedPerBall();

// ================= MATCH ENGINE =================

console.log("🏏 VPL 2K27 Live Score Part 18 Loaded Successfully");
// ================= PART 19 =================
// TOURNAMENT ANALYTICS & LIVE FEATURES

// ================= FASTEST FIFTY =================

let fastestFifty = null;

function checkFastestFifty(){

if(strikerRuns>=50 && fastestFifty===null){

fastestFifty={

name:strikerPlayer.playerName,

balls:strikerBalls

};

addComment(
`🔥 Fast Fifty by ${strikerPlayer.playerName} (${strikerBalls} balls)`
);

}

}

// refreshScore() END lo add cheyyi

checkFastestFifty();

// ================= FASTEST CENTURY =================

let fastestCentury = null;

function checkFastestCentury(){

if(strikerRuns>=100 && fastestCentury===null){

fastestCentury={

name:strikerPlayer.playerName,

balls:strikerBalls

};

addComment(
`💯 Century by ${strikerPlayer.playerName} (${strikerBalls} balls)`
);

}

}

// refreshScore() END lo add cheyyi

checkFastestCentury();

// ================= LIVE PARTNERSHIP RECORD =================

let bestPartnership = 0;

function updateBestPartnership(){

if(partnershipRuns>bestPartnership){

bestPartnership=partnershipRuns;

}

const box=document.getElementById("bestPartnership");

if(box){

box.innerText=bestPartnership;

}

}

// refreshScore() END lo

updateBestPartnership();

// ================= RUNS PER OVER =================

let overSummary=[];

function saveOverSummary(){

if(balls>0 && balls%6===0){

overSummary.push(currentOverRuns);

}

}

// checkOverComplete() START lo add cheyyi

saveOverSummary();

// ================= MATCH MOMENTUM =================

function updateMomentum(){

const box=document.getElementById("momentum");

if(!box) return;

if(totalRuns>=target && innings===2){

box.innerText="🟢 Chasing Team Ahead";

}else if(document.getElementById("crr").innerText>=10){

box.innerText="🔥 Batting Dominating";

}else{

box.innerText="⚖ Balanced Match";

}

}

// refreshScore() END lo

updateMomentum();

// ================= FINAL =================

console.log("🏆 Part 19 Loaded Successfully");
// ================= PART 20 =================
// FINAL PREMIUM LIVE SCORE FEATURES

// ================= MATCH SUMMARY JSON =================

function generateSummary(){

return{

match:currentMatch ? currentMatch.matchNumber : "",

battingTeam:battingTeam.innerText,

runs:totalRuns,

wickets:wickets,

overs:`${Math.floor(balls/6)}.${balls%6}`,

crr:document.getElementById("crr").innerText,

target:target,

winner:document.getElementById("winnerText").innerText,

commentary:matchLog,

ballHistory:history,

fallOfWickets,

highestPartnership,

extras:totalExtras,

fours:totalFours,

sixes:totalSixes

};

}

// ================= DOWNLOAD JSON =================

function downloadSummary(){

const data=

JSON.stringify(generateSummary(),null,2);

const blob=

new Blob([data],{type:"application/json"});

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="VPL_Match_Summary.json";

a.click();

}

// ================= EXPORT CSV =================

function exportCSV(){

let csv=

"Runs,Wickets,Overs\n";

csv+=`${totalRuns},${wickets},${Math.floor(balls/6)}.${balls%6}`;

const blob=

new Blob([csv],{type:"text/csv"});

const a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="MatchSummary.csv";

a.click();

}

// ================= RESET MATCH =================

function resetMatch(){

totalRuns=0;

wickets=0;

balls=0;

history=[];

matchLog=[];

fallOfWickets=[];

undoStack=[];

refreshScore();

}

// ================= VERSION =================

const LIVE_SCORE_VERSION="VPL 2K27 Live Score v3.0";

console.log(LIVE_SCORE_VERSION);

// ================= READY =================

console.log("🏆 Live Score Engine Completed Successfully");
