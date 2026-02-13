const currentUser = JSON.parse(localStorage.getItem("kindcircleUser"));

async function loadProfile(){

    const res = await fetch(`/profile/${currentUser.id}`);
    const user = await res.json();

    document.getElementById("name").innerText = user.full_name;
    document.getElementById("points").innerText = user.points;
}

loadProfile();
