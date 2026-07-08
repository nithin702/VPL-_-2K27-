if(localStorage.getItem("adminLogin")!=="true"){
window.location.href="login.html";
}
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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

const playersDiv = document.getElementById("players");
const totalPlayers = document.getElementById("totalPlayers");
const searchBox = document.getElementById("searchBox");

let allPlayers = [];

async function loadPlayers() {

  playersDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "registrations"));

  allPlayers = [];

  snapshot.forEach((document) => {

    const player = document.data();

    player.id = document.id;

    allPlayers.push(player);

  });

  totalPlayers.innerHTML = `Total Players: ${allPlayers.length}`;

  displayPlayers(allPlayers);

}

function displayPlayers(players) {

  playersDiv.innerHTML = "";

  players.forEach((player) => {

    const card = document.createElement("div");

    card.className = "card";

    card.innerHTML = `
      <img src="${player.photoUrl.replace('/upload/','/upload/f_auto,q_auto/')}"
      style="width:120px;height:120px;object-fit:cover;border-radius:10px;"><br><br>

      <b>Name:</b> ${player.playerName}<br>
      <b>Age:</b> ${player.age}<br>
      <b>Village:</b> ${player.village}<br>
      <b>Mobile:</b> ${player.mobile}<br>
      <b>Transaction ID:</b> ${player.transactionId}<br><br>

      <button onclick="deletePlayer('${player.id}')"
      style="background:red;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;">
      🗑 Delete Player
      </button>
    `;

    playersDiv.appendChild(card);

  });

}
searchBox.addEventListener("keyup", () => {

  const value = searchBox.value.toLowerCase();

  const filtered = allPlayers.filter(player =>
    player.playerName.toLowerCase().includes(value) ||
    player.mobile.includes(value) ||
    player.village.toLowerCase().includes(value)
  );

  displayPlayers(filtered);

});

window.deletePlayer = async function(id) {

  const confirmDelete = confirm("Are you sure you want to delete this player?");

  if (!confirmDelete) return;

  try {

    await deleteDoc(doc(db, "registrations", id));

    alert("Player deleted successfully.");

    loadPlayers();

  } catch (error) {

    console.error(error);

    alert("Error deleting player.");

  }

};

loadPlayers();
