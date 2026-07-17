
// =====================================================
// VPL 2K27 LIVE SCORE
// PART 1
// Firebase + Load Scheduled Matches
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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
