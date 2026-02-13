document.addEventListener("DOMContentLoaded", () => {

const form = document.getElementById("auth-form");

form.addEventListener("submit",(e)=>{

    e.preventDefault();

    const email = document.getElementById("email").value;
    const pass = document.getElementById("passkey").value;

    if(!email || !pass){
        alert("Fill all fields");
        return;
    }

    // Save login session
    localStorage.setItem("kindcircle_user", JSON.stringify({
        email: email
    }));

    // Redirect to homepage
    window.location.href = "home.html";

});
});
