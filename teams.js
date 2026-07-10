
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ===== Firebase Config =====
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

const form = document.getElementById("teamForm");
const teamsList = document.getElementById("teamsList");

async function loadTeams() {

  teamsList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "teams"));

  if (snapshot.empty) {
    teamsList.innerHTML = "<p>No Teams Added</p>";
    return;
  }

  snapshot.forEach((doc) => {

    const team = doc.data();

    const card = document.createElement("div");

    card.className = "team-card";

    card.innerHTML = `
      <h3>🏏 ${team.teamName}</h3>

      <p><b>Owner :</b> ${team.ownerName}</p>

      <p><b>Purse :</b> ${team.teamPurse} Coins</p>
    `;

    teamsList.appendChild(card);

  });

}

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
    createdAt: new Date()

  });

  alert("Team Added Successfully!");

  form.reset();

  document.getElementById("teamPurse").value = 150000;

  loadTeams();

});

loadTeams();

document.getElementById("backBtn").onclick = () => {
  window.location.href = "admin.html";
};
