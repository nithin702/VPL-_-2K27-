
function login(){

const password=document.getElementById("password").value;

if(password==="VPL@2027"){

localStorage.setItem("adminLogin","true");

window.location.href="admin.html";

}else{

alert("Wrong Password!");

}

}
