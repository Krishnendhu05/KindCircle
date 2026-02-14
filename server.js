const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());

const supabaseUrl = "https://mllhwywquaoyaoriktys.supabase.co";
const supabaseKey = "sb_publishable_TmcR0-GCM6XboBHo7Tq0hA_BcgIQW3L";

const supabase = createClient(supabaseUrl, supabaseKey);




// ================= POSTS =================

app.get("/posts", async (req,res)=>{

    const { data } = await supabase
        .from("posts")
        .select("*")
        .order("id",{ascending:false});

    res.json(data);
});


app.post("/posts", async (req,res)=>{

    const { title, description } = req.body;

    const { data } = await supabase
        .from("posts")
        .insert([{ title, description, helped:false }])
        .select();

    res.json(data[0]);
});


// ================= HELP CLICK =================

app.post("/help/:id", async (req,res)=>{

    const postId = req.params.id;
    const userId = req.body.user_id;

    // mark post helped
    await supabase
        .from("posts")
        .update({
            helped:true,
            helper_id:userId
        })
        .eq("id",postId);

    // get current points
    const { data:member } = await supabase
        .from("members")
        .select("points")
        .eq("id",userId)
        .single();

    const newPoints = (member.points || 0) + 1;

    // update points
    await supabase
        .from("members")
        .update({ points:newPoints })
        .eq("id",userId);

    res.json({success:true, coins:newCoins});
});


// ================= PROFILE =================

app.get("/profile/:id", async (req,res)=>{

    const { data } = await supabase
        .from("members")
        .select("*")
        .eq("id",req.params.id)
        .single();

    res.json(data);
});



// ================= CHAT =================

app.post("/chat", async (req,res)=>{

    const { post_id, message } = req.body;

    console.log("Chat received:", post_id, message);

    const { error } = await supabase
        .from("chats")
        .insert([{
            post_id:Number(post_id),
            sender:"helper",
            message:message
        }]);

    if(error){
        console.log(error);
        return res.status(500).json(error);
    }

    res.json({success:true});
});


app.get("/chat/:postId", async (req,res)=>{

    const { data } = await supabase
        .from("chats")
        .select("*")
        .eq("post_id",req.params.postId)
        .order("created_at",{ascending:true});

    res.json(data);
});


// ⚠️ STATIC LAST
// ===== DEFAULT ROUTE → LOGIN PAGE =====
app.get("/", (req,res)=>{
    res.sendFile(__dirname + "/public/login.html");
});

app.use(express.static("public"));

app.listen(3000,()=>{
    console.log("Server running http://localhost:3000");
});
