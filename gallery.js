
// =====================================
// Firebase Imports
// =====================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// =====================================
// Firebase Config
// =====================================

const firebaseConfig = {

    apiKey: "AIzaSyBdEQU9fNNjzfo-OGV5o9p_CiS_PA_NJNw",

    authDomain: "vpl-2k27.firebaseapp.com",

    projectId: "vpl-2k27",

    storageBucket: "vpl-2k27.firebasestorage.app",

    messagingSenderId: "919265368604",

    appId: "1:919265368604:web:41587c7dd08f4c5d991dd9",

    measurementId: "G-YL6CQ36HV6"

};

// =====================================
// Initialize Firebase
// =====================================

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

// =====================================
// HTML Elements
// =====================================

const photosGrid = document.getElementById("photosGrid");

const videosGrid = document.getElementById("videosGrid");

const photosBtn = document.getElementById("photosBtn");

const videosBtn = document.getElementById("videosBtn");

const videosSection = document.getElementById("videosSection");

const imageModal = document.getElementById("imageModal");

const modalImage = document.getElementById("modalImage");

const closeImage = document.getElementById("closeImage");

const videoModal = document.getElementById("videoModal");

const modalVideo = document.getElementById("modalVideo");

const videoSource = document.getElementById("videoSource");

const closeVideo = document.getElementById("closeVideo");

// =====================================
// Load Photos
// =====================================

async function loadPhotos() {

    try {

        photosGrid.innerHTML = "";

        const snapshot = await getDocs(collection(db, "galleryPhotos"));

        if (snapshot.empty) {

            photosGrid.innerHTML = "<p>No Photos Available</p>";

            return;

        }

        snapshot.forEach(doc => {

            const photo = doc.data();

            photosGrid.innerHTML += `

            <div class="gallery-item">

                <img
                    src="${photo.imageUrl}"
                    alt="Gallery Photo"
                    onclick="openImage('${photo.imageUrl}')">

                <p>${photo.title || "VPL 2K27"}</p>

            </div>

            `;

        });

    } catch (error) {

        console.error("Photo Load Error :", error);

    }

}
// =====================================
// Load Videos
// =====================================

async function loadVideos() {

    try {

        videosGrid.innerHTML = "";

        const snapshot = await getDocs(collection(db, "galleryVideos"));

        if (snapshot.empty) {

            videosGrid.innerHTML = "<p>No Videos Available</p>";

            return;

        }

        snapshot.forEach(doc => {

            const video = doc.data();

            videosGrid.innerHTML += `

            <div class="gallery-item">

                <video
                    onclick="openVideo('${video.videoUrl}')">

                    <source src="${video.videoUrl}" type="video/mp4">

                </video>

                <p>${video.title || "VPL 2K27"}</p>

            </div>

            `;

        });

    } catch (error) {

        console.error("Video Load Error :", error);

    }

}

// =====================================
// Photo / Video Buttons
// =====================================

photosBtn.addEventListener("click", () => {

    photosBtn.classList.add("active");

    videosBtn.classList.remove("active");

    photosGrid.parentElement.style.display = "block";

    videosSection.style.display = "none";

});

videosBtn.addEventListener("click", () => {

    videosBtn.classList.add("active");

    photosBtn.classList.remove("active");

    photosGrid.parentElement.style.display = "none";

    videosSection.style.display = "block";

});

// =====================================
// Open Image
// =====================================

window.openImage = function(imageUrl){

    imageModal.style.display = "flex";

    modalImage.src = imageUrl;

}

// =====================================
// Close Image
// =====================================

closeImage.addEventListener("click",()=>{

    imageModal.style.display="none";

});

imageModal.addEventListener("click",(e)=>{

    if(e.target===imageModal){

        imageModal.style.display="none";

    }

});
// =====================================
// Open Video
// =====================================

window.openVideo = function(videoUrl){

    videoModal.style.display = "flex";

    videoSource.src = videoUrl;

    modalVideo.load();

    modalVideo.play();

}

// =====================================
// Close Video
// =====================================

closeVideo.addEventListener("click",()=>{

    modalVideo.pause();

    videoModal.style.display="none";

});

videoModal.addEventListener("click",(e)=>{

    if(e.target===videoModal){

        modalVideo.pause();

        videoModal.style.display="none";

    }

});

// =====================================
// Auto Refresh Gallery
// =====================================

setInterval(async()=>{

    await loadPhotos();

    await loadVideos();

},30000);

// =====================================
// Initialize Gallery
// =====================================

async function initializeGallery(){

    try{

        await loadPhotos();

        await loadVideos();

        console.log("📸 VPL Gallery Loaded Successfully");

    }catch(error){

        console.error("Gallery Error :",error);

    }

}

initializeGallery();
