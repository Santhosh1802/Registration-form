const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const port=process.env.PORT||3000;
const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.nhfk7.mongodb.net/registrationFormDB`);

const registrationSchema=new mongoose.Schema({
    name:String,
    age:Number,
    class_:String,
    email:String,
    password:String
});

const Registration=mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/pages/index.html");
})
app.post("/submit",async (req,res)=>{
    try{
        const {name,age, class_,email, password}=req.body;
        
        const existuser=await Registration.findOne({email:email})
        
        if(!existuser){
        const registrationData=new Registration({
            name,
            age,
            class_,
            email,
            password
        });
       await registrationData.save();
       res.redirect("/success");
    }
    else{
        console.log("User already exist");
        res.redirect("/error");
    }
}
    catch (error){
        console.log(error);
        res.redirect("/error")
    }
})
app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
})

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
})


app.listen(port,()=>{
    console.log(`server is runnong on port ${port}`)
})