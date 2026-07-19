
// =====================================================
// VPL 2K27 LIVE SCORE v2.0
// PART 1
// Firebase Initialization
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

    getFirestore,

    collection,

    getDocs,

    addDoc,

    updateDoc,

    doc,

    query,

    where,

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

let selectedMatch = null;

let matches = [];

let battingTeamName = "";

let bowlingTeamName = "";

let innings = 1;

// Team Score

let totalRuns = 0;

let wickets = 0;

let balls = 0;

// Current Players

let strikerName = "";

let nonStrikerName = "";

let bowlerName = "";

// Batsman Stats

let strikerRuns = 0;

let strikerBalls = 0;

let strikerFours = 0;

let strikerSixes = 0;

let nonStrikerRuns = 0;

let nonStrikerBalls = 0;

// Bowler Stats

let bowlerRuns = 0;

let bowlerBalls = 0;

let bowlerWickets = 0;

// Extras

let wides = 0;

let noBalls = 0;

let byes = 0;

let legByes = 0;

// Flags

let isWide = false;

let isNoBall = false;

// =====================================================
// HTML REFERENCES
// =====================================================

// Match

const matchSelect = document.getElementById("matchSelect");

const tossWinner = document.getElementById("tossWinner");

const tossDecision = document.getElementById("tossDecision");

const startMatchBtn = document.getElementById("startMatchBtn");

// Scoreboard

const battingTeam = document.getElementById("battingTeam");

const inningsText = document.getElementById("inningsText");

const liveScore = document.getElementById("liveScore");

const overs = document.getElementById("overs");

const crr = document.getElementById("crr");

const target = document.getElementById("target");

const needRuns = document.getElementById("needRuns");

const rrr = document.getElementById("rrr");

// Player Modal

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

const strikerScore =
document.getElementById("strikerScore");

const nonStrikerScore =
document.getElementById("nonStrikerScore");

const strikerBoundary =
document.getElementById("strikerBoundary");

const bowlerFigure =
document.getElementById("bowlerFigure");

console.log("✅ PART 1 LOADED");

// =====================================================
// PART 2
// MATCH LOADING + TOSS + START MATCH
// =====================================================

// ================= LOAD MATCHES =================

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

            // Only Not Started Matches

            if (match.status !== "Not Started") return;

            match.id = docSnap.id;

            matches.push(match);

            matchSelect.innerHTML += `
            <option value="${match.id}">
            Match ${match.matchNumber}
            | ${match.team1}
            vs
            ${match.team2}
            </option>
            `;

        });

        console.log("✅ Matches Loaded :", matches.length);

    }

    catch(err){

        console.error(err);

        alert("Unable to load matches.");

    }

}

// ================= MATCH CHANGE =================

matchSelect.addEventListener("change", () => {

    selectedMatch =
    matches.find(
        x => x.id === matchSelect.value
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

// ================= START MATCH =================

startMatchBtn.onclick = startMatch;

function startMatch(){

    if(!selectedMatch){

        alert("Select Match");

        return;

    }

    if(tossWinner.value==""){

        alert("Select Toss Winner");

        return;

    }

    const tossWin = tossWinner.value;

    const decision = tossDecision.value;

    if(decision==="bat"){

        battingTeamName = tossWin;

        bowlingTeamName =
        tossWin===selectedMatch.team1
        ? selectedMatch.team2
        : selectedMatch.team1;

    }

    else{

        bowlingTeamName = tossWin;

        battingTeamName =
        tossWin===selectedMatch.team1
        ? selectedMatch.team2
        : selectedMatch.team1;

    }

    // Reset Score

    totalRuns = 0;

    wickets = 0;

    balls = 0;

    wides = 0;

    noBalls = 0;

    byes = 0;

    legByes = 0;

    // Reset Players

    strikerName = "";

    nonStrikerName = "";

    bowlerName = "";

    // Update Scoreboard

    battingTeam.innerText = battingTeamName;

    inningsText.innerText = "1st Innings";

    liveScore.innerText = "0 / 0";

    overs.innerText = "0.0 / 15";

    crr.innerText = "0.00";

    target.innerText = "--";

    needRuns.innerText = "--";

    rrr.innerText = "--";

    console.log("🏏 Match Started");

    console.log("Batting :", battingTeamName);

    console.log("Bowling :", bowlingTeamName);

    // Open Player Selection

    playerModal.style.display = "flex";

    loadPlayers();

}

// ================= INITIAL LOAD =================

loadMatches();

console.log("✅ PART 2 LOADED");

// =====================================================
// PART 3A
// LOAD PLAYERS FROM FIRESTORE
// =====================================================

async function loadPlayers() {

    try {

        // Reset Dropdowns

        strikerSelect.innerHTML =
        '<option value="">Select Striker</option>';

        nonStrikerSelect.innerHTML =
        '<option value="">Select Non-Striker</option>';

        bowlerSelect.innerHTML =
        '<option value="">Select Bowler</option>';

        // ===============================
        // LOAD BATTING PLAYERS
        // ===============================

        const battingQuery = query(
            collection(db, "registrations"),
            where("soldTo", "==", battingTeamName)
        );

        const battingSnap = await getDocs(battingQuery);

        battingSnap.forEach(docSnap => {

            const player = docSnap.data();

            strikerSelect.innerHTML += `
                <option value="${player.playerName}">
                    ${player.playerName}
                </option>
            `;

            nonStrikerSelect.innerHTML += `
                <option value="${player.playerName}">
                    ${player.playerName}
                </option>
            `;

        });

        // ===============================
        // LOAD BOWLING PLAYERS
        // ===============================

        const bowlingQuery = query(
            collection(db, "registrations"),
            where("soldTo", "==", bowlingTeamName)
        );

        const bowlingSnap = await getDocs(bowlingQuery);

        bowlingSnap.forEach(docSnap => {

            const player = docSnap.data();

            bowlerSelect.innerHTML += `
                <option value="${player.playerName}">
                    ${player.playerName}
                </option>
            `;

        });

        console.log("✅ Players Loaded");

    }

    catch(error){

        console.error(error);

        alert("Unable to load players.");

    }

}

// =====================================================
// PART 3B
// CONFIRM PLAYERS
// =====================================================

confirmPlayersBtn.onclick = () => {

    // Validation

    if (
        strikerSelect.value === "" ||
        nonStrikerSelect.value === "" ||
        bowlerSelect.value === ""
    ) {

        alert("Please Select All Players");

        return;

    }

    if (strikerSelect.value === nonStrikerSelect.value) {

        alert("Striker & Non-Striker Cannot Be Same");

        return;

    }

    // Save Selected Players

    strikerName = strikerSelect.value;

    nonStrikerName = nonStrikerSelect.value;

    bowlerName = bowlerSelect.value;

    // Reset Batsman Stats

    strikerRuns = 0;
    strikerBalls = 0;
    strikerFours = 0;
    strikerSixes = 0;

    nonStrikerRuns = 0;
    nonStrikerBalls = 0;

    // Reset Bowler Stats

    bowlerRuns = 0;
    bowlerBalls = 0;
    bowlerWickets = 0;

    // Update Current Players

    currentStriker.innerText = strikerName;

    currentNonStriker.innerText = nonStrikerName;

    currentBowler.innerText = bowlerName;

    // Update Score Cards

    strikerScore.innerText = "0 (0)";

    nonStrikerScore.innerText = "0 (0)";

    strikerBoundary.innerText = "4s : 0 | 6s : 0";

    bowlerFigure.innerText = "0-0 (0.0)";

    // Close Popup

    playerModal.style.display = "none";

    console.log("✅ Players Confirmed");

};
