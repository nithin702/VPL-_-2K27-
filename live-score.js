import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ================= Firebase Config =================

const firebaseConfig = {
  apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",
  authDomain: "vpl-2k27.firebaseapp.com",
  projectId: "vpl-2k27",
  storageBucket: "vpl-2k27.firebasestorage.app",
  messagingSenderId: "919265368604",
  appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",
  measurementId: "G-YL6CQ36HV6"
};

// ================= Initialize Firebase =================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// ================= HTML Elements =================

const matchSelect = document.getElementById("matchSelect");

const scoreBoard = document.getElementById("scoreBoard");

// ================= Variables =================

let allMatches = [];

let selectedMatch = null;

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

    window.location.href = "admin.html";

};

// ================= Load Matches =================

async function loadMatches(){

    const snapshot = await getDocs(collection(db,"matches"));

    allMatches = [];

    matchSelect.innerHTML = `
    <option value="">
    -- Select Match --
    </option>`;

    snapshot.forEach((document)=>{

        const match = document.data();

        match.id = document.id;

        allMatches.push(match);

        matchSelect.innerHTML += `
        <option value="${document.id}">
        ${match.matchNumber} | ${match.team1} vs ${match.team2}
        </option>`;

    });

}

// ================= Match Selection =================

matchSelect.addEventListener("change", () => {

    const id = matchSelect.value;

    if (!id) {

        scoreBoard.innerHTML = `
        <p>Select a match to start scoring...</p>`;

        return;

    }

    selectedMatch = allMatches.find(match => match.id === id);

    showScoreBoard();

});

// ================= Score Variables =================

let runs = 0;

let wickets = 0;

let balls = 0;

// ================= Show Scoreboard =================

function showScoreBoard() {

    scoreBoard.innerHTML = `

    <h2>${selectedMatch.team1}</h2>

    <div class="score">

        <span id="scoreText">${runs}/${wickets}</span>

    </div>

    <div class="overs">

        Overs :
        <span id="oversText">

        ${Math.floor(balls/6)}.${balls%6}

        </span>

    </div>

    <div class="btn-grid">

        <button class="runBtn" onclick="addRuns(0)">0</button>

        <button class="runBtn" onclick="addRuns(1)">1</button>

        <button class="runBtn" onclick="addRuns(2)">2</button>

        <button class="runBtn" onclick="addRuns(3)">3</button>

        <button class="runBtn" onclick="addRuns(4)">4</button>

        <button class="runBtn" onclick="addRuns(6)">6</button>

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

    <button class="finishBtn"

    onclick="finishInnings()">

    🏁 Finish Innings

    </button>

    `;

}
// ================= Update Scoreboard =================

function refreshScore(){

    document.getElementById("scoreText").innerHTML =
    `${runs}/${wickets}`;

    document.getElementById("oversText").innerHTML =
    `${Math.floor(balls/6)}.${balls%6}`;

}

// ================= Add Runs =================

window.addRuns = function(run){

    runs += run;

    balls++;

    refreshScore();

};

// ================= Wicket =================

window.addWicket = function(){

    wickets++;

    balls++;

    refreshScore();

};

// ================= Wide Ball =================

window.wideBall = function(){

    runs++;

    refreshScore();

};

// ================= No Ball =================

window.noBall = function(){

    runs++;

    refreshScore();

};

// ================= Finish Innings =================

window.finishInnings = async function(){

    if(!confirm("Finish this innings?")) return;

    try{

        await updateDoc(doc(db,"matches",selectedMatch.id),{

            liveRuns:runs,

            liveWickets:wickets,

            liveOvers:`${Math.floor(balls/6)}.${balls%6}`,

            inningsCompleted:true

        });

        alert("🏁 Innings Finished Successfully!");

    }catch(error){

        console.error(error);

        alert("Error saving innings!");

    }

};

// ================= Initial Load =================

loadMatches();
