// 1. Initialize Supabase for the Feed logic
const feedSupabaseUrl = 'https://evxldgwevjzkxucbcdht.supabase.co';
const feedSupabaseKey = 'sb_publishable_cuBPqf6qV_g_7pcyTlJ-pQ_IbzcUzdW'; // Ensure this matches your anon key
const feedClient = window.supabase.createClient(feedSupabaseUrl, feedSupabaseKey);

// 2. Main function to load and show tasks
async function loadAvailableTasks() {
    const taskFeed = document.getElementById('task-feed');
    const userEmail = localStorage.getItem('userEmail');

    // UI Step: Reveal the feed section
    taskFeed.classList.remove('hidden');
    
    // UI Step: Scroll smoothly to the feed area
    taskFeed.scrollIntoView({ behavior: 'smooth' });

    // 3. Fetch 'open' tasks NOT created by the logged-in user
    const { data: tasks, error } = await feedClient
        .from('tasks')
        .select('*')
        .eq('status', 'open')
        .neq('created_by', userEmail);

    if (error) {
        console.error("Fetch Error:", error);
        alert("Could not load tasks: " + error.message);
        return;
    }

    // 4. Clear and Re-render the Feed
    taskFeed.innerHTML = '<h2 class="text-2xl font-black text-slate-800 mb-6 border-b pb-4">Available Opportunities</h2>';

    if (tasks.length === 0) {
        taskFeed.innerHTML += `
            <div class="text-center py-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <p class="text-slate-500 font-medium">No open requests right now. Why not post one yourself?</p>
            </div>`;
        return;
    }

    tasks.forEach(task => {
        const card = document.createElement('div');
        card.className = "glass-card p-6 rounded-3xl mb-4 border border-white flex justify-between items-center animate-in shadow-sm hover:border-blue-200 transition-all bg-white";
        card.innerHTML = `
            <div class="flex-1 pr-4">
                <div class="flex items-center gap-2 mb-2">
                    <span class="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded-md uppercase">Request</span>
                </div>
                <h3 class="font-black text-xl text-slate-800">${task.title}</h3>
                <p class="text-slate-500 mt-1 line-clamp-2">${task.description}</p>
                <div class="flex items-center gap-2 mt-4 text-blue-600 font-bold text-sm">
                    <i class="fa-solid fa-coins"></i> Reward: 5 Coins
                </div>
            </div>
            <button onclick="acceptTask('${task.id}')" class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 whitespace-nowrap">
                Accept & Help
            </button>
        `;
        taskFeed.appendChild(card);
    });
}

// 5. Logic to Accept Task and Reward +5 Coins
window.acceptTask = async (taskId) => {
    const userEmail = localStorage.getItem('userEmail');

    // Step A: Update Task Status in Database
    const { error: taskError } = await feedClient
        .from('tasks')
        .update({ 
            status: 'taken', 
            accepted_by: userEmail 
        })
        .eq('id', taskId);

    if (taskError) {
        alert("Error: " + taskError.message);
        return;
    }

    // Step B: Fetch helper's current balance
    const { data: memberData } = await feedClient
        .from('members')
        .select('coins, tasks_completed')
        .eq('email', userEmail)
        .single();

    // Step C: Update Helper's Coins (+5) and Count (+1)
    const newCoins = (memberData.coins || 0) + 5;
    const newCount = (memberData.tasks_completed || 0) + 1;

    const { error: memberError } = await feedClient
        .from('members')
        .update({ 
            coins: newCoins, 
            tasks_completed: newCount 
        })
        .eq('email', userEmail);

    if (memberError) {
        alert("Task accepted, but coins failed to update.");
    } else {
        alert("Amazing! You've accepted the task and earned 5 Kindness Coins! 🪙");
        
        // Refresh the balance on the UI
        if (typeof updateStats === 'function') {
            updateStats(userEmail);
        } else {
            // Fallback: reload page if updateStats isn't available
            location.reload();
        }
        
        // Refresh the task list
        loadAvailableTasks();
    }
};