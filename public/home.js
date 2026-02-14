// 1. INITIALIZE SUPABASE
const supabaseUrl = 'https://evxldgwevjzkxucbcdht.supabase.co';
const supabaseKey = 'sb_publishable_cuBPqf6qV_g_7pcyTlJ-pQ_IbzcUzdW'; 
const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    // 2. ELEMENTS
    const modal = document.getElementById('post-modal');
    const openModalBtn = document.getElementById('open-post-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const helpForm = document.getElementById('help-form');
    const taskFeed = document.getElementById('task-feed');
    const welcomeTitle = document.getElementById('welcome-title');

    // 3. SESSION CHECK
    const userEmail = localStorage.getItem('userEmail');
    const userName = localStorage.getItem('userName');

    if (!userEmail) {
        window.location.href = 'login.html'; 
        return;
    }

    if (welcomeTitle) welcomeTitle.innerText = `Welcome, ${userName || 'Student'}!`;
    updateStats(userEmail);

    // 4. MODAL CONTROL
    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    // 5. POST A HELP REQUEST
    helpForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('task-title').value;
        const description = document.getElementById('task-desc').value;

        const { error } = await supabaseClient
            .from('tasks')
            .insert([{ 
                title: title, 
                description: description, 
                created_by: userEmail,
                status: 'open' 
            }]);

        if (error) {
            console.error("Post Error:", error);
            alert("Error: " + error.message);
        } else {
            alert("Request posted successfully! 🌟");
            modal.classList.add('hidden');
            helpForm.reset();
            if (!taskFeed.classList.contains('hidden')) loadAvailableTasks();
        }
    });

    // 6. LOAD AVAILABLE TASKS
    window.loadAvailableTasks = async () => {
        taskFeed.classList.remove('hidden');
        taskFeed.innerHTML = '<h2 class="text-2xl font-black text-slate-800 mb-6 italic">Searching for opportunities...</h2>';

        const { data: tasks, error } = await supabaseClient
            .from('tasks')
            .select('*')
            .eq('status', 'open')
            .neq('created_by', userEmail); 

        if (error) {
            console.error("Fetch Error:", error);
            taskFeed.innerHTML = '<p class="text-red-500">Failed to load tasks.</p>';
            return;
        }

        taskFeed.innerHTML = '<h2 class="text-2xl font-black text-slate-800 mb-6 border-b pb-4">Available Opportunities</h2>';
        
        if (tasks.length === 0) {
            taskFeed.innerHTML += `
                <div class="p-10 text-center bg-white/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                    <p class="text-slate-500 italic">No open requests right now. Check back later!</p>
                </div>`;
            return;
        }

        tasks.forEach(task => {
            const card = document.createElement('div');
            card.className = "glass-card p-6 rounded-3xl mb-4 border border-white flex justify-between items-center bg-white shadow-sm hover:border-blue-200 transition-all animate-in";
            card.innerHTML = `
                <div>
                    <h3 class="font-black text-xl text-slate-800">${task.title}</h3>
                    <p class="text-slate-500 mt-1">${task.description}</p>
                    <div class="mt-3 text-blue-600 font-bold text-sm">
                        <i class="fa-solid fa-coins"></i> Reward: 5 Coins
                    </div>
                </div>
                <button onclick="acceptTask('${task.id}')" class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-50">
                    Accept
                </button>
            `;
            taskFeed.appendChild(card);
        });
        
        taskFeed.scrollIntoView({ behavior: 'smooth' });
    };

    // 7. ACCEPT A TASK & EARN COINS
    window.acceptTask = async (taskId) => {
        const { error: taskErr } = await supabaseClient
            .from('tasks')
            .update({ status: 'taken', accepted_by: userEmail })
            .eq('id', taskId);

        if (taskErr) return alert("Task error: " + taskErr.message);

        const { data: member } = await supabaseClient
            .from('members')
            .select('coins, tasks_completed')
            .eq('email', userEmail)
            .single();

        const { error: updateErr } = await supabaseClient
            .from('members')
            .update({ 
                coins: (member.coins || 0) + 5,
                tasks_completed: (member.tasks_completed || 0) + 1
            })
            .eq('email', userEmail);

        if (updateErr) {
            alert("Task accepted, but coins failed to update.");
        } else {
            alert("Success! You earned 5 coins! 🪙");
            updateStats(userEmail); 
            loadAvailableTasks(); 
        }
    };

    // 8. CHAT TOGGLE LOGIC (Planning Phase)
    window.toggleChat = () => {
        const chatPreview = document.getElementById('chat-preview');
        const chatIcon = document.getElementById('chat-icon');
        const closeIcon = document.getElementById('close-chat-icon');

        if (chatPreview && chatIcon && closeIcon) {
            const isHidden = chatPreview.classList.contains('hidden');
            if (isHidden) {
                chatPreview.classList.remove('hidden');
                chatIcon.classList.add('hidden');
                closeIcon.classList.remove('hidden');
            } else {
                chatPreview.classList.add('hidden');
                chatIcon.classList.remove('hidden');
                closeIcon.classList.add('hidden');
            }
        }
    };

    // 9. LOGOUT
    window.logout = () => {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('kindcircleUser');
        window.location.href = 'login.html'; 
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', window.logout);
});

async function updateStats(email) {
    const { data } = await supabaseClient
        .from('members')
        .select('coins, tasks_completed')
        .eq('email', email)
        .single();
    
    if (data) {
        const coinEl = document.getElementById('coin-count');
        const taskEl = document.getElementById('task-count');
        
        if (coinEl) coinEl.innerText = data.coins || 0;
        if (taskEl) taskEl.innerText = data.tasks_completed || 0;
    }
}