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

const tableBody = document.getElementById("tableBody");

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

    window.location.href = "admin.html";

};

// ================= Load Teams =================

let allTeams = [];

async function loadTeams(){

    tableBody.innerHTML =
    "<tr><td colspan='6'>Loading...</td></tr>";

    const snapshot =
    await getDocs(collection(db,"teams"));

    allTeams = [];

    snapshot.forEach((document)=>{

        const team = document.data();

        team.id = document.id;

        allTeams.push(team);

    });

}
// ================= Display Points Table =================

function displayTable() {

    tableBody.innerHTML = "";

    // Highest points first
    allTeams.sort((a, b) => (b.points || 0) - (a.points || 0));

    allTeams.forEach((team, index) => {

        const row = document.createElement("tr");

        let positionClass = "";

        if (index === 0) positionClass = "first";
        else if (index === 1) positionClass = "second";
        else if (index === 2) positionClass = "third";

        row.innerHTML = `

        <td class="${positionClass}">
        ${index + 1}
        </td>

        <td>
        ${team.teamName}
        </td>

        <td>
        ${team.played || 0}
        </td>

        <td>
        ${team.wins || 0}
        </td>

        <td>
        ${team.losses || 0}
        </td>

        <td style="font-weight:bold;color:gold;">
        ${team.points || 0}
        </td>

        `;

        tableBody.appendChild(row);

    });

}

// ================= Initial Load =================

async function init() {

    await loadTeams();

    displayTable();

}

init();
// ================= Update Team Points =================

import {
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Winner Team Update
export async function updateWinner(teamId){

    const team = allTeams.find(t => t.id === teamId);

    if(!team) return;

    await updateDoc(doc(db,"teams",teamId),{

        played : (team.played || 0) + 1,

        wins : (team.wins || 0) + 1,

        points : (team.points || 0) + 2

    });

}

// Loser Team Update
export async function updateLoser(teamId){

    const team = allTeams.find(t => t.id === teamId);

    if(!team) return;

    await updateDoc(doc(db,"teams",teamId),{

        played : (team.played || 0) + 1,

        losses : (team.losses || 0) + 1

    });

}
