import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
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

document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {

e.preventDefault();

// ===== Get Form Values =====
const playerName = document.getElementById("playerName").value.trim();
const age = document.getElementById("age").value.trim();
const village = document.getElementById("village").value.trim();
const mobile = document.getElementById("mobile").value.trim();
const transactionId = document.getElementById("transactionId").value.trim();

const battingStyle = document.getElementById("battingStyle").value;
const bowlingStyle = document.getElementById("bowlingStyle").value;
const playerRole = document.getElementById("playerRole").value;

const playerPhoto = document.getElementById("playerPhoto").files[0];

if (!playerPhoto) {
alert("Please select player photo.");
return;
}
  try {

// ===== Check Duplicate Mobile =====
const q = query(
collection(db, "registrations"),
where("mobile", "==", mobile)
);

const snapshot = await getDocs(q);

if (!snapshot.empty) {
alert("This mobile number is already registered.");
return;
}

// ===== Upload Photo to Cloudinary =====
const formData = new FormData();

formData.append("file", playerPhoto);
formData.append("upload_preset", "vpl_players");

const uploadResponse = await fetch(
"https://api.cloudinary.com/v1_1/sicmc4e6/image/upload",
{
method: "POST",
body: formData
}
);

const uploadData = await uploadResponse.json();

if (!uploadResponse.ok || !uploadData.secure_url) {
throw new Error("Photo upload failed.");
}

const photoUrl = uploadData.secure_url;

// ===== Save Player =====
await addDoc(collection(db, "registrations"), {

playerName,
age,
village,
mobile,
transactionId,

battingStyle,
bowlingStyle,
playerRole,

photoUrl,

paymentStatus: "Pending",

createdAt: new Date()

});
    // ===== Success =====
alert("Registration Successful!");

form.reset();

} catch (error) {

console.error(error);

alert("Error: " + error.message);

}

});

});
