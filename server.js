const express=require("express");
const path=require("path");
const cors=require("cors");

const app=express();

app.use(cors());
 
app.use("/ext",express.static("ext"));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"/index.html"));

});

app.get("/a",(req,res)=>{
    res.sendFile(path.join(__dirname,"/index.html"));

});




app.listen(7000,()=>{
    console.log("server started");
})