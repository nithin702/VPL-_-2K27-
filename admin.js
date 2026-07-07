
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

async function loadPlayers() {

  playersDiv.innerHTML = "";

  const snapshot = await getDocs(collection(db, "registrations"));

  snapshot.forEach((doc) => {

    const player = doc.data();

    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${player.photoUrl}" width="120" style="border-radius:10px;"><br><br>

      <b>Name:</b> ${player.playerName}<br>
      <b>Age:</b> ${player.age}<br>
      <b>Village:</b> ${player.village}<br>
      <b>Mobile:</b> ${player.mobile}<br>
      <b>Transaction ID:</b> ${player.transactionId}
    `;

    playersDiv.appendChild(card);

  });

}

loadPlayers();
