const express = require("express");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const supabaseUrl = "https://mllhwywquaoyaoriktys.supabase.co";
const supabaseKey = "sb_publishable_TmcR0-GCM6XboBHo7Tq0hA_BcgIQW3L";

const supabase = createClient(supabaseUrl,supabaseKey);

app.get("/posts", async(req,res)=>{

const {data,error} = await supabase
.from("posts")
.select("*")
.order("id",{ascending:false});

res.json(data);
});

app.post("/posts", async(req,res)=>{

const {title,description} = req.body;

const {data,error} = await supabase
.from("posts")
.insert([{title,description}])
.select();

res.json(data[0]);
});

app.post("/help/:id", async(req,res)=>{

const id = req.params.id;

await supabase
.from("posts")
.update({helped:true})
.eq("id",id);

res.json({success:true});
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/login.html");
});

app.listen(3000,()=>{
console.log("Server running http://localhost:3000");
});
