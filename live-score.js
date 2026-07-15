// Mee real API URL ikkada ivvali (e.g., CricAPI, RapidAPI nunchi theచ్చుకున్న URL)
const API_URL = 'https://api.example.com/v1/current-matches';

async function fetchLiveScore() {
    try {
        /* 
        // Real API call (Mee daggara API Key unnapudu ee kinda lines uncomment cheyandi)
        const response = await fetch(API_URL);
        const data = await response.json();
        updateUI(data);
        */

        // Ippatiki Demo kosam oka Mock Data create chesthunnanu
        const demoData = {
            team1: "IND",
            team2: "AUS",
            score: "285/4",
            overs: "45.2",
            status: "Virat Kohli is batting at 82*"
        };

        // Data ni screen meedhaki pampadam
        updateUI(demoData);

    } catch (error) {
        console.error("Score fetch cheyadam lo error vachindi:", error);
        document.getElementById('score-card').innerHTML = "<p style='color:red;'>Score load avvaledu. Network check cheyandi.</p>";
    }
}

// HTML ni update chese function
function updateUI(data) {
    const scoreCard = document.getElementById('score-card');
    
    // HTML loki kotha data ni insert chesthunnam
    scoreCard.innerHTML = `
        <h3 style="color: #0056b3;">${data.team1} vs ${data.team2}</h3>
        <h1>${data.team1}: ${data.score} <span style="font-size: 20px; color: gray;">(${data.overs} Overs)</span></h1>
        <p>${data.status}</p>
    `;
}

// 1. Page load avvagane first time score thecchukuntundi
fetchLiveScore();

// 2. Prathi 30 seconds ki score automatic ga update avvadaniki (Live feeling)
setInterval(fetchLiveScore, 30000); // 30000 ms = 30 seconds
