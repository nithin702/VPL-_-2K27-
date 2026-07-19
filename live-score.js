
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
