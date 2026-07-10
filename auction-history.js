
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs
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

const historyList = document.getElementById("historyList");
const searchHistory = document.getElementById("searchHistory");

let soldPlayers = [];

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

  window.location.href = "admin.html";

};

// ================= Load Auction History =================

async function loadHistory() {

  historyList.innerHTML = "";

  const snapshot = await getDocs(collection(db, "registrations"));

  soldPlayers = [];

  snapshot.forEach((document) => {

    const player = document.data();

    player.id = document.id;

    if (player.sold === true) {

      soldPlayers.push(player);

    }

  });

  displayHistory(soldPlayers);

}
