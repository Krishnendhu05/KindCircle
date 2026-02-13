let activePost=null;
const currentUser = JSON.parse(localStorage.getItem("kindcircleUser"));
if(!currentUser){
    window.location.href = "login.html";
}
console.log("Logged user:", currentUser);


// LOAD POSTS
async function loadPosts(){

    const res=await fetch("/posts");
    const data=await res.json();

    const feed=document.getElementById("feed");
    feed.innerHTML="";

    data.forEach(post=>{

        feed.innerHTML+=`
        <div class="bg-white p-5 rounded-2xl border">

        <h3 class="font-semibold">${post.title}</h3>
        <p>${post.description}</p>

        ${
            !post.helped ?
            `<button onclick="acceptHelp(${post.id})"
            class="mt-3 px-4 py-1 bg-gray-200 rounded">
            🤝 I Can Help
            </button>`
            :
            `<button onclick="openChat(${post.id})"
            class="mt-3 px-4 py-1 bg-black text-white rounded">
            💬 Chat
            </button>`
        }

        </div>`;
    });
}


// CREATE POST
async function createPost(){

    const title=document.getElementById("title").value;
    const description=document.getElementById("description").value;

    await fetch("/posts",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({title,description})
    });

    loadPosts();
}


// CLICK HELP
async function acceptHelp(id){

    const res = await fetch(`/help/${id}`,{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({
            user_id: currentUser.id
        })
    });

    const data = await res.json();

    showToast("+1 Reward Point 🎉");

    // update local profile instantly
    currentUser.points = data.points;
    localStorage.setItem("kindcircleUser", JSON.stringify(currentUser));

    loadPosts();
}



// TOAST BAR
function showToast(msg){

    const toast=document.getElementById("toast");

    toast.innerText=msg;
    toast.classList.remove("hidden");

    setTimeout(()=>{
        toast.classList.add("hidden");
    },2000);
}


// OPEN CHAT
function openChat(id){

    activePost=id;
    document.getElementById("chatBox").classList.remove("hidden");
    loadChat();
}


// SEND MESSAGE
async function sendMessage(){

    const msg=document.getElementById("chatInput").value;

    console.log("Sending chat:",activePost,msg);

    const res=await fetch("/chat",{
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body:JSON.stringify({
            post_id:activePost,
            message:msg
        })
    });

    const data=await res.json();
    console.log("Server reply:",data);

    document.getElementById("chatInput").value="";
    loadChat();
}


// LOAD CHAT
async function loadChat(){

    const res=await fetch(`/chat/${activePost}`);
    const data=await res.json();

    const box=document.getElementById("messages");
    box.innerHTML="";

    data.forEach(m=>{
        box.innerHTML+=`<div class="bg-gray-100 p-2 rounded mb-2">${m.message}</div>`;
    });
}


// UPDATE PROFILE LIVE
async function updateProfilePoints(){

    const res=await fetch("/profile");
    const user=await res.json();

    const el=document.getElementById("points");
    if(el) el.innerText=user.points;
}


loadPosts();
