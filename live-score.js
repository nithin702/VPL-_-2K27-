// =====================================================
// VPL 2K27 LIVE SCORE
// PART 1
// Firebase + Load Scheduled Matches
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
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

// ================= HTML =================

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
const strikerScore =
document.getElementById("strikerScore");

const nonStrikerScore =
document.getElementById("nonStrikerScore");

const strikerBoundary =
document.getElementById("strikerBoundary");

const bowlerFigure =
document.getElementById("bowlerFigure");

// ================= VARIABLES =================

let allMatches = [];
let selectedMatch = null;
let battingTeamName = "";
let bowlingTeamName = "";

// ================= LOAD MATCHES =================

async function loadMatches() {

    try {

        matchSelect.innerHTML =
            '<option value="">-- Select Match --</option>';

        allMatches = [];

        const snapshot = await getDocs(collection(db, "matches"));

        snapshot.forEach((docSnap) => {

            const match = docSnap.data();

            // Only Scheduled Matches
            if (match.status !== "Not Started") return;

            match.id = docSnap.id;

            allMatches.push(match);

            const option = document.createElement("option");

            option.value = match.id;

            option.textContent =
                `${match.matchNumber} | ${match.team1} vs ${match.team2}`;

            matchSelect.appendChild(option);

        });

        console.log("✅ Matches Loaded :", allMatches.length);

    } catch (error) {

        console.error(error);

        alert("Unable to load matches.");

    }

}

// ================= MATCH SELECT =================

matchSelect.addEventListener("change", () => {

    const id = matchSelect.value;

    selectedMatch =
        allMatches.find(match => match.id === id);

    if (!selectedMatch) return;

    tossWinner.innerHTML = "";

    const team1 = document.createElement("option");
    team1.value = selectedMatch.team1;
    team1.textContent = selectedMatch.team1;

    const team2 = document.createElement("option");
    team2.value = selectedMatch.team2;
    team2.textContent = selectedMatch.team2;

    tossWinner.appendChild(team1);
    tossWinner.appendChild(team2);

    console.log("Selected Match :", selectedMatch);

});

// ================= INITIAL LOAD =================

loadMatches();

console.log("✅ LIVE SCORE PART 1 LOADED");
// =====================================================
// PART 2
// Toss + Start Match
// =====================================================

// Match Start Button

startMatchBtn.addEventListener("click", startMatch);

// ================= START MATCH =================

async function startMatch() {

    if (!selectedMatch) {
        alert("Please select a match.");
        return;
    }

    if (tossWinner.value === "") {
        alert("Please select Toss Winner.");
        return;
    }

    const tossWin = tossWinner.value;
    const decision = tossDecision.value;

    // Toss Logic

    if (decision === "bat") {

        battingTeamName = tossWin;

        bowlingTeamName =
            (tossWin === selectedMatch.team1)
            ? selectedMatch.team2
            : selectedMatch.team1;

    } else {

        bowlingTeamName = tossWin;

        battingTeamName =
            (tossWin === selectedMatch.team1)
            ? selectedMatch.team2
            : selectedMatch.team1;

    }

    // Update Screen

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

    // Open Player Selection
    
    await loadPlayers();
    const modal = document.getElementById("playerModal");

    if (modal) {

        modal.style.display = "flex";

    }

}

// ================= PLAYER DROPDOWNS =================

const strikerSelect = document.getElementById("strikerSelect");
const nonStrikerSelect = document.getElementById("nonStrikerSelect");
const bowlerSelect = document.getElementById("bowlerSelect");

async function loadPlayers() {

    strikerSelect.innerHTML =
        '<option value="">Select Striker</option>';

    nonStrikerSelect.innerHTML =
        '<option value="">Select Non-Striker</option>';

    bowlerSelect.innerHTML =
        '<option value="">Select Bowler</option>';

    // Batting Team Players

    const battingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", battingTeamName)
    );

    const battingSnap = await getDocs(battingQuery);

    battingSnap.forEach((docSnap) => {

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

    // Bowling Team Players

    const bowlingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", bowlingTeamName)
    );

    const bowlingSnap = await getDocs(bowlingQuery);

    bowlingSnap.forEach((docSnap) => {

        const p = docSnap.data();

        bowlerSelect.innerHTML +=
            `<option value="${p.playerName}">
                ${p.playerName}
            </option>`;
    });

}
// =====================================================
// PART 3B
// Confirm Players
// =====================================================

const confirmPlayersBtn =
document.getElementById("confirmPlayersBtn");

const currentStriker =
document.getElementById("currentStriker");

const currentNonStriker =
document.getElementById("currentNonStriker");

const currentBowler =
document.getElementById("currentBowler");

let strikerName = "";
let nonStrikerName = "";
let bowlerName = "";

confirmPlayersBtn.addEventListener("click", () => {

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

    strikerName = strikerSelect.value;
    nonStrikerName = nonStrikerSelect.value;
    bowlerName = bowlerSelect.value;

    currentStriker.innerText = strikerName;
    currentNonStriker.innerText = nonStrikerName;
    currentBowler.innerText = bowlerName;

    document.getElementById("playerModal").style.display = "none";

    alert("Players Selected Successfully ✅");

});
// =====================================================
// PART 4
// SCORING
// =====================================================

let totalRuns = 0;
let wickets = 0;
let balls = 0;

let strikerRuns = 0;
let strikerBalls = 0;

document.getElementById("btn0").onclick = () => addRuns(0);
document.getElementById("btn1").onclick = () => addRuns(1);
document.getElementById("btn2").onclick = () => addRuns(2);
document.getElementById("btn3").onclick = () => addRuns(3);
document.getElementById("btn4").onclick = () => addRuns(4);
document.getElementById("btn6").onclick = () => addRuns(6);

function addRuns(run) {

    totalRuns += run;

    strikerRuns += run;
    strikerBalls++;

    balls++;

    updateScoreBoard();

}
function updateScoreBoard() {

    liveScore.innerText =
        `${totalRuns} / ${wickets}`;

    let over =
        Math.floor(balls / 6);

    let ball =
        balls % 6;

    overs.innerText =
        `Overs : ${over}.${ball} / 15`;

    let completedOvers =
        balls / 6;

    if (completedOvers > 0) {

        crr.innerText =
            (totalRuns / completedOvers).toFixed(2);

    } else {

        crr.innerText = "0.00";

    }

}
document.getElementById("btn0").onclick = () => {
    alert("0 Button Working");
};

document.getElementById("btn4").onclick = () => {
    alert("4 Button Working");
};

