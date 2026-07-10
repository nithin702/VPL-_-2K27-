import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ================= Elements =================

const form = document.getElementById("teamForm");
const teamsList = document.getElementById("teamsList");

let allTeams = [];

// ================= Load Teams =================

async function loadTeams() {

  teamsList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "teams"));

  allTeams = [];

  if (snapshot.empty) {

    teamsList.innerHTML =
      "<h3 style='color:white;text-align:center;'>No Teams Added</h3>";

    return;
  }

  snapshot.forEach((document) => {

    const team = document.data();

    team.id = document.id;

    allTeams.push(team);

  });

  displayTeams(allTeams);

}
// ================= Display Teams =================

function displayTeams(teams) {

  teamsList.innerHTML = "";

  teams.forEach((team) => {

    const card = document.createElement("div");
    card.className = "team-card";

    const logo = team.logoUrl && team.logoUrl.trim() !== ""
      ? team.logoUrl
      : "https://via.placeholder.com/90?text=LOGO";

    card.innerHTML = `

      <div style="text-align:center;">

        <img
          src="${logo}"
          style="width:90px;height:90px;border-radius:50%;object-fit:cover;border:3px solid gold;">

      </div>

      <h3 style="text-align:center;">🏏 ${team.teamName}</h3>

      <p><b>👤 Owner :</b> ${team.ownerName}</p>

      <p><b>💰 Total Purse :</b> ${team.teamPurse} Coins</p>

      <p><b>💵 Remaining Purse :</b> ${team.remainingPurse ?? team.teamPurse} Coins</p>

      <p><b>👥 Players Bought :</b> ${team.playersBought ?? 0}</p>

      <div style="margin-top:15px;display:flex;gap:10px;justify-content:center;">

        <button
          onclick="editTeam('${team.id}')"
          style="background:#2196F3;color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;">
          ✏️ Edit
        </button>

        <button
          onclick="deleteTeam('${team.id}')"
          style="background:red;color:white;border:none;padding:10px 18px;border-radius:8px;cursor:pointer;">
          🗑 Delete
        </button>

      </div>

    `;

    teamsList.appendChild(card);

  });

}
// ================= Add Team =================

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const teamName = document.getElementById("teamName").value.trim();
  const ownerName = document.getElementById("ownerName").value.trim();
  const logoUrl = document.getElementById("logoUrl").value.trim();

  const teamPurse = Number(document.getElementById("teamPurse").value);

  await addDoc(collection(db, "teams"), {

    teamName,
    ownerName,
    logoUrl,
    teamPurse,
    remainingPurse: teamPurse,
    playersBought: 0,
    createdAt: new Date()

  });

  alert("✅ Team Added Successfully!");

  form.reset();

  document.getElementById("teamPurse").value = 150000;

  loadTeams();

});

// ================= Edit Team =================

window.editTeam = async function(id){

  const team = allTeams.find(t => t.id === id);

  if(!team) return;

  const teamName = prompt("Team Name", team.teamName);
  if(teamName === null) return;

  const ownerName = prompt("Owner Name", team.ownerName);
  if(ownerName === null) return;

  const logoUrl = prompt("Logo URL", team.logoUrl || "");
  if(logoUrl === null) return;

  const purse = prompt("Total Purse", team.teamPurse);
  if(purse === null) return;

  await updateDoc(doc(db,"teams",id),{

    teamName,
    ownerName,
    logoUrl,
    teamPurse:Number(purse)

  });

  alert("✅ Team Updated Successfully!");

  loadTeams();

};

// ================= Delete Team =================

window.deleteTeam = async function(id){

  if(!confirm("Delete this Team?")) return;

  await deleteDoc(doc(db,"teams",id));

  alert("🗑 Team Deleted Successfully!");

  loadTeams();

};

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

  window.location.href="admin.html";

};

// ================= First Load =================

loadTeams();
