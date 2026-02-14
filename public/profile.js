// GET LOGGED USER FROM LOGIN PAGE
const currentUser = JSON.parse(localStorage.getItem("kindcircleUser"));

if (!currentUser) {
    window.location.href = "login.html";
}


// SUPABASE CONNECTION
const supabaseUrl = 'https://evxldgwevjzkxucbcdht.supabase.co';
const supabaseKey = 'sb_publishable_cuBPqf6qV_g_7pcyTlJ-pQ_IbzcUzdW';

const profileSupabase = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);


// LOAD PROFILE FROM DATABASE
async function loadProfile() {

    const { data:user, error } = await profileSupabase
        .from("members")
        .select("full_name, email, coins")
        .eq("email", currentUser.email)   // ✅ matches your schema
        .single();

    if (error) {
        console.log("Profile error:", error);
        return;
    }

    // DISPLAY NAME + EMAIL
    document.getElementById("name").innerText = user.full_name;
    document.getElementById("email").innerText = user.email;

    // DISPLAY COINS (HANDLE NULL)
    document.getElementById("points").innerText = user.coins || 0;

    // CREATE AVATAR INITIALS
    const avatar = document.getElementById("avatar");

    if (avatar && user.full_name) {
        const initials = user.full_name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase();

        avatar.innerText = initials;
    }
}

loadProfile();
