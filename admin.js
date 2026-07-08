
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== Admin Login Check =====
if (localStorage.getItem("adminLogin") !== "true") {
  window.location.href = "login.html";
}

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

      <button onclick="editPlayer('${player.id}')"
      style="background:#2196F3;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;margin-right:10px;">
      ✏️ Edit
      </button>

      <button onclick="deletePlayer('${player.id}')"
      style="background:red;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;">
      🗑 Delete
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
// ================= Delete Player =================
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

// ================= Edit Player =================
window.editPlayer = async function(id) {

  const player = allPlayers.find(p => p.id === id);

  if (!player) return;

  const newName = prompt("Player Name:", player.playerName);
  if (newName === null) return;

  const newAge = prompt("Age:", player.age);
  if (newAge === null) return;

  const newVillage = prompt("Village:", player.village);
  if (newVillage === null) return;

  const newMobile = prompt("Mobile Number:", player.mobile);
  if (newMobile === null) return;

  try {

    await updateDoc(doc(db, "registrations", id), {
      playerName: newName,
      age: newAge,
      village: newVillage,
      mobile: newMobile
    });

    alert("Player updated successfully.");

    loadPlayers();

  } catch (error) {

    console.error(error);

    alert("Error updating player.");

  }

};

// ================= Load =================
loadPlayers();
document.getElementById("logoutBtn").addEventListener("click", () => {

  if(confirm("Are you sure you want to logout?")){

    localStorage.removeItem("adminLogin");

    window.location.href="login.html";

  }

});
