import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= Firebase =================

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

// ================= Elements =================

const matchSelect = document.getElementById("matchSelect");
const scoreBoard = document.getElementById("scoreBoard");

const playerSelection = document.getElementById("playerSelection");

const striker = document.getElementById("striker");
const nonStriker = document.getElementById("nonStriker");
const bowler = document.getElementById("bowler");

const startScoring = document.getElementById("startScoring");

const backBtn = document.getElementById("backBtn");

// ================= Variables =================

let allMatches = [];
let allPlayers = [];

let selectedMatch = null;

let currentStriker = null;
let currentNonStriker = null;
let currentBowler = null;

let runs = 0;
let wickets = 0;
let balls = 0;

// ================= Back Button =================

backBtn.onclick = () => {
    window.location.href = "admin.html";
};

// ================= Load Matches =================

async function loadMatches() {

    matchSelect.innerHTML =
    `<option value="">-- Select Match --</option>`;

    allMatches = [];

    try {

        const snapshot = await getDocs(collection(db, "matches"));

        snapshot.forEach((docSnap) => {

            const match = docSnap.data();

            match.id = docSnap.id;

            allMatches.push(match);

            matchSelect.innerHTML += `
            <option value="${match.id}">
            ${match.matchNumber} | ${match.team1} 🆚 ${match.team2}
            </option>`;
        });

        console.log("Matches Loaded :", allMatches.length);

    } catch (error) {

        console.error(error);

        alert("Unable to load matches.");

    }

}
// ================= Load Players =================

async function loadPlayers(teamName) {

    allPlayers = [];

    striker.innerHTML =
    `<option value="">Select Striker</option>`;

    nonStriker.innerHTML =
    `<option value="">Select Non-Striker</option>`;

    bowler.innerHTML =
    `<option value="">Select Bowler</option>`;

    try {

        const q = query(
            collection(db, "registrations"),
            where("soldTo", "==", teamName)
        );

        const snapshot = await getDocs(q);

        snapshot.forEach((docSnap) => {

            const player = docSnap.data();

            player.id = docSnap.id;

            allPlayers.push(player);

            striker.innerHTML += `
            <option value="${player.id}">
            ${player.playerName}
            </option>`;

            nonStriker.innerHTML += `
            <option value="${player.id}">
            ${player.playerName}
            </option>`;

            bowler.innerHTML += `
            <option value="${player.id}">
            ${player.playerName}
            </option>`;

        });

        console.log("Players Loaded :", allPlayers.length);

    } catch (error) {

        console.error(error);

        alert("Unable to load players.");

    }

}

// ================= Match Selection =================

matchSelect.addEventListener("change", async () => {

    const id = matchSelect.value;

    if (id === "") {

        playerSelection.style.display = "none";

        scoreBoard.innerHTML = `
        <p>Select a match to start scoring...</p>`;

        return;

    }

    selectedMatch = allMatches.find(
        match => match.id === id
    );

    runs = 0;
    wickets = 0;
    balls = 0;

    await loadPlayers(selectedMatch.team1);

    playerSelection.style.display = "block";

    scoreBoard.innerHTML = `
    <p>
    Select Striker, Non-Striker & Bowler,
    then click <b>Start Scoring</b>.
    </p>`;

});

// ================= Start Scoring =================

startScoring.addEventListener("click", () => {

    if (
        striker.value === "" ||
        nonStriker.value === "" ||
        bowler.value === ""
    ) {

        alert("Please select all players.");

        return;

    }

    if (striker.value === nonStriker.value) {

        alert("Striker and Non-Striker cannot be the same.");

        return;

    }

    currentStriker =
    allPlayers.find(player => player.id === striker.value);

    currentNonStriker =
    allPlayers.find(player => player.id === nonStriker.value);

    currentBowler =
    allPlayers.find(player => player.id === bowler.value);

    playerSelection.style.display = "none";

    showScoreBoard();

});
// ================= Show Scoreboard =================

function showScoreBoard() {

    scoreBoard.innerHTML = `

    <h2>${selectedMatch.team1}</h2>

    <h3>
    🏏 ${currentStriker.playerName}*
    &nbsp;&nbsp;|&nbsp;&nbsp;
    ${currentNonStriker.playerName}
    </h3>

    <h4>
    🎯 Bowler : ${currentBowler.playerName}
    </h4>

    <div class="score">
        <span id="scoreText">
        ${runs}/${wickets}
        </span>
    </div>

    <div class="overs">
        Overs :
        <span id="oversText">
        ${Math.floor(balls/6)}.${balls%6}
        </span>
    </div>

    <div class="btn-grid">

        <button class="runBtn" onclick="addRuns(0)">
        0
        </button>

        <button class="runBtn" onclick="addRuns(1)">
        1
        </button>

        <button class="runBtn" onclick="addRuns(2)">
        2
        </button>

        <button class="runBtn" onclick="addRuns(3)">
        3
        </button>

        <button class="runBtn" onclick="addRuns(4)">
        4
        </button>

        <button class="runBtn" onclick="addRuns(6)">
        6
        </button>

        <button class="extraBtn" onclick="wideBall()">
        Wide
        </button>

        <button class="extraBtn" onclick="noBall()">
        No Ball
        </button>

        <button class="wicketBtn" onclick="addWicket()">
        Wicket
        </button>

    </div>

    <br>

    <button
    class="finishBtn"
    onclick="finishInnings()">

    🏁 Finish Innings

    </button>

    `;

}

// ================= Refresh Score =================

function refreshScore() {

    document.getElementById("scoreText").innerHTML =
    `${runs}/${wickets}`;

    document.getElementById("oversText").innerHTML =
    `${Math.floor(balls/6)}.${balls%6}`;

    checkOverComplete();

}
// ================= Update Batsman Stats =================

async function updateBatsmanStats(playerId, runScored) {

    const player = allPlayers.find(
        p => p.id === playerId
    );

    if (!player) return;

    const totalRuns =
        (player.runs || 0) + runScored;

    const totalBalls =
        (player.balls || 0) + 1;

    const totalFours =
        (player.fours || 0) + (runScored === 4 ? 1 : 0);

    const totalSixes =
        (player.sixes || 0) + (runScored === 6 ? 1 : 0);

    const strikeRate =
        totalBalls > 0
        ? Number(((totalRuns / totalBalls) * 100).toFixed(2))
        : 0;

    await updateDoc(
        doc(db, "registrations", playerId),
        {

            runs: totalRuns,
            balls: totalBalls,
            fours: totalFours,
            sixes: totalSixes,
            strikeRate: strikeRate

        }
    );

    // Local Update

    player.runs = totalRuns;
    player.balls = totalBalls;
    player.fours = totalFours;
    player.sixes = totalSixes;
    player.strikeRate = strikeRate;

}

// ================= Update Bowler Stats =================

async function updateBowlerStats(
    playerId,
    isWicket = false,
    runsGiven = 0
) {

    const player = allPlayers.find(
        p => p.id === playerId
    );

    if (!player) return;

    const totalWickets =
        (player.wickets || 0) +
        (isWicket ? 1 : 0);

    const totalRunsConceded =
        (player.runsConceded || 0) +
        runsGiven;

    await updateDoc(
        doc(db, "registrations", playerId),
        {

            wickets: totalWickets,
            runsConceded: totalRunsConceded

        }
    );

    // Local Update

    player.wickets = totalWickets;
    player.runsConceded = totalRunsConceded;

}
// ================= Add Runs =================

window.addRuns = async function(run) {

    runs += run;
    balls++;

    // Update Batsman Stats
    await updateBatsmanStats(
        currentStriker.id,
        run
    );

    // Update Bowler Stats
    await updateBowlerStats(
        currentBowler.id,
        false,
        run
    );

    // Strike Change on Odd Runs
    if (run === 1 || run === 3) {

        let temp = currentStriker;
        currentStriker = currentNonStriker;
        currentNonStriker = temp;

        showScoreBoard();

    } else {

        refreshScore();

    }

};

// ================= Wicket =================

window.addWicket = async function() {

    wickets++;
    balls++;

    await updateBowlerStats(
        currentBowler.id,
        true,
        0
    );

    refreshScore();

    alert("🏏 Wicket!\nPlease select the next batsman.");

};

// ================= Wide Ball =================

window.wideBall = async function() {

    runs++;

    // Wide doesn't count as a ball

    await updateBowlerStats(
        currentBowler.id,
        false,
        1
    );

    refreshScore();

};

// ================= No Ball =================

window.noBall = async function() {

    runs++;

    // No Ball doesn't count as a ball

    await updateBowlerStats(
        currentBowler.id,
        false,
        1
    );

    refreshScore();

};
// ================= Over Complete =================

function checkOverComplete() {

    if (balls > 0 && balls % 6 === 0) {

        // Change Strike

        let temp = currentStriker;
        currentStriker = currentNonStriker;
        currentNonStriker = temp;

        alert("🏏 Over Completed!\nPlease select a new bowler.");

        // Reset Bowler

        bowler.value = "";

        playerSelection.style.display = "block";

        scoreBoard.innerHTML = `

        <h2>🏏 Over Completed</h2>

        <h3>
        Score : ${runs}/${wickets}
        </h3>

        <h3>
        Overs : ${Math.floor(balls/6)}.${balls%6}
        </h3>

        <br>

        <label>Select Next Bowler</label><br><br>

        ${bowler.outerHTML}

        <br><br>

        <button id="continueBtn">

        ▶ Continue Innings

        </button>

        `;

        const newBowler =
        document.getElementById("bowler");

        document
        .getElementById("continueBtn")
        .addEventListener("click", () => {

            if (newBowler.value === "") {

                alert("Please select a bowler.");

                return;

            }

            currentBowler = allPlayers.find(
                p => p.id === newBowler.value
            );

            playerSelection.style.display = "none";

            showScoreBoard();

        });

    }

}
// ================= Finish Innings =================

window.finishInnings = async function () {

    if (!selectedMatch) {
        alert("No Match Selected!");
        return;
    }

    if (!confirm("🏁 Finish this innings?")) return;

    try {

        await updateDoc(doc(db, "matches", selectedMatch.id), {

            liveRuns: runs,
            liveWickets: wickets,
            liveOvers: `${Math.floor(balls / 6)}.${balls % 6}`,

            battingTeam: selectedMatch.team1,
            bowlingTeam: selectedMatch.team2,

            inningsCompleted: true,
            status: "Completed",

            lastUpdated: new Date().toISOString()

        });

        alert("🏆 Innings Finished Successfully!");

        playerSelection.style.display = "none";

        scoreBoard.innerHTML = `

        <h2>🏆 Match Completed</h2>

        <h3>${selectedMatch.team1}</h3>

        <h1>${runs}/${wickets}</h1>

        <h3>Overs : ${Math.floor(balls/6)}.${balls%6}</h3>

        <br>

        <button onclick="location.reload()">

        🔄 Start New Match

        </button>

        `;

    } catch (error) {

        console.error(error);

        alert("❌ Error Saving Match!");

    }

};

// ================= Reset Score =================

function resetScore() {

    runs = 0;
    wickets = 0;
    balls = 0;

    currentStriker = null;
    currentNonStriker = null;
    currentBowler = null;

}

// ================= Reload Match List =================

async function reloadMatches() {

    resetScore();

    matchSelect.value = "";

    playerSelection.style.display = "none";

    scoreBoard.innerHTML = `
    <p>Select a match to start scoring...</p>
    `;

    await loadMatches();

}

// ================= Auto Refresh =================

setInterval(async () => {

    try {

        await loadMatches();

    } catch (error) {

        console.error(error);

    }

}, 30000);

// ================= Initialize =================

async function initializePage() {

    try {

        await loadMatches();

        console.log("✅ Live Score Loaded Successfully");

    } catch (error) {

        console.error(error);

        alert("Unable to load Live Score.");

    }

}

initializePage();
