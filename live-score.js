
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

    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"

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
