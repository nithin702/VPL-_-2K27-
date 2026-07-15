
// =====================================================
// 🏏 VPL 2K27 LIVE SCORE SYSTEM
// PART 1 - Firebase + Variables + Match Loading
// =====================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
doc,
getDoc,
updateDoc,
setDoc,
query,
where
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
// DOM ELEMENTS
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
// GLOBAL VARIABLES
// =====================================================

let allMatches = [];
let selectedMatch = null;

let battingTeamName = "";
let bowlingTeamName = "";

let totalRuns = 0;
let totalWickets = 0;

let completedOvers = 0;
let currentBalls = 0;

let targetScore = 0;

let strikerPlayer = null;
let nonStrikerPlayer = null;
let bowlerPlayer = null;

// =====================================================
// LOAD MATCHES
// =====================================================

async function loadMatches(){

try{

matchSelect.innerHTML =
'<option value="">-- Select Match --</option>';

allMatches = [];

const q = query(
collection(db,"matches"),
where("status","==","Not Started")
);

const snapshot = await getDocs(q);

snapshot.forEach((docSnap)=>{

const match = docSnap.data();

match.id = docSnap.id;

allMatches.push(match);

const option = document.createElement("option");

option.value = match.id;

option.textContent =
`${match.matchNumber} | ${match.team1} vs ${match.team2}`;

matchSelect.appendChild(option);

});

console.log("Matches Loaded :",allMatches.length);

}catch(error){

console.error(error);

alert("Unable to load scheduled matches.");

}

}

// =====================================================
// MATCH SELECT
// =====================================================

matchSelect.addEventListener("change",()=>{

const id = matchSelect.value;

selectedMatch =
allMatches.find(m=>m.id===id);

if(!selectedMatch) return;

tossWinner.innerHTML="";

const option1=document.createElement("option");
option1.value=selectedMatch.team1;
option1.textContent=selectedMatch.team1;

const option2=document.createElement("option");
option2.value=selectedMatch.team2;
option2.textContent=selectedMatch.team2;

tossWinner.appendChild(option1);
tossWinner.appendChild(option2);

console.log(selectedMatch);

});

// =====================================================
// INITIALIZE
// =====================================================

loadMatches();

console.log("✅ LIVE SCORE PART 1 LOADED");
