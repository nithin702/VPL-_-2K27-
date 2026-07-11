import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  updateDoc,
  doc
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

const matchForm = document.getElementById("matchForm");

const matchesList = document.getElementById("matchesList");

const team1 = document.getElementById("team1");

const team2 = document.getElementById("team2");

const searchMatch = document.getElementById("searchMatch");

// ================= Variables =================

let allMatches = [];

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

    window.location.href = "admin.html";

};
// ================= Load Teams =================

async function loadTeams() {

    team1.innerHTML = `<option value="">Select Team 1</option>`;
    team2.innerHTML = `<option value="">Select Team 2</option>`;

    const snapshot = await getDocs(collection(db, "teams"));

    console.log("Teams Count:", snapshot.size);

    snapshot.forEach((docSnap) => {

        const team = docSnap.data();

        console.log(team);

        if (!team.teamName) return;

        team1.innerHTML += `
        <option value="${team.teamName}">
            ${team.teamName}
        </option>`;

        team2.innerHTML += `
        <option value="${team.teamName}">
            ${team.teamName}
        </option>`;

    });

}

// ================= Load Matches =================

async function loadMatches() {

    matchesList.innerHTML = "<p>Loading Matches...</p>";

    const snapshot = await getDocs(collection(db, "matches"));

    allMatches = [];

    snapshot.forEach((document) => {

        const match = document.data();

        match.id = document.id;

        allMatches.push(match);

    });

    displayMatches(allMatches);

}

// ================= Display Matches =================

function displayMatches(matches) {

    matchesList.innerHTML = "";

    if (matches.length === 0) {

        matchesList.innerHTML = `
        <p>No Matches Scheduled.</p>`;

        return;

    }
      matches.forEach((match) => {

        const card = document.createElement("div");

        card.className = "match-card";

        card.innerHTML = `

        <h3>${match.matchNumber}</h3>

        <p><b>🏏 Teams :</b><br>
        ${match.team1} 🆚 ${match.team2}</p>

        <p><b>📍 Ground :</b> ${match.ground}</p>

        <p><b>📅 Date :</b> ${match.matchDate}</p>

        <p><b>🕘 Time :</b> ${match.matchTime}</p>

        <p>

        <b>Status :</b>

        <span style="color:
        ${match.status==="Live"
        ?"red"
        :match.status==="Completed"
        ?"lime"
        :"orange"};font-weight:bold;">

        ${match.status}

        </span>

        </p>

        ${
        match.status==="Not Started"

        ?

        `<button onclick="startMatch('${match.id}')"
        style="background:green;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;margin-right:8px;">
        ▶ Start Match
        </button>`

        :

        match.status==="Live"

        ?

        `<button onclick="finishMatch('${match.id}')"
        style="background:orange;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;margin-right:8px;">
        🏁 Finish Match
        </button>`

        :

        `<button
        style="background:gray;color:white;border:none;padding:8px 15px;border-radius:6px;margin-right:8px;">
        ✅ Completed
        </button>`
        }

        <button onclick="editMatch('${match.id}')"
        style="background:#2196F3;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;margin-right:8px;">
        ✏ Edit
        </button>

        <button onclick="deleteMatch('${match.id}')"
        style="background:red;color:white;border:none;padding:8px 15px;border-radius:6px;cursor:pointer;">
        🗑 Delete
        </button>

        `;

        matchesList.appendChild(card);

    });

}
// ================= Create Match =================

matchForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (team1.value === team2.value) {
        alert("❌ Team 1 and Team 2 cannot be the same.");
        return;
    }

    await addDoc(collection(db, "matches"), {

        matchNumber: document.getElementById("matchNumber").value.trim(),

        team1: team1.value,

        team2: team2.value,

        ground: document.getElementById("ground").value.trim(),

        matchDate: document.getElementById("matchDate").value,

        matchTime: document.getElementById("matchTime").value,

        status: "Not Started",

        createdAt: new Date()

    });

    alert("🏏 Match Created Successfully!");

    matchForm.reset();

    loadMatches();

});

// ================= Start Match =================

window.startMatch = async function(id){

    if(!confirm("Start this match?")) return;

    await updateDoc(doc(db,"matches",id),{

        status:"Live"

    });

    alert("🔴 Match Started!");

    loadMatches();

};

// ================= Finish Match =================

window.finishMatch = async function(id){

    if(!confirm("Finish this match?")) return;

    await updateDoc(doc(db,"matches",id),{

        status:"Completed"

    });

    alert("✅ Match Completed!");

    loadMatches();

};
// ================= Delete Match =================

window.deleteMatch = async function(id){

    if(!confirm("Delete this match?")) return;

    await deleteDoc(doc(db,"matches",id));

    alert("🗑 Match Deleted Successfully!");

    loadMatches();

};

// ================= Edit Match =================

window.editMatch = async function(id){

    const match = allMatches.find(m => m.id === id);

    if(!match) return;

    const newGround = prompt("Ground Name", match.ground);

    if(newGround === null) return;

    const newTime = prompt("Match Time", match.matchTime);

    if(newTime === null) return;

    await updateDoc(doc(db,"matches",id),{

        ground: newGround,

        matchTime: newTime

    });

    alert("✏ Match Updated Successfully!");

    loadMatches();

};

// ================= Search Match =================

searchMatch.addEventListener("keyup",()=>{

    const value = searchMatch.value.toLowerCase();

    const filtered = allMatches.filter(match =>

        match.matchNumber.toLowerCase().includes(value) ||

        match.team1.toLowerCase().includes(value) ||

        match.team2.toLowerCase().includes(value)

    );

    displayMatches(filtered);

});

// ================= Initial Load =================

loadTeams();

loadMatches();

  
