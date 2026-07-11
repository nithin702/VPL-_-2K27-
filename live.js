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

const matchStatus = document.getElementById("matchStatus");

const score = document.getElementById("score");

const overs = document.getElementById("overs");

const target = document.getElementById("target");

const crr = document.getElementById("crr");

const rrr = document.getElementById("rrr");

const strikerName = document.getElementById("strikerName");

const strikerScore = document.getElementById("strikerScore");

const nonStrikerName = document.getElementById("nonStrikerName");

const nonStrikerScore = document.getElementById("nonStrikerScore");

const bowlerName = document.getElementById("bowlerName");

const bowlerFigures = document.getElementById("
      // ===============================
// Load Current Live Match
// ===============================

async function loadLiveMatch() {

    try {

        const q = query(

            collection(db, "matches"),

            where("status", "==", "Live"),

            limit(1)

        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {

            matchTitle.innerHTML = "No Live Match";

            matchStatus.innerHTML = "Match has not started.";

            score.innerHTML = "--/--";

            overs.innerHTML = "Overs : --";

            target.innerHTML = "Target : --";

            summary.innerHTML = "Please wait for the next live match.";

            result.innerHTML = "No Result";

            return;

        }

        snapshot.forEach((docSnap) => {

            currentMatch = docSnap.data();

            currentMatch.id = docSnap.id;

        });

        updateLive
      // ===============================
// Calculate CRR & RRR
// ===============================

function updateRunRates() {

    if (!currentMatch) return;

    let oversText = currentMatch.liveOvers || "0.0";

    let parts = oversText.split(".");

    let completedOvers = parseInt(parts[0]) || 0;

    let ballsInOver = parseInt(parts[1]) || 0;

    let totalBalls = (completedOvers * 6) + ballsInOver;

    // Current Run Rate
    let currentRunRate = 0;

    if (totalBalls > 0) {

        currentRunRate =
        ((currentMatch.liveRuns || 0) / (totalBalls / 6));

    }

    crr.innerHTML = currentRunRate.toFixed(2);

    // Required Run Rate
    if (currentMatch.target) {

        const targetRuns = parseInt(currentMatch.target);

        const runsNeeded =
        targetRuns - (currentMatch.liveRuns || 0);

        const ballsLeft = 120 - totalBalls;

        if (ballsLeft > 0) {

            const requiredRunRate =
            (runsNeeded * 6) / ballsLeft;

            rrr.innerHTML =
            requiredRunRate.toFixed(2);

        } else {

            rrr.innerHTML = "0.00";

        }

    } else {

        rrr.innerHTML = "--";

    }

}

// ===============================
// Match Summary
// ===============================

function updateSummary() {

    if (!currentMatch) return;

    summary.innerHTML =
      // ===============================
// Load Live Players
// ===============================

async function loadPlayerDetails() {

    if (!currentMatch) return;

    // Striker

    strikerName.innerHTML =
    currentMatch.strikerName || "Striker";

    strikerScore.innerHTML =
    `${currentMatch.strikerRuns || 0} (${currentMatch.strikerBalls || 0})`;

    // Non-Striker

    nonStrikerName.innerHTML =
    currentMatch.nonStrikerName || "Non Striker";

    nonStrikerScore.innerHTML =
    `${currentMatch.nonStrikerRuns || 0} (${currentMatch.nonStrikerBalls || 0})`;

    // Bowler

    bowlerName.innerHTML =
    currentMatch.bowlerName || "Bowler";

    bowlerFigures.innerHTML =
    `${currentMatch.bowlerOvers || "0"} - ${currentMatch.bowlerMaidens || 0} - ${currentMatch.bowlerRuns || 0} - ${currentMatch.bowlerWickets || 0}`;

}

// ===============================
// Last 6 Balls
// ===============================

function updateLastBalls() {

    if (!currentMatch) return;

    if (
        currentMatch.lastBalls &&
        currentMatch.lastBalls.length > 0
    ) {

        lastBalls.innerHTML =
        currentMatch.lastBalls.join(" ");

    } else {

        lastBalls.innerHTML = "-";

    }

}

// ===============================
// Refresh Complete UI
// ===============================

function refreshLivePage() {

    if (!currentMatch) return;

    update
  // ===============================
// Match Result
// ===============================

function updateMatchResult() {

    if (!currentMatch) return;

    if (currentMatch.status === "Completed") {

        result.innerHTML = `
        🏆 ${currentMatch.winner || "Winner Not Available"}
        <br>
        ${currentMatch.result || "Match Finished"}
        `;

        matchStatus.innerHTML = "✅ MATCH COMPLETED";

    } else if (currentMatch.status === "Live") {

        result.innerHTML = "🔴 Match In Progress";

        matchStatus.innerHTML = "🔴 LIVE";

    } else {

        result.innerHTML = "⏳ Match Yet To Start";

        matchStatus.innerHTML = "Not Started";

    }

}

// ===============================
// Refresh Entire Page
// ===============================

function refreshLivePage() {

    if (!currentMatch) return;

    updateLiveUI();

    loadPlayerDetails();

    updateLastBalls();

    updateMatchResult();

}

// ===============================
// Initialize Page
// ===============================

async function initializeLivePage() {

    await loadLiveMatch();

    refreshLivePage();

    startAutoRefresh();

}

// ===============================
// Start
// ===============================

initializeLivePage();
  // ===============================
// Advanced Match Information
// ===============================

function updateAdvancedStats() {

    if (!currentMatch) return;

    // Toss Information
    if (currentMatch.tossWinner && currentMatch.tossDecision) {

        summary.innerHTML += `

        <br><br>

        🪙 Toss :
        <b>${currentMatch.tossWinner}</b>

        elected to

        <b>${currentMatch.tossDecision}</b>

        `;

    }

    // Innings
    if (currentMatch.innings) {

        summary.innerHTML += `

        <br>

        🏏 Innings :
        <b>${currentMatch.innings}</b>

        `;

    }

    // Target Chase
    if (currentMatch.target) {

        let oversText = currentMatch.liveOvers || "0.0";

        let over = parseInt(oversText.split(".")[0]) || 0;

        let ball = parseInt(oversText.split(".")[1]) || 0;

        let totalBalls = (over * 6) + ball;

        let ballsLeft = 120 - totalBalls;

        let runsNeeded =
        currentMatch.target - (currentMatch.liveRuns || 0);

        if (runsNeeded > 0 && ballsLeft > 0) {

            summary.innerHTML += `

            <br>

            🎯 Need

            <b>${runsNeeded}</b>

            runs from

            <b>${ballsLeft}</b>

            balls.

            `;

        }

    }

}

// ===============================
// Refresh Complete Live Page
// ===============================

function refreshLivePage() {

    if (!currentMatch) return;

    updateLiveUI();

    loadPlayerDetails();

    updateLastBalls();

    updateMatchResult();

    updateAdvancedStats();

}
  // ===============================
// Winning Percentage
// ===============================

function updateWinningPercentage() {

    if (!currentMatch) return;

    if (!currentMatch.target) return;

    const targetRuns = parseInt(currentMatch.target);

    const currentRuns = currentMatch.liveRuns || 0;

    let percentage = Math.min(
        100,
        Math.round((currentRuns / targetRuns) * 100)
    );

    summary.innerHTML += `

    <br>

    📈 Winning Progress :
    <b>${percentage}%</b>

    `;

}

// ===============================
// Partnership
// ===============================

function updatePartnership() {

    if (!currentMatch) return;

    summary.innerHTML += `

    <br>

    🤝 Partnership :
    <b>${currentMatch.partnershipRuns || 0}</b>
    Runs

    `;

}

// ===============================
// Boundaries
// ===============================

function updateBoundaries() {

    if (!currentMatch) return;

    summary.innerHTML += `

    <br>

    💥 Fours :
    <b>${currentMatch.totalFours || 0}</b>

    &nbsp;&nbsp;

    🚀 Sixes :
    <b>${currentMatch.totalSixes || 0}</b>

    `;

}

// ===============================
// Recent Overs
// ===============================

function updateRecentOvers() {

    if (!currentMatch) return;

    if (currentMatch.recentOvers) {

        summary.innerHTML += `

        <br>

        🏏 Recent Overs :

        <b>${currentMatch.recentOvers}</b>

        `;

    }

}

// ===============================
// Final Refresh
// ===============================

function refreshLivePage() {

    if (!currentMatch) return;

    updateLiveUI();

    loadPlayerDetails();

    updateLastBalls();

    updateMatchResult();

    updateAdvancedStats();

    updateWinningPercentage();

    updatePartnership();

    updateBoundaries();

    updateRecentOvers();

}
 // ===============================
// Auto Refresh Live Match
// ===============================

async function autoRefreshLiveMatch() {

    try {

        await loadLiveMatch();

        refreshLivePage();

        console.log("🔄 Live Score Updated");

    } catch (error) {

        console.error("Auto Refresh Error :", error);

    }

}

// ===============================
// Network Status
// ===============================

window.addEventListener("online", () => {

    console.log("✅ Internet Connected");

    autoRefreshLiveMatch();

});

window.addEventListener("offline", () => {

    console.log("❌ Internet Disconnected");

    matchStatus.innerHTML = "⚠ Offline Mode";

});

// ===============================
// Auto Refresh Every 5 Seconds
// ===============================

setInterval(() => {

    autoRefreshLiveMatch();

}, 5000);

// ===============================
// Page Visibility Refresh
// ===============================

document.addEventListener("visibilitychange", async () => {

    if (!document.hidden) {

        await autoRefreshLiveMatch();

    }

});

// ===============================
// Initialize Application
// ===============================

async function initializeApp() {

    try {

        console.log("🏏 Loading VPL 2K27 Live Score...");

        await loadLiveMatch();

        refreshLivePage();

        console.log("✅ Live Score Ready");

    } catch (error) {

        console.error(error);

        matchTitle.innerHTML = "Error Loading Match";

        summary.innerHTML =
        "Unable to connect to Firebase.";

    }

}

// ===============================
// Start Application
// ===============================

initializeApp();

console.log("🚀 VPL 2K27 Live Score V3 Loaded Successfully"); 
