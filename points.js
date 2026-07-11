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
