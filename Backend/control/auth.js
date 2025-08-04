require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/auth');

exports.createUser = (req, res)=>{
    try{
        const { username, name, password, confirmPassword, phone, preferredLanguage, avatar } = req.body;
        if(password!==confirmPassword) return res.status(400).json('password did not match');
        bcrypt.hash(password, parseInt(process.env.SALT), async(err,hashedPassword)=>{
            if(err) return res.status(500).json('facing problem in hashing passsword');
            const user = new User({username:username,name ,password:hashedPassword, phone, preferredLanguage, avatar});
            await user.save();
            req.login(user, (err)=>{
                if(err) res.status(401);
                // res.redirect('/')
                res.json(user);
            })
        });
    }
    catch(err){
        res.status(500).json(err);
    }
}
exports.loginUser = (req,res)=>{
    if(req.user) return res.status(200).json(req.user);
    res.status(401).json('unauthorized')
}
exports.getUser = (req, res)=>{
    if(req.user) return res.status(201).json(req.user);
    res.status(401).json("unauthorized");
}
exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.session.destroy((err)=>{
            if(err) return res.status(500).json({message:"unable to destroy the session"});
            res.clearCookie('connect.sid');
            return res.status(200).json({message:'logout successfully'});
        })
    })
}