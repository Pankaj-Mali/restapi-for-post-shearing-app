const express = require("express");
const app = express();
const mongoose = require("mongoose")
const bodyparser = require("body-parser")
const login = require("./routes/login");
const register = require("./routes/registration");
const postRouts = require("./routes/posts");
const User = require("./module/user");
const jwt = require("jsonwebtoken");

const secret = process.env.secret;


mongoose.connect('mongodb://0.0.0.0/assignment',()=>{
    console.log("mongo is connected")
})

app.use(bodyparser());

//rout for resistration
app.use("/register" , register)

//login rout
app.use("/login", login);

//verify the token for the authentication of the user to wprk on posts
app.use("/post",async (req,res,next)=>{
    try{
        const token = req.headers.authorization;
        const decoded = jwt.verify(token,secret);
        const userData = await User.findOne({_id:decoded.data});
        req.user = userData._id;
        next();
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
})

// post routs
app.use("/post" , postRouts);




app.listen(3000, ()=>{
    console.log("server is up")
})