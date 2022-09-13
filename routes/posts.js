const express = require("express");
const User = require("../module/user");
const Post = require("../module/post")
const { body, validationResult } = require('express-validator');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.secret;


router.use(express.json());
router.use(express.urlencoded({extended:false}));

//this creates post for authenticated user
router.post("/",body("title").isAlphanumeric(), body("body").isAlphanumeric(),async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    req.body.user = req.user;
   
    try{
        await Post.create(req.body);
        res.status(200).json({
            status:"Success",
            data:req.body
        })
    }catch(e){
        res.status(401).json({
            status:"Failed",
            message : e.message
        })
    }
    
});

// this to get all posts by a pertucullar user

router.get("/",async (req,res)=>{
    const data = await Post.find({user:req.user});
    res.status(200).json({
        posts:data
    })
});

//to update the post by user
router.put("/:id",async(req,res)=>{
    
        try{
            await Post.findByIdAndUpdate(req.params.id,req.body);
            res.status(200).json({
                status:"Success",
                message:"post is updated"
            })
    
        }catch(e){
            res.status(400).json({
                status:"failed",
                message:e.message
            })
        }
    
   
});

//this is to delete the post
router.delete("/:id",async(req,res)=>{
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status:"Success",
            message:"post Deleted"
        })
    }catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});


module.exports = router;