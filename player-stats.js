import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

const playersList = document.getElementById("playersList");

const searchPlayer = document.getElementById("searchPlayer");

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

    window.location.href = "admin.html";

};

// ================= Variables =================

let allPlayers = [];

// ================= Load Players =================

async function loadPlayers(){

    playersList.innerHTML =
    "<p>Loading Player Statistics...</p>";

    const snapshot =
    await getDocs(collection(db,"registrations"));

    allPlayers = [];

    snapshot.forEach((document)=>{

        const player = document.data();

        player.id = document.id;

        allPlayers.push(player);

    });

}

// ================= Display Players =================

function displayPlayers(players){

    playersList.innerHTML = "";

    if(players.length===0){

        playersList.innerHTML="<p>No Players Found.</p>";

        return;

    }

    players.forEach(player=>{

        const card=document.createElement("div");

        card.className="player-card";

        card.innerHTML=`

        <img src="${player.photoUrl || 'https://via.placeholder.com/120'}">

        <h2>${player.playerName}</h2>

        <p><b>🏏 Team :</b> ${player.teamName || "Not Sold"}</p>

        <div class="stats">

        <div class="stat-box">
        🏃 Matches<br>
        ${player.matches || 0}
        </div>

        <div class="stat-box">
        💯 Runs<br>
        ${player.runs || 0}
        </div>

        <div class="stat-box">
        💥 Fours<br>
        ${player.fours || 0}
        </div>

        <div class="stat-box">
        🚀 Sixes<br>
        ${player.sixes || 0}
        </div>

        <div class="stat-box">
        🎯 Wickets<br>
        ${player.wickets || 0}
        </div>

        <div class="stat-box">
        📈 Strike Rate<br>
        ${player.strikeRate || 0}
        </div>

        </div>

        `;

        playersList.appendChild(card);

    });

}

// ================= Search =================

searchPlayer.addEventListener("keyup",()=>{

    const value=searchPlayer.value.toLowerCase();

    const filtered=allPlayers.filter(player=>

        player.playerName.toLowerCase().includes(value)

    );

    displayPlayers(filtered);

});

// ================= Initial Load =================

async function init(){

    await loadPlayers();

    displayPlayers(allPlayers);

}

init();
