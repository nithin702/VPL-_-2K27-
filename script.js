
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
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

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const playerName = form.querySelector('input[placeholder="Player Name"]').value;
    const age = form.querySelector('input[placeholder="Age"]').value;
    const village = form.querySelector('input[placeholder="Village"]').value;
    const mobile = form.querySelector('input[placeholder="Mobile Number"]').value;
    const transactionId = form.querySelector('input[placeholder="Transaction ID"]').value;
    

    try {
      // Upload Player Photo to Cloudinary
const formData = new FormData();
formData.append("file", playerPhoto);
formData.append("upload_preset", "vpl_players");

const uploadResponse = await fetch(
  "https://api.cloudinary.com/v1_1/sicmc4e6/image/upload",
  {
    method: "POST",
    body: formData,
  }
);

const uploadData = await uploadResponse.json();

if (!uploadData.secure_url) {
  throw new Error("Photo upload failed.");
}

const photoUrl = uploadData.secure_url;

      await addDoc(collection(db, "registrations"), {
        playerName,
        age,
        village,
        mobile,
        transactionId,
        photoUrl,
        createdAt: new Date()
      });

      alert("Registration Successful!");
      form.reset();

    } catch (error) {
      alert("Error: " + error.message);
    }

  });

});
