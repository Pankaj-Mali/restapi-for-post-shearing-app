const express = require("express");
const User = require("../module/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.secret;

router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get("/" , (req,res)=>{

    res.json({
        message:"please login"
    })
});

router.post("/",body("email").isEmail(), async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

        const email = req.body.email ;
        const password = req.body.password;
        const userData = await User.findOne({email:email});

        if(userData != null){
            let inputData = await bcrypt.compare(password,userData.password);
            if(inputData){
                const token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60*2),
                    data: userData._id,
                  }, secret);
                res.status(200).json({
                    status:"Success",
                    message:token
                })
            }else{
                 return res.status(401).json({
                    status:"failuar",
                    message: "WRONG PASSWORD"
                 })
            }
        }else{
            res.status(401).json({
                status:"Failed",
                message:"Email id doesnot match"
            });
        }

    
});


module.exports=router;