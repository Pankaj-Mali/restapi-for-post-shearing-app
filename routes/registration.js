const express = require("express");
const User = require("../module/user");
const { body, validationResult } = require('express-validator');
const bcrypt = require("bcrypt");


const router = express.Router();


router.use(express.json());
router.use(express.urlencoded({extended:false}));

router.get("/",(req,res)=>{
    res.json({messgae:"Welcome to register Page"})
});


router.post("/",body("name").isAlpha(), body("email").isEmail(), async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try{
        var password = req.body.password;
        password = await bcrypt.hash(password,10);
        req.body.password = password;
        await User.create(req.body);
        res.json({
            status: "success",
            data: req.body
        })
    }catch(e){
        res.json({
            status:"failure",
            message: e.message
        })
    }
});

module.exports = router;