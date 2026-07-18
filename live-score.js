// =====================================================
// VPL 2K27 LIVE SCORE
// PART 1
// Firebase + Match Loading
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================================
// FIREBASE
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
// HTML
// =====================================================

const matchSelect = document.getElementById("matchSelect");
const tossWinner = document.getElementById("tossWinner");
const tossDecision = document.getElementById("tossDecision");
const startMatchBtn = document.getElementById("startMatchBtn");

const battingTeam = document.getElementById("battingTeam");
const inningsText = document.getElementById("inningsText");
const liveScore = document.getElementById("liveScore");
const overs = document.getElementById("overs");

const crr = document.getElementById("crr");
const target = document.getElementById("target");
const needRuns = document.getElementById("needRuns");
const rrr = document.getElementById("rrr");

// =====================================================
// VARIABLES
// =====================================================

let matches = [];
let selectedMatch = null;

let battingTeamName = "";
let bowlingTeamName = "";

let totalRuns = 0;
let wickets = 0;
let balls = 0;

let currentMatchId = "";

// Batsman

let strikerName = "";
let nonStrikerName = "";

let strikerRuns = 0;
let strikerBalls = 0;

let nonStrikerRuns = 0;
let nonStrikerBalls = 0;

let strikerFours = 0;
let strikerSixes = 0;

// Bowler

let bowlerName = "";

let bowlerRuns = 0;
let bowlerBalls = 0;
let bowlerWickets = 0;

// Extras

let isWide = false;
let isNoBall = false;

// =====================================================
// LOAD MATCHES
// =====================================================

async function loadMatches() {

    matchSelect.innerHTML =
        `<option value="">-- Select Match --</option>`;

    matches = [];

    const snap = await getDocs(collection(db, "matches"));

    snap.forEach(docSnap => {

        const match = docSnap.data();

        if (match.status !== "Not Started") return;

        match.id = docSnap.id;

        matches.push(match);

        matchSelect.innerHTML += `
        <option value="${match.id}">
        ${match.matchNumber} | ${match.team1} vs ${match.team2}
        </option>
        `;

    });

}

// =====================================================
// MATCH SELECT
// =====================================================

matchSelect.addEventListener("change", () => {

    selectedMatch =
        matches.find(m => m.id === matchSelect.value);

    if (!selectedMatch) return;

    currentMatchId = selectedMatch.id;

    tossWinner.innerHTML = `
    <option value="">Select Toss Winner</option>`;

    tossWinner.innerHTML += `
    <option value="${selectedMatch.team1}">
    ${selectedMatch.team1}
    </option>`;

    tossWinner.innerHTML += `
    <option value="${selectedMatch.team2}">
    ${selectedMatch.team2}
    </option>`;

    console.log("Selected Match :", selectedMatch);

});

// =====================================================

loadMatches();

console.log("✅ PART 1 LOADED");
// =====================================================
// PART 2
// START MATCH
// =====================================================

// Player Modal

const playerModal = document.getElementById("playerModal");

// Start Match Button

startMatchBtn.addEventListener("click", startMatch);

// ================= START MATCH =================

function startMatch() {

    if (!selectedMatch) {

        alert("Please Select Match");

        return;

    }

    if (tossWinner.value === "") {

        alert("Please Select Toss Winner");

        return;

    }

    if (tossDecision.value === "") {

        alert("Please Select Toss Decision");

        return;

    }

    // ================= RESET =================

    totalRuns = 0;
    wickets = 0;
    balls = 0;

    strikerRuns = 0;
    strikerBalls = 0;

    nonStrikerRuns = 0;
    nonStrikerBalls = 0;

    strikerFours = 0;
    strikerSixes = 0;

    bowlerRuns = 0;
    bowlerBalls = 0;
    bowlerWickets = 0;

    isWide = false;
    isNoBall = false;

    // ================= TOSS =================

    const tossWin = tossWinner.value;

    const decision = tossDecision.value;

    if (decision === "bat") {

        battingTeamName = tossWin;

        bowlingTeamName =
            tossWin === selectedMatch.team1
            ? selectedMatch.team2
            : selectedMatch.team1;

    } else {

        bowlingTeamName = tossWin;

        battingTeamName =
            tossWin === selectedMatch.team1
            ? selectedMatch.team2
            : selectedMatch.team1;

    }

    // ================= SCOREBOARD =================

    battingTeam.innerText = battingTeamName;

    inningsText.innerText = "1st Innings";

    liveScore.innerText = "0 / 0";

    overs.innerText = "Overs : 0.0 / 15";

    crr.innerText = "0.00";

    target.innerText = "--";

    needRuns.innerText = "--";

    rrr.innerText = "--";

    console.log("🏏 Match Started");

    console.log("Batting :", battingTeamName);

    console.log("Bowling :", bowlingTeamName);

    // ================= PLAYER MODAL =================

    playerModal.style.display = "flex";

    loadPlayers();

}
// ===
    );

    bowlingSnap.forEach(docSnap => {

        const p = docSnap.data();

        bowlerSelect.innerHTML += `
        <option value="${p.playerName}">
        ${p.playerName}
        </option>`;

    });

}

// =====================================================
// PART 3A
// PLAYER SELECTION
// =====================================================

// HTML

const playerModal = document.getElementById("playerModal");

const strikerSelect = document.getElementById("strikerSelect");
const nonStrikerSelect = document.getElementById("nonStrikerSelect");
const bowlerSelect = document.getElementById("bowlerSelect");

const confirmPlayersBtn =
document.getElementById("confirmPlayersBtn");

// Current Players

const currentStriker =
document.getElementById("currentStriker");

const currentNonStriker =
document.getElementById("currentNonStriker");

const currentBowler =
document.getElementById("currentBowler");

// Score Cards

const strikerScore =
document.getElementById("strikerScore");

const nonStrikerScore =
document.getElementById("nonStrikerScore");

const strikerBoundary =
document.getElementById("strikerBoundary");

const bowlerFigure =
document.getElementById("bowlerFigure");

// =====================================================
// LOAD PLAYERS
// =====================================================

async function loadPlayers() {

    strikerSelect.innerHTML =
    '<option value="">Select Striker</option>';

    nonStrikerSelect.innerHTML =
    '<option value="">Select Non-Striker</option>';

    bowlerSelect.innerHTML =
    '<option value="">Select Bowler</option>';

    // ================= BATTING TEAM =================

    const battingSnapshot = await getDocs(

        query(

            collection(db,"registrations"),

            where("soldTo","==",battingTeamName)

        )

    );

    battingSnapshot.forEach(docSnap=>{

        const p = docSnap.data();

        strikerSelect.innerHTML +=
        `<option value="${p.playerName}">
        ${p.playerName}
        </option>`;

        nonStrikerSelect.innerHTML +=
        `<option value="${p.playerName}">
        ${p.playerName}
        </option>`;

    });

    // ================= BOWLING TEAM =================

    const bowlingSnapshot = await getDocs(

        query(

            collection(db,"registrations"),

            where("soldTo","==",bowlingTeamName)

        )

    );

    bowlingSnapshot.forEach(docSnap=>{

        const p = docSnap.data();

        bowlerSelect.innerHTML +=
        `<option value="${p.playerName}">
        ${p.playerName}
        </option>`;

    });

}

// =====================================================
// CONFIRM PLAYERS
// =====================================================

confirmPlayersBtn.onclick = () => {

    if(
        strikerSelect.value=="" ||
        nonStrikerSelect.value=="" ||
        bowlerSelect.value==""
    ){

        alert("Select All Players");

        return;

    }

    if(strikerSelect.value==nonStrikerSelect.value){

        alert("Striker & Non-Striker Cannot Be Same");

        return;

    }

    // Names

    strikerName = strikerSelect.value;

    nonStrikerName = nonStrikerSelect.value;

    bowlerName = bowlerSelect.value;

    // Reset Stats

    strikerRuns = 0;
    strikerBalls = 0;

    nonStrikerRuns = 0;
    nonStrikerBalls = 0;

    strikerFours = 0;
    strikerSixes = 0;

    bowlerRuns = 0;
    bowlerBalls = 0;
    bowlerWickets = 0;

    // Update Screen

    currentStriker.innerText = strikerName;

    currentNonStriker.innerText = nonStrikerName;

    currentBowler.innerText = bowlerName;

    strikerScore.innerText = "0 (0)";

    nonStrikerScore.innerText = "0 (0)";

    strikerBoundary.innerText =
    "4s : 0 | 6s : 0";

    bowlerFigure.innerText =
    "0-0 (0.0)";

    playerModal.style.display = "none";

    console.log("Players Selected");

};
