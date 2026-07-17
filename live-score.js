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

// ================= VARIABLES =================

let allMatches = [];
let selectedMatch = null;

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

document.getElementById("startMatchBtn").onclick = function () {
    alert("Start Button Working");
};

// ================= START MATCH =================

function startMatch() {

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

    const modal = document.getElementById("playerModal");

    if (modal) {

        modal.style.display = "flex";

    }

}
