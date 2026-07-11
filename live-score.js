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
