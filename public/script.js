// Initialize Supabase
const supabaseUrl = 'https://evxldgwevjzkxucbcdht.supabase.co';
const supabaseKey = 'sb_publishable_cuBPqf6qV_g_7pcyTlJ-pQ_IbzcUzdW';
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('toggle-btn');
    const toggleText = document.getElementById('toggle-text');
    const formTitle = document.getElementById('form-title');
    const nameContainer = document.getElementById('name-container');
    const submitBtn = document.getElementById('submit-btn');
    const authForm = document.getElementById('auth-form');

    let isSignUp = false;

    // Toggle between Login & Signup
    toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;

        if (isSignUp) {
            formTitle.innerText = "Student Sign Up";
            nameContainer.classList.remove('hidden');
            submitBtn.innerText = "Register Now";
            toggleText.innerText = "Already joined?";
            toggleBtn.innerText = "Sign In";
        } else {
            formTitle.innerText = "Member Login";
            nameContainer.classList.add('hidden');
            submitBtn.innerText = "Sign In";
            toggleText.innerText = "New student?";
            toggleBtn.innerText = "Create Account";
        }
    });

    // Submit
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('passkey').value;
        const name = document.getElementById('name').value;

        console.log("Form submitted:", { isSignUp, email, name });

        if (isSignUp) {
            // Check if already exists
            const { data: existingUser, error: checkError } = await supabaseClient
                .from('members')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (checkError) {
                console.error("CHECK ERROR:", checkError);
                alert(checkError.message);
                return;
            }

            if (existingUser) {
                alert("This email is already registered. Try logging in!");
                return;
            }

            // Insert
            const { error: insertError } = await supabaseClient
                .from('members')
                .insert([{ email: email, passkey: password, full_name: name }]);

            if (insertError) {
                console.error("INSERT ERROR:", insertError);
                alert(insertError.message);
                return;
            }

            alert("Account created! You can now Sign In.");
            toggleBtn.click(); // go back to login

        } else {
            // LOGIN
            const { data: user, error: loginError } = await supabaseClient
                .from('members')
                .select('*')
                .eq('email', email)
                .eq('passkey', password)
                .maybeSingle();

            if (loginError) {
                console.error("LOGIN ERROR:", loginError);
                alert(loginError.message);
                return;
            }

            if (user) {
                // --- ADDED FOR HOME PAGE INTEGRATION ---
                localStorage.setItem('userEmail', user.email);
                localStorage.setItem('userName', user.full_name);
                
                alert(`Welcome back, ${user.full_name}!`);
                
                // Redirect to the home page route
                window.location.href = '/home'; 
                // ---------------------------------------
            } else {
                alert("Invalid email or passkey.");
            }
        }
    });
});
