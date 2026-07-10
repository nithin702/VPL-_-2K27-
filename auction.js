
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

const playersList = document.getElementById("playersList");
const teamSelect = document.getElementById("teamSelect");
const backBtn = document.getElementById("backBtn");

let allPlayers = [];
let allTeams = [];

// ================= Back Button =================

backBtn.onclick = () => {
    window.location.href = "admin.html";
};
// ================= Load Teams =================

async function loadTeams() {

  teamSelect.innerHTML =
  `<option value="">Select Team</option>`;

  const snapshot = await getDocs(collection(db, "teams"));

  allTeams = [];

  snapshot.forEach((document) => {

    const team = document.data();

    team.id = document.id;

    allTeams.push(team);

    teamSelect.innerHTML += `
      <option value="${team.id}">
        ${team.teamName}
      </option>
    `;

  });

}

// ================= Load Players =================

async function loadPlayers() {

  playersList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "registrations"));

  allPlayers = [];

  snapshot.forEach((document) => {

    const player = document.data();

    player.id = document.id;

    // ఇప్పటికే అమ్మిన player ని చూపించవద్దు
    if (player.sold === true) return;

    allPlayers.push(player);

  });

  displayPlayers(allPlayers);

}
// ================= Display Players =================

function displayPlayers(players){

playersList.innerHTML="";

if(players.length===0){

playersList.innerHTML="<h3>No Unsold Players Found</h3>";

return;

}

players.forEach((player)=>{

const card=document.createElement("div");

card.className="player-card";

card.innerHTML=`

<div style="text-align:center;">

<img
src="${player.photoUrl.replace('/upload/','/upload/f_auto,q_auto/')}"
style="width:100px;height:100px;border-radius:50%;object-fit:cover;border:3px solid gold;">

</div>

<h3>${player.playerName}</h3>

<p><b>Age :</b> ${player.age}</p>

<p><b>Village :</b> ${player.village}</p>

<p><b>Role :</b> ${player.playerRole}</p>

<p><b>Batting :</b> ${player.battingStyle}</p>

<p><b>Bowling :</b> ${player.bowlingStyle}</p>

<button onclick="selectPlayer('${player.id}')">

🏏 Select Player

</button>

`;

playersList.appendChild(card);

});

}

// ================= Select Player =================

window.selectPlayer=function(id){

const player=allPlayers.find(p=>p.id===id);

if(!player) return;

document.getElementById("selectedPlayerId").value=player.id;

document.getElementById("selectedPlayer").value=player.playerName;

window.scrollTo({

top:document.getElementById("auctionForm").offsetTop,

behavior:"smooth"

});

};
// ================= Auction Form =================

const auctionForm = document.getElementById("auctionForm");

auctionForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const playerId = document.getElementById("selectedPlayerId").value;

  const teamId = teamSelect.value;

  const bidAmount = Number(document.getElementById("bidAmount").value);

  if (playerId === "") {
    alert("Please select a player.");
    return;
  }

  if (teamId === "") {
    alert("Please select a team.");
    return;
  }

  const team = allTeams.find(t => t.id === teamId);

  if (!team) {
    alert("Team not found.");
    return;
  }

  if (bidAmount <= 0) {
    alert("Enter a valid bid amount.");
    return;
  }

  if (team.remainingPurse < bidAmount) {
    alert("❌ Team doesn't have enough purse.");
    return;
  }

  try {

    // Update Player
    await updateDoc(doc(db, "registrations", playerId), {

      sold: true,
      soldTo: team.teamName,
      soldPrice: bidAmount

    });

    // Update Team
    await updateDoc(doc(db, "teams", teamId), {

      remainingPurse: team.remainingPurse - bidAmount,
      playersBought: (team.playersBought || 0) + 1

    });

    alert("🏆 Player Sold Successfully!");

    auctionForm.reset();

    document.getElementById("selectedPlayerId").value = "";

    await loadTeams();
    await loadPlayers();

  } catch (error) {

    console.error(error);

    alert("Something went wrong.");

  }

});

// ================= First Load =================

loadTeams();
loadPlayers();
