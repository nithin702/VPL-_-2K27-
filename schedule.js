
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
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

const matchForm = document.getElementById("matchForm");
const matchesList = document.getElementById("matchesList");

const team1 = document.getElementById("team1");
const team2 = document.getElementById("team2");

let allMatches = [];

// ================= Back =================

document.getElementById("backBtn").onclick = () => {

    window.location.href = "admin.html";

};

// ================= Load Teams =================

async function loadTeams(){

const snapshot = await getDocs(collection(db,"teams"));

snapshot.forEach((document)=>{

const team=document.data();

team1.innerHTML += `<option value="${team.teamName}">${team.teamName}</option>`;

team2.innerHTML += `<option value="${team.teamName}">${team.teamName}</option>`;

});

}

// ================= Load Matches =================

async function loadMatches(){

matchesList.innerHTML="";

const snapshot = await getDocs(collection(db,"matches"));

allMatches=[];

snapshot.forEach((document)=>{

const match=document.data();

match.id=document.id;

allMatches.push(match);

});

displayMatches(allMatches);

}
