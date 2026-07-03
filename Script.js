document.addEventListener("DOMContentLoaded", function () {

  const form = document.querySelector("form");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const playerName = form.querySelector('input[placeholder="Player Name"]').value;
    const age = form.querySelector('input[placeholder="Age"]').value;
    const village = form.querySelector('input[placeholder="Village"]').value;
    const mobile = form.querySelector('input[placeholder="Mobile Number"]').value;
    const transactionId = form.querySelector('input[placeholder="Transaction ID"]').value;

    if (
      playerName === "" ||
      age === "" ||
      village === "" ||
      mobile === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    alert(
      "Registration Submitted Successfully!\n\n" +
      "Player: " + playerName +
      "\nVillage: " + village +
      "\nMobile: " + mobile
    );

    form.reset();
  });

});
