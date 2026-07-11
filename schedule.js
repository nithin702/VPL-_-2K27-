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

const backBtn = document.getElementById("backBtn");

// ================= Variables =================

let allMatches = [];
let allTeams = [];

// ================= Back Button =================

backBtn.onclick = () => {
    window.location.href = "admin.html";
};
// ================= Load Teams =================

async function loadTeams() {

    try {

        team1.innerHTML = `
        <option value="">Select Team 1</option>`;

        team2.innerHTML = `
        <option value="">Select Team 2</option>`;

        allTeams = [];

        const snapshot = await getDocs(collection(db, "teams"));

        snapshot.forEach((docSnap) => {

            const team = docSnap.data();

            team.id = docSnap.id;

            allTeams.push(team);

            team1.innerHTML += `
            <option value="${team.teamName}">
                ${team.teamName}
            </option>`;

            team2.innerHTML += `
            <option value="${team.teamName}">
                ${team.teamName}
            </option>`;

        });

    } catch (error) {

        console.error("Load Teams Error :", error);

        alert("Unable to load teams.");

    }

}

// ================= Load Matches =================

async function loadMatches() {

    try {

        matchesList.innerHTML =
        "<p>Loading Matches...</p>";

        allMatches = [];

        const snapshot = await getDocs(collection(db, "matches"));

        snapshot.forEach((docSnap) => {

            const match = docSnap.data();

            match.id = docSnap.id;

            allMatches.push(match);

        });

        displayMatches(allMatches);

    } catch (error) {

        console.error("Load Matches Error :", error);

        matchesList.innerHTML =
        "<p>Failed to load matches.</p>";

    }

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

        let statusColor = "orange";

        if (match.status === "Live") {

            statusColor = "red";

        } else if (match.status === "Completed") {

            statusColor = "limegreen";

        }

        card.innerHTML = `

        <h3>${match.matchNumber}</h3>

        <p>
        <b>🏏 Teams :</b><br>
        ${match.team1} 🆚 ${match.team2}
        </p>

        <p>
        <b>📍 Ground :</b>
        ${match.ground}
        </p>

        <p>
        <b>📅 Date :</b>
        ${match.matchDate}
        </p>

        <p>
        <b>🕒 Time :</b>
        ${match.matchTime}
        </p>

        <p>

        <b>Status :</b>

        <span style="
        color:${statusColor};
        font-weight:bold;">

        ${match.status}

        </span>

        </p>

        <div style="margin-top:15px;">

        ${
            match.status === "Not Started"

            ?

            `<button onclick="startMatch('${match.id}')">
            ▶ Start Match
            </button>`

            :

            match.status === "Live"

            ?

            `<button onclick="finishMatch('${match.id}')">
            🏁 Finish Match
            </button>`

            :

            `<button disabled>
            ✅ Completed
            </button>`
        }

        <button onclick="editMatch('${match.id}')">
        ✏ Edit
        </button>

        <button onclick="deleteMatch('${match.id}')">
        🗑 Delete
        </button>

        </div>

        `;

        matchesList.appendChild(card);

    });

}
// ================= Create Match =================

matchForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    const matchNumber = document.getElementById("matchNumber").value.trim();
    const ground = document.getElementById("ground").value.trim();
    const matchDate = document.getElementById("matchDate").value;
    const matchTime = document.getElementById("matchTime").value;

    if (team1.value === "" || team2.value === "") {

        alert("Please select both teams.");
        return;

    }

    if (team1.value === team2.value) {

        alert("❌ Team 1 and Team 2 cannot be the same.");
        return;

    }

    try {

        await addDoc(collection(db, "matches"), {

            matchNumber: matchNumber,

            team1: team1.value,

            team2: team2.value,

            ground: ground,

            matchDate: matchDate,

            matchTime: matchTime,

            status: "Not Started",

            createdAt: new Date()

        });

        alert("🏏 Match Created Successfully!");

        matchForm.reset();

        team1.selectedIndex = 0;
        team2.selectedIndex = 0;

        await loadMatches();

    } catch (error) {

        console.error("Create Match Error:", error);

        alert("Failed to create match.");

    }

});
// ================= Start Match =================

window.startMatch = async function(id) {

    if (!confirm("Start this match?")) return;

    try {

        await updateDoc(doc(db, "matches", id), {

            status: "Live"

        });

        alert("🔴 Match Started Successfully!");

        await loadMatches();

    } catch (error) {

        console.error("Start Match Error:", error);

        alert("Unable to start match.");

    }

};

// ================= Finish Match =================

window.finishMatch = async function(id) {

    if (!confirm("Finish this match?")) return;

    try {

        await updateDoc(doc(db, "matches", id), {

            status: "Completed"

        });

        alert("🏁 Match Completed Successfully!");

        await loadMatches();

    } catch (error) {

        console.error("Finish Match Error:", error);

        alert("Unable to finish match.");

    }

};

// ================= Delete Match =================

window.deleteMatch = async function(id) {

    if (!confirm("Delete this match?")) return;

    try {

        await deleteDoc(doc(db, "matches", id));

        alert("🗑 Match Deleted Successfully!");

        await loadMatches();

    } catch (error) {

        console.error("Delete Match Error:", error);

        alert("Unable to delete match.");

    }

};

// ================= Edit Match =================

window.editMatch = async function(id) {

    const match = allMatches.find(m => m.id === id);

    if (!match) return;

    const newGround = prompt("Enter Ground Name", match.ground);

    if (newGround === null) return;

    const newTime = prompt("Enter Match Time", match.matchTime);

    if (newTime === null) return;

    try {

        await updateDoc(doc(db, "matches", id), {

            ground: newGround.trim(),

            matchTime: newTime.trim()

        });

        alert("✏️ Match Updated Successfully!");

        await loadMatches();

    } catch (error) {

        console.error("Edit Match Error:", error);

        alert("Unable to update match.");

    }

};
// ================= Search Match =================

if (searchMatch) {

    searchMatch.addEventListener("keyup", () => {

        const value = searchMatch.value.toLowerCase().trim();

        if (value === "") {

            displayMatches(allMatches);

            return;

        }

        const filtered = allMatches.filter((match) => {

            return (

                match.matchNumber.toLowerCase().includes(value) ||

                match.team1.toLowerCase().includes(value) ||

                match.team2.toLowerCase().includes(value) ||

                match.ground.toLowerCase().includes(value)

            );

        });

        displayMatches(filtered);

    });

}

// ================= Initial Load =================

async function initializePage() {

    try {

        await loadTeams();

        await loadMatches();

        console.log("✅ Schedule Module Loaded Successfully");

    } catch (error) {

        console.error("Initialization Error:", error);

        alert("Failed to load Schedule Page.");

    }

}

initializePage();
