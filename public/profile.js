// 1. GET LOGGED USER (Using the same keys as your Home/Login page)
const userEmail = localStorage.getItem("userEmail");

// If no email is found, they aren't logged in
if (!userEmail) {
    window.location.href = "login.html";
}

// 2. SUPABASE CONNECTION
const supabaseUrl = 'https://evxldgwevjzkxucbcdht.supabase.co';
const supabaseKey = 'sb_publishable_cuBPqf6qV_g_7pcyTlJ-pQ_IbzcUzdW';
const profileSupabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 3. LOAD PROFILE FROM DATABASE
async function loadProfile() {
    console.log("Loading profile for:", userEmail);

    const { data: user, error } = await profileSupabase
        .from("members")
        .select("full_name, email, coins")
        .eq("email", userEmail) // Use the email we just got from localStorage
        .maybeSingle(); // Safer than .single()

    if (error) {
        console.error("Profile error:", error);
        return;
    }

    if (!user) {
        console.warn("No user record found in members table.");
        document.getElementById("name").innerText = "User Not Found";
        return;
    }

    // DISPLAY NAME + EMAIL
    document.getElementById("name").innerText = user.full_name || "Kind Student";
    document.getElementById("email").innerText = user.email;

    // DISPLAY COINS
    document.getElementById("points").innerText = user.coins || 0;

    // CREATE AVATAR INITIALS
    const avatar = document.getElementById("avatar");
    if (avatar && user.full_name) {
        const initials = user.full_name
            .split(" ")
            .filter(n => n.length > 0)
            .map(n => n[0])
            .join("")
            .toUpperCase();
        avatar.innerText = initials.substring(0, 2); // Limit to 2 initials
    }
}

loadProfile();