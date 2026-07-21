// =====================================================
// VPL 2K27 LIVE SCORE v3.0
// PART 3A
// FIREBASE + GLOBAL VARIABLES
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================================
// FIREBASE CONFIG
// =====================================================

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

// =====================================================
// GLOBAL VARIABLES
// =====================================================

let matches = [];
let selectedMatch = null;

let battingTeam = "";
let bowlingTeam = "";

let innings = 1;

let totalRuns = 0;
let wickets = 0;
let balls = 0;

let target = 0;

let striker = null;
let nonStriker = null;
let currentBowler = null;

let battingPlayers = [];
let bowlingPlayers = [];

let ballHistory = [];
let fallOfWickets = [];

let partnershipRuns = 0;
let partnershipBalls = 0;

let extras = {
    wide: 0,
    noBall: 0,
    bye: 0,
    legBye: 0
};

// =====================================================
// HTML REFERENCES
// =====================================================

// Match
const matchSelect = document.getElementById("matchSelect");
const tossWinner = document.getElementById("tossWinner");
const tossDecision = document.getElementById("tossDecision");
const startMatchBtn = document.getElementById("startMatchBtn");

// Scoreboard
const battingTeamText = document.getElementById("battingTeam");
const liveScore = document.getElementById("liveScore");
const overs = document.getElementById("overs");
const crr = document.getElementById("crr");
const targetText = document.getElementById("target");
const needRuns = document.getElementById("needRuns");
const rrr = document.getElementById("rrr");

// Batters
const currentStriker = document.getElementById("currentStriker");
const currentNonStriker = document.getElementById("currentNonStriker");

const strikerScore = document.getElementById("strikerScore");
const nonStrikerScore = document.getElementById("nonStrikerScore");

const strikerSR = document.getElementById("strikerSR");
const nonStrikerSR = document.getElementById("nonStrikerSR");

const strikerFours = document.getElementById("strikerFours");
const strikerSixes = document.getElementById("strikerSixes");

const nonStrikerFours = document.getElementById("nonStrikerFours");
const nonStrikerSixes = document.getElementById("nonStrikerSixes");

// Bowler
const currentBowlerText = document.getElementById("currentBowler");

const bowlerOvers = document.getElementById("bowlerOvers");
const bowlerMaidens = document.getElementById("bowlerMaidens");
const bowlerRuns = document.getElementById("bowlerRuns");
const bowlerWickets = document.getElementById("bowlerWickets");
const bowlerEconomy = document.getElementById("bowlerEconomy");

// Partnership
const partnershipRunsText = document.getElementById("partnershipRuns");
const partnershipBallsText = document.getElementById("partnershipBalls");

// Extras
const wideCount = document.getElementById("wideCount");
const noBallCount = document.getElementById("noBallCount");
const byeCount = document.getElementById("byeCount");
const legByeCount = document.getElementById("legByeCount");
const totalExtras = document.getElementById("totalExtras");

// ================================
// LIVE MATCH STATS
// ================================

let strikerStats = {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

let nonStrikerStats = {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

let bowlerStats = {
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0
};

// Others
const fallOfWicketsBox = document.getElementById("fallOfWickets");
const ballHistoryBox = document.getElementById("ballHistory");

// Modals
const playerModal = document.getElementById("playerModal");
const bowlerModal = document.getElementById("bowlerModal");

const strikerSelect = document.getElementById("strikerSelect");
const nonStrikerSelect = document.getElementById("nonStrikerSelect");
const bowlerSelect = document.getElementById("bowlerSelect");

const newBowlerSelect = document.getElementById("newBowlerSelect");

const confirmPlayersBtn = document.getElementById("confirmPlayersBtn");
const confirmBowlerBtn = document.getElementById("confirmBowlerBtn");

console.log("✅ PART 3A LOADED");

// =====================================================
// PART 3B
// MATCH LOADING ENGINE
// =====================================================

// Load Matches from Firestore

async function loadMatches() {

    try {

        matchSelect.innerHTML =
        `<option value="">Select Match</option>`;

        matches = [];

        const snapshot = await getDocs(
            collection(db, "matches")
        );

        snapshot.forEach(docSnap => {

            const match = docSnap.data();

            match.id = docSnap.id;

            // Only Not Started Matches

            if (match.status !== "Not Started") return;

            matches.push(match);

            matchSelect.innerHTML += `
            <option value="${match.id}">
            Match ${match.matchNumber}
            | ${match.team1} vs ${match.team2}
            </option>
            `;

        });

        console.log("✅ Matches Loaded :", matches.length);

    }

    catch(error){

        console.error(error);

        alert("Unable to load matches.");

    }

}

// =====================================================
// MATCH SELECT EVENT
// =====================================================

matchSelect.addEventListener("change", () => {

    selectedMatch =
    matches.find(
        m => m.id === matchSelect.value
    );

    tossWinner.innerHTML =
    `<option value="">Select Toss Winner</option>`;

    if(!selectedMatch) return;

    tossWinner.innerHTML +=
    `<option value="${selectedMatch.team1}">
    ${selectedMatch.team1}
    </option>`;

    tossWinner.innerHTML +=
    `<option value="${selectedMatch.team2}">
    ${selectedMatch.team2}
    </option>`;

});

// =====================================================
// AUTO LOAD MATCHES
// =====================================================

loadMatches();

console.log("✅ PART 3B LOADED");

// =====================================================
// PART 3C
// START MATCH ENGINE
// =====================================================

startMatchBtn.onclick = startMatch;

 async function startMatch(){

    if(!selectedMatch){

        alert("Please Select Match");
        return;

    }

    if(tossWinner.value===""){

        alert("Select Toss Winner");
        return;

    }

    const winner = tossWinner.value;
    const decision = tossDecision.value;

    if(decision==="bat"){

        battingTeam =
        winner;

        bowlingTeam =
        winner===selectedMatch.team1
        ? selectedMatch.team2
        : selectedMatch.team1;

    }

    else{

        bowlingTeam =
        winner;

        battingTeam =
        winner===selectedMatch.team1
        ? selectedMatch.team2
        : selectedMatch.team1;

    }

    // Reset Score

    totalRuns = 0;
    wickets = 0;
    balls = 0;

    target = 0;

    extras = {

        wide:0,
        noBall:0,
        bye:0,
        legBye:0

    };

    partnershipRuns = 0;
    partnershipBalls = 0;

    ballHistory = [];
    fallOfWickets = [];

    // Update Scoreboard

    battingTeamText.innerText = battingTeam;

    liveScore.innerText = "0 / 0";

    overs.innerText = "0.0 / 15";

    crr.innerText = "0.00";

    targetText.innerText = "--";

    needRuns.innerText = "--";

    rrr.innerText = "--";

    partnershipRunsText.innerText = "0 Runs";

    partnershipBallsText.innerText = "0 Balls";

    wideCount.innerText = "0";
    noBallCount.innerText = "0";
    byeCount.innerText = "0";
    legByeCount.innerText = "0";
    totalExtras.innerText = "0";

    ballHistoryBox.innerHTML = "-";

    fallOfWicketsBox.innerHTML =
    "No Wickets";

    // Open Player Selection

    await loadPlayers();

    playerModal.style.display = "flex";

    console.log("🏏 Match Started");

    console.log("Batting :", battingTeam);

    console.log("Bowling :", bowlingTeam);

}

// =====================================================
// PART 4A
// LOAD PLAYERS FROM FIRESTORE
// =====================================================

async function loadPlayers(){

    try{

        // Reset Dropdowns

        strikerSelect.innerHTML =
        `<option value="">Select Striker</option>`;

        nonStrikerSelect.innerHTML =
        `<option value="">Select Non-Striker</option>`;

        bowlerSelect.innerHTML =
        `<option value="">Select Bowler</option>`;

        battingPlayers = [];
        bowlingPlayers = [];

        // --------------------------
        // Batting Team Players
        // --------------------------

        const battingQuery = query(
            collection(db,"registrations"),
            where("soldTo","==",battingTeam)
        );

        const battingSnap =
        await getDocs(battingQuery);

        battingSnap.forEach(docSnap=>{

            const player = docSnap.data();

            battingPlayers.push(player);

            strikerSelect.innerHTML +=
            `<option value="${player.playerName}">
                ${player.playerName}
            </option>`;

            nonStrikerSelect.innerHTML +=
            `<option value="${player.playerName}">
                ${player.playerName}
            </option>`;

        });

        // --------------------------
        // Bowling Team Players
        // --------------------------

        const bowlingQuery = query(
            collection(db,"registrations"),
            where("soldTo","==",bowlingTeam)
        );

        const bowlingSnap =
        await getDocs(bowlingQuery);

        bowlingSnap.forEach(docSnap=>{

            const player = docSnap.data();

            bowlingPlayers.push(player);

            bowlerSelect.innerHTML +=
            `<option value="${player.playerName}">
                ${player.playerName}
            </option>`;

        });

        console.log("✅ Players Loaded");

    }

    catch(error){

        console.error(error);

        alert("Unable to load players.");

    }

}

// =====================================================
// PART 4B
// CONFIRM PLAYERS ENGINE
// =====================================================

confirmPlayersBtn.onclick = function () {

    if (
        strikerSelect.value === "" ||
        nonStrikerSelect.value === "" ||
        bowlerSelect.value === ""
    ) {
        alert("Please select all players.");
        return;
    }

    if (strikerSelect.value === nonStrikerSelect.value) {
        alert("Striker and Non-Striker cannot be same.");
        return;
    }

    // Current Players

    striker = battingPlayers.find(
        p => p.playerName === strikerSelect.value
    );

    nonStriker = battingPlayers.find(
        p => p.playerName === nonStrikerSelect.value
    );

    currentBowler = bowlingPlayers.find(
        p => p.playerName === bowlerSelect.value
    );

// Reset Live Match Stats

strikerStats = {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

nonStrikerStats = {
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0
};

bowlerStats = {
    balls: 0,
    runs: 0,
    wickets: 0,
    maidens: 0
};

// Update Scoreboard

    currentStriker.innerText = striker.playerName;
    currentNonStriker.innerText = nonStriker.playerName;
    currentBowlerText.innerText = currentBowler.playerName;

    strikerScore.innerText = "0 (0)";
    nonStrikerScore.innerText = "0 (0)";

    strikerSR.innerText = "0.00";
    nonStrikerSR.innerText = "0.00";

    strikerFours.innerText = "0";
    strikerSixes.innerText = "0";

    nonStrikerFours.innerText = "0";
    nonStrikerSixes.innerText = "0";

    bowlerOvers.innerText = "0.0";
    bowlerMaidens.innerText = "0";
    bowlerRuns.innerText = "0";
    bowlerWickets.innerText = "0";
    bowlerEconomy.innerText = "0.00";

    // Close Modal

    playerModal.style.display = "none";

    console.log("✅ Players Confirmed");

};

// =====================================================
// PART 4C
// NORMAL SCORING ENGINE
// =====================================================

// Score Buttons

document.getElementById("btn0").onclick = () => scoreRuns(0);
document.getElementById("btn1").onclick = () => scoreRuns(1);
document.getElementById("btn2").onclick = () => scoreRuns(2);
document.getElementById("btn3").onclick = () => scoreRuns(3);
document.getElementById("btn4").onclick = () => scoreRuns(4);
document.getElementById("btn6").onclick = () => scoreRuns(6);

// =====================================================

function scoreRuns(run){

    // ---------------- TEAM ----------------

    totalRuns += run;
    balls++;

    // ---------------- STRIKER ----------------

    strikerStats.runs += run;
    strikerStats.balls++;

    if(run === 4)
        strikerStats.fours++;

    if(run === 6)
        strikerStats.sixes++;

    // ---------------- BOWLER ----------------

    bowlerStats.runs += run;
    bowlerStats.balls++;

    // ---------------- PARTNERSHIP ----------------

    partnershipRuns += run;
    partnershipBalls++;

    // ---------------- BALL HISTORY ----------------

    ballHistory.push(run);

    // ---------------- STRIKE CHANGE ----------------

    if(run === 1 || run === 3){

        // Swap Players

        [striker, nonStriker] =
        [nonStriker, striker];

        // Swap Stats

        [strikerStats, nonStrikerStats] =
        [nonStrikerStats, strikerStats];

    }

    // ---------------- UPDATE SCREEN ----------------

    updateLiveScore();

}

// =====================================================
// UPDATE LIVE SCORE
// =====================================================

function updateLiveScore(){

    liveScore.innerText =
    `${totalRuns} / ${wickets}`;

    overs.innerText =
    `${Math.floor(balls/6)}.${balls%6} / 15`;

    let overPlayed = balls/6;

    crr.innerText =
    overPlayed==0
    ? "0.00"
    : (totalRuns/overPlayed).toFixed(2);

    // Batters

    currentStriker.innerText = striker.playerName;
    currentNonStriker.innerText = nonStriker.playerName;

    strikerScore.innerText =
    `${striker.runs} (${striker.balls})`;

    nonStrikerScore.innerText =
    `${nonStriker.runs||0} (${nonStriker.balls||0})`;

    strikerSR.innerText =
    striker.strikeRate;

    nonStrikerSR.innerText =
    nonStriker.strikeRate || "0.00";

    strikerFours.innerText =
    striker.fours || 0;

    strikerSixes.innerText =
    striker.sixes || 0;

    nonStrikerFours.innerText =
    nonStriker.fours || 0;

    nonStrikerSixes.innerText =
    nonStriker.sixes || 0;

    // Bowler

    currentBowlerText.innerText =
    currentBowler.playerName;

    bowlerOvers.innerText =
    currentBowler.overs;

    bowlerRuns.innerText =
    currentBowler.runs;

    bowlerEconomy.innerText =
    currentBowler.economy;

    // Partnership

    partnershipRunsText.innerText =
    `${partnershipRuns} Runs`;

    partnershipBallsText.innerText =
    `${partnershipBalls} Balls`;

    // Ball History

    ballHistoryBox.innerHTML =
    ballHistory.join(" | ");

}
