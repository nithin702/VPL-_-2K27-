
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

const playerCard = document.getElementById("playerCard");

const params = new URLSearchParams(window.location.search);

const playerId = params.get("id");

// ================= Back Button =================

document.getElementById("backBtn").onclick = () => {

  history.back();

};

// ================= Load Player =================

async function loadPlayer(){

  const snapshot = await getDocs(collection(db,"registrations"));

  let foundPlayer = null;

  snapshot.forEach((document)=>{

    if(document.id===playerId){

      foundPlayer = document.data();

      foundPlayer.id = document.id;

    }

  });

  if(!foundPlayer){

    playerCard.innerHTML="<h2>Player Not Found</h2>";

    return;

  }

  displayPlayer(foundPlayer);

}
