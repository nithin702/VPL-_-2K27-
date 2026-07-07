import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",
  authDomain: "vpl-2k27.firebaseapp.com",
  projectId: "vpl-2k27",
  storageBucket: "vpl-2k27.firebasestorage.app",
  messagingSenderId: "919265368604",
  appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",
  measurementId: "G-YL6CQ36HV6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener("DOMContentLoaded", () => {

  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const playerName = form.querySelector('input[placeholder="Player Name"]').value.trim();
    const age = form.querySelector('input[placeholder="Age"]').value.trim();
    const village = form.querySelector('input[placeholder="Village"]').value.trim();
    const mobile = form.querySelector('input[placeholder="Mobile Number"]').value.trim();
    const transactionId = form.querySelector('input[placeholder="Transaction ID"]').value.trim();

    const battingStyle = form.querySelectorAll("select")[0].value;
    const bowlingStyle = form.querySelectorAll("select")[1].value;
    const playerRole = form.querySelectorAll("select")[2].value;

    const playerPhoto = document.getElementById("playerPhoto").files[0];

    if (!playerPhoto) {
      alert("Please select a player photo.");
      return;
    }

    try {

      // Check duplicate mobile number
      const q = query(
        collection(db, "registrations"),
        where("mobile", "==", mobile)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("This mobile number is already registered.");
        return;
      }

      // Upload Image to Cloudinary
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

      console.log("Status:", uploadResponse.status);
      console.log("Status Text:", uploadResponse.statusText);

      const uploadData = await uploadResponse.json();

      console.log("Cloudinary Response:", uploadData);

      if (!uploadResponse.ok) {
        throw new Error(JSON.stringify(uploadData));
      }

      if (!uploadData.secure_url) {
        throw new Error("Photo upload failed.");
      }

      const photoUrl = uploadData.secure_url;
      console.log("Photo URL:", photoUrl);

      // Save Registration
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
        createdAt: new Date()
      });

      alert("Registration Successful!");

      form.reset();

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    }

  });

});
