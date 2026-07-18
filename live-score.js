
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

const bowlerModal = document.getElementById("bowlerModal");
const newBowlerSelect = document.getElementById("newBowlerSelect");
const confirmBowlerBtn = document.getElementById("confirmBowlerBtn");

// ================= VARIABLES =================

let matches = [];
let selectedMatch = null;

let battingTeamName = "";
let bowlingTeamName = "";

let totalRuns = 0;
let wickets = 0;
let balls = 0;

// ================= LOAD MATCHES =================

async function loadMatches() {

    matchSelect.innerHTML =
        `<option value="">-- Select Match --</option>`;

    matches = [];

    try {

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

        console.log("Matches Loaded :", matches.length);

    } catch (e) {

        console.error(e);
        alert("Failed to load matches.");

    }

}

// ================= MATCH CHANGE =================

matchSelect.addEventListener("change", () => {

    selectedMatch =
        matches.find(x => x.id === matchSelect.value);

    tossWinner.innerHTML =
        `<option value="">Select Team</option>`;

    if (!selectedMatch) return;

    tossWinner.innerHTML += `
        <option value="${selectedMatch.team1}">
        ${selectedMatch.team1}
        </option>
    `;

    tossWinner.innerHTML += `
        <option value="${selectedMatch.team2}">
        ${selectedMatch.team2}
        </option>
    `;

    console.log(selectedMatch);

});

// ================= LOAD =================

loadMatches();

console.log("PART 1 LOADED");
// =====================================================
// PART 2
// Start Match + Toss
// =====================================================

// HTML

const currentStriker = document.getElementById("currentStriker");
const currentNonStriker = document.getElementById("currentNonStriker");
const currentBowler = document.getElementById("currentBowler");

// Variables

let strikerName = "";
let nonStrikerName = "";
let bowlerName = "";

// Start Button

startMatchBtn.addEventListener("click", startMatch);

// ================= START MATCH =================

function startMatch() {

    if (!selectedMatch) {
        alert("Select Match");
        return;
    }

    if (tossWinner.value === "") {
        alert("Select Toss Winner");
        return;
    }

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

    // Reset Score

    totalRuns = 0;
    wickets = 0;
    balls = 0;

    battingTeam.innerText = battingTeamName;
    inningsText.innerText = "1st Innings";
    liveScore.innerText = "0 / 0";
    overs.innerText = "Overs : 0.0 / 15";

    crr.innerText = "0.00";
    target.innerText = "--";
    needRuns.innerText = "--";
    rrr.innerText = "--";

    console.log("Match Started");
    console.log("Batting :", battingTeamName);
    console.log("Bowling :", bowlingTeamName);

    // Player Selection Modal

    document.getElementById("playerModal").style.display = "flex";

    loadPlayers();

}
// =====================================================
// PART 3
// Load Players
// =====================================================

// HTML

const strikerSelect = document.getElementById("strikerSelect");
const nonStrikerSelect = document.getElementById("nonStrikerSelect");
const bowlerSelect = document.getElementById("bowlerSelect");

const confirmPlayersBtn =
document.getElementById("confirmPlayersBtn");

// ================= LOAD PLAYERS =================

async function loadPlayers() {

    strikerSelect.innerHTML =
    '<option value="">Select Striker</option>';

    nonStrikerSelect.innerHTML =
    '<option value="">Select Non-Striker</option>';

    bowlerSelect.innerHTML =
    '<option value="">Select Bowler</option>';

    // Batting Team

    const battingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", battingTeamName)
    );

    const battingSnap = await getDocs(battingQuery);

    battingSnap.forEach(docSnap => {

        const p = docSnap.data();

        strikerSelect.innerHTML += `
            <option value="${p.playerName}">
                ${p.playerName}
            </option>
        `;

        nonStrikerSelect.innerHTML += `
            <option value="${p.playerName}">
                ${p.playerName}
            </option>
        `;

    });

    // Bowling Team

    const bowlingQuery = query(
        collection(db, "registrations"),
        where("soldTo", "==", bowlingTeamName)
    );

    const bowlingSnap = await getDocs(bowlingQuery);

    bowlingSnap.forEach(docSnap => {

        const p = docSnap.data();

        bowlerSelect.innerHTML += `
            <option value="${p.playerName}">
                ${p.playerName}
            </option>
        `;

    });

}

// ================= CONFIRM PLAYERS =================

confirmPlayersBtn.addEventListener("click", () => {

    if (
        strikerSelect.value === "" ||
        nonStrikerSelect.value === "" ||
        bowlerSelect.value === ""
    ) {
        alert("Select all players.");
        return;
    }

    if (strikerSelect.value === nonStrikerSelect.value) {
        alert("Striker & Non-Striker cannot be same.");
        return;
    }

    strikerName = strikerSelect.value;
    nonStrikerName = nonStrikerSelect.value;
    bowlerName = bowlerSelect.value;

    document.getElementById("currentStriker").innerText = strikerName;
    document.getElementById("currentNonStriker").innerText = nonStrikerName;
    document.getElementById("currentBowler").innerText = bowlerName;

    document.getElementById("playerModal").style.display = "none";

    alert("Players Selected Successfully ✅");

});
// =====================================================
// PART 4
// Basic Scoring
// =====================================================

// Score Buttons

document.getElementById("btn0").onclick = () => addRuns(0);
document.getElementById("btn1").onclick = () => addRuns(1);
document.getElementById("btn2").onclick = () => addRuns(2);
document.getElementById("btn3").onclick = () => addRuns(3);
document.getElementById("btn4").onclick = () => addRuns(4);
document.getElementById("btn6").onclick = () => addRuns(6);

// Player Stats

let strikerRuns = 0;
let strikerBalls = 0;

let nonStrikerRuns = 0;
let nonStrikerBalls = 0;

let strikerFours = 0;
let strikerSixes = 0;

// ================= ADD RUNS =================

function addRuns(run) {

    // Team Score
    totalRuns += run;

    // Legal Ball
    balls++;

    // Batsman
    strikerRuns += run;
    strikerBalls++;

    if (run === 4) strikerFours++;
    if (run === 6) strikerSixes++;

    // Bowler
    bowlerRuns += run;
    bowlerBalls++;

    // Strike Rotate
    if (run % 2 === 1) {

        [strikerName, nonStrikerName] =
        [nonStrikerName, strikerName];

        [strikerRuns, nonStrikerRuns] =
        [nonStrikerRuns, strikerRuns];

        [strikerBalls, nonStrikerBalls] =
        [nonStrikerBalls, strikerBalls];

    }

    updateScoreBoard();
    updatePlayerBoard();

    checkOverFinish();

}

// ================= SCOREBOARD =================

function updateScoreBoard() {

    liveScore.innerText =
    `${totalRuns} / ${wickets}`;

    const over =
    Math.floor(balls / 6);

    const ball =
    balls % 6;

    overs.innerText =
    `Overs : ${over}.${ball} / 15`;

    const played =
    balls / 6;

    const rate =
    played === 0 ? 0 :
    (totalRuns / played);

    crr.innerText =
    rate.toFixed(2);

}

// ================= PLAYER BOARD =================

function updatePlayerBoard() {

    currentStriker.innerText =
    `${strikerName} (${strikerRuns})`;

    currentNonStriker.innerText =
    `${nonStrikerName} (${nonStrikerRuns})`;

}
// =====================================================
// PART 5
// Extras + Wicket
// =====================================================

// Buttons

document.getElementById("btnWide").onclick = addWide;
document.getElementById("btnNoBall").onclick = addNoBall;
document.getElementById("btnBye").onclick = addBye;
document.getElementById("btnLegBye").onclick = addLegBye;
document.getElementById("btnWicket").onclick = addWicket;

// ================= WIDE =================

function addWide() {

    totalRuns++;

    updateScoreBoard();

}

// ================= NO BALL =================

function addNoBall() {

    totalRuns++;

    updateScoreBoard();

}

// ================= BYE =================

function addBye() {

    totalRuns++;
    balls++;

    updateScoreBoard();

}

// ================= LEG BYE =================

function addLegBye() {

    totalRuns++;
    balls++;

    updateScoreBoard();

}

// ================= WICKET =================

function addWicket() {

    wickets++;
    balls++;

    liveScore.innerText =
    `${totalRuns} / ${wickets}`;

    updateScoreBoard();

    alert("Wicket!\nSelect New Batsman.");

    document.getElementById("playerModal").style.display = "flex";

}
