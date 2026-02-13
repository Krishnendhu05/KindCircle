async function loadPosts(){

const res = await fetch("/posts");
const data = await res.json();

const feed = document.getElementById("feed");
feed.innerHTML="";

data.forEach(post=>{

const disabled = post.helped ? "bg-gray-300" : "bg-gray-100";
const text = post.helped ? "Help Taken" : "I Can Help";

feed.innerHTML += `
<div class="bg-white p-4 rounded shadow">
<h3 class="font-bold">${post.title}</h3>
<p>${post.description}</p>

<button onclick="help(${post.id})"
class="${disabled} px-3 py-1 rounded mt-2"
${post.helped ? "disabled":""}>
${text}
</button>

</div>
`;
});
}

async function createPost(){

const title = document.getElementById("title").value;
const description = document.getElementById("description").value;

await fetch("/posts",{
method:"POST",
headers:{ "Content-Type":"application/json"},
body:JSON.stringify({title,description})
});

loadPosts();
}

async function help(id){
await fetch(`/help/${id}`,{method:"POST"});
loadPosts();
}

function logout(){
localStorage.removeItem("kindcircle_user");
window.location.href="login.html";
}

loadPosts();
