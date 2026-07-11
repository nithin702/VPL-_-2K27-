
// ===============================
// Firebase Imports
// ===============================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {

getFirestore,

collection,

getDocs,

query,

where,

orderBy,

limit

} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===============================
// Firebase Config
// ===============================

const firebaseConfig = {

apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

authDomain: "vpl-2k27.firebaseapp.com",

projectId: "vpl-2k27",

storageBucket: "vpl-2k27.firebasestorage.app",

messagingSenderId: "919265368604",

appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",

measurementId: "G-YL6CQ36HV6"

};

// ===============================
// Initialize Firebase
// ===============================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ===============================
// HTML Elements
// ===============================

const matchTitle = document.getElementById("matchTitle");

const matchDate = document.getElementById("matchDate");

const matchGround = document.getElementById("matchGround");

const team1Name = document.getElementById("team1Name");

const team1Score = document.getElementById("team1Score");

const team1Overs = document.getElementById("team1Overs");

const team2Name = document.getElementById("team2Name");

const team2Score = document.getElementById("team2Score");

const team2Overs = document.getElementById("team2Overs");

const winner = document.getElementById("winner");

const resultText = document.getElementById("resultText");

const momName = document.getElementById("momName");

const momPerformance = document.getElementById("momPerformance");

const battingScorecard = document.getElementById("battingScorecard");

const bowlingScorecard = document.getElementById("bowlingScorecard");

const matchSummary = document.getElementById("matchSummary");

// ===============================
// Variables
// ===============================

let currentMatch = null;
// ===============================
// Load Latest Completed Match
// ===============================

async function loadLatestResult() {

    try {

        const q = query(

            collection(db, "matches"),

            where("status", "==", "Completed"),

            limit(1)

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            matchTitle.innerHTML = "No Completed Match";

            resultText.innerHTML = "Match result not available.";

            return;

        }

        snapshot.forEach((docSnap) => {

            currentMatch = docSnap.data();

            currentMatch.id = docSnap.id;

        });

        displayMatch();

    } catch (error) {

        console.error("Result Load Error :", error);

    }

}

// ===============================
// Display Match Details
// ===============================

function displayMatch() {

    if (!currentMatch) return;

    matchTitle.innerHTML =
        `${currentMatch.team1} 🆚 ${currentMatch.team2}`;

    matchDate.innerHTML =
        `📅 ${currentMatch.matchDate || "-"}`;

    matchGround.innerHTML =
        `📍 ${currentMatch.ground || "-"}`;

    team1Name.innerHTML =
        currentMatch.team1 || "Team 1";

    team2Name.innerHTML =
        currentMatch.team2 || "Team 2";

    team1Score.innerHTML =
        currentMatch.team1Score || "0/0";

    team2Score.innerHTML =
        currentMatch.team2Score || "0/0";

    team1Overs.innerHTML =
        `Overs : ${currentMatch.team1Overs || "0.0"}`;

    team2Overs.innerHTML =
        `Overs : ${currentMatch.team2Overs || "0.0"}`;

    winner.innerHTML =
        `🏆 ${currentMatch.winner || "Winner Not Available"}`;

    resultText.innerHTML =
        currentMatch.result || "Result Not Available";

}
// ===============================
// Man of the Match
// ===============================

function displayManOfTheMatch() {

    if (!currentMatch) return;

    momName.innerHTML =
        currentMatch.manOfTheMatch || "Not Selected";

    momPerformance.innerHTML =
        currentMatch.manOfTheMatchPerformance ||
        "Performance Not Available";

}

// ===============================
// Match Summary
// ===============================

function displayMatchSummary() {

    if (!currentMatch) return;

    matchSummary.innerHTML = `

    <b>${currentMatch.team1}</b>

    scored

    <b>${currentMatch.team1Score || "0/0"}</b>

    in

    <b>${currentMatch.team1Overs || "0.0"} Overs</b>

    <br><br>

    <b>${currentMatch.team2}</b>

    scored

    <b>${currentMatch.team2Score || "0/0"}</b>

    in

    <b>${currentMatch.team2Overs || "0.0"} Overs</b>

    <br><br>

    🏆

    <b>${currentMatch.result || "Result Not Available"}</b>

    `;

}

// ===============================
// Batting Scorecard
// ===============================

function displayBattingScorecard() {

    battingScorecard.innerHTML = "";

    if (!currentMatch.battingScorecard) {

        battingScorecard.innerHTML =
        "<p>No Batting Scorecard Available.</p>";

        return;

    }

    battingScorecard.innerHTML =
        currentMatch.battingScorecard;

}

// ===============================
// Bowling Scorecard
// ===============================

function displayBowlingScorecard() {

    bowlingScorecard.innerHTML = "";

    if (!currentMatch.bowlingScorecard) {

        bowlingScorecard.innerHTML =
        "<p>No Bowling Scorecard Available.</p>";

        return;

    }

    bowlingScorecard.innerHTML =
        currentMatch.bowlingScorecard;

}

// ===============================
// Display Everything
// ===============================

function loadResultPage() {

    displayMatch();

    displayManOfTheMatch();

    displayMatchSummary();

    displayBattingScorecard();

    displayBowlingScorecard();

}
// ===============================
// Auto Refresh Result
// ===============================

async function autoRefreshResult() {

    try {

        await loadLatestResult();

        loadResultPage();

        console.log("✅ Result Updated");

    } catch (error) {

        console.error("Auto Refresh Error :", error);

    }

}

// ===============================
// Network Status
// ===============================

window.addEventListener("online", () => {

    console.log("🌐 Internet Connected");

    autoRefreshResult();

});

window.addEventListener("offline", () => {

    console.log("❌ Internet Disconnected");

    matchTitle.innerHTML = "Offline";

    resultText.innerHTML =
    "No Internet Connection";

});

// ===============================
// Auto Refresh Every 10 Seconds
// ===============================

setInterval(() => {

    autoRefreshResult();

}, 10000);

// ===============================
// Refresh When Page Becomes Active
// ===============================

document.addEventListener("visibilitychange", async () => {

    if (!document.hidden) {

        await autoRefreshResult();

    }

});

// ===============================
// Initialize Result Page
// ===============================

async function initializeResultPage() {

    try {

        console.log("🏆 Loading Result...");

        await loadLatestResult();

        loadResultPage();

        console.log("✅ Result Page Ready");

    } catch (error) {

        console.error(error);

        matchTitle.innerHTML =
        "Unable to Load Result";

        resultText.innerHTML =
        "Please try again later.";

    }

}

// ===============================
// Start Application
// ===============================

initializeResultPage();

console.log("🚀 VPL 2K27 Result Module Loaded");
