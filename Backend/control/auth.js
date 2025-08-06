require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const { sendMail } = require('../common/common');
const path = require('path');

const emailTemplate = fs.readFileSync(path.join(__dirname,'../template/emailTemplate.html'), 'utf-8');

exports.createUser = async(req, res)=>{
    try{
        const { username, name, password, confirmPassword, phone, preferredLanguage, avatar, dob, pincode } = req.body; 
        if(password!==confirmPassword) return res.status(400).json('password did not match');
        bcrypt.hash(password, parseInt(process.env.SALT), async(err,hashedPassword)=>{
            if(err) return res.status(500).json('facing problem in hashing passsword');
            const user = new User({username:username,name ,password:hashedPassword, phone, preferredLanguage, avatar, dob, pincode});
            await user.save();
            req.login(user, (err)=>{
                if(err) res.status(401);
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
exports.forgotpass = async(req,res)=>{
    try{
        const {password, confirmPassword, email, token} = req.body;
        const user = await User.findOne({username:email});
        if(!user) return res.status(400).json({message:"user not found"});
        if(password!==confirmPassword) return res.status(400).json({message:"password is not matching with the confirm password"});
        if(token!==user.resetPasswordToken) return res.status(401).json({message:'unauthorized'});
        bcrypt.hash(password, parseInt(process.env.SALT), async(err,hashedPassword)=>{
            if(err) return res.status(500).json({message:"hashing problem"});
            console.log(user.password);
            user.password = hashedPassword;
            await user.save();
            return res.status(200).json({message:"password change successfully"});
        });
    }
    catch(err){
        return res.status(500).json({message:"something went wrong"});
    }
}

exports.setForgotPassToken = async(req,res)=>{
    try{
        const {email} = req.body;
        const user = await User.findOne({username:email});
        if(!user) return res.status(400).json({message:"user not found"});
        if(user.password==='google') return res.status(400).json({message:"Your created account through the google, you can't change password. Please login through the google account."})
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        await user.save();
        const resetPageLink = 'http://localhost:5173/password-reset/?token='+token+'&email='+email;
        const subject = 'Reset password for your medimitra account';
        let html = emailTemplate.replace('{{RESET_LINK}}', resetPageLink);
        html = html.replace('{{NAME}}', user.name);
        if(email){
            const response = await sendMail({to:email, subject, html});
            return res.status(201).json({message:"We've sent a password reset link to the email address you provided."});
        }
        res.sendStatus(400);
    }
    catch(err){
        res.status(400);
    }
}

exports.updateProfile = async(req,res)=>{
    try{
        const {id} = req.user;
        const updateProfile = req.body;
        if(!updateProfile) return res.status(400).json({message:'Unable to fetch your data'});
        const user = await User.findOneAndUpdate({_id:id},updateProfile);
        if(!user) return res.status(500).json({message:'Unable to fetch your data in our database.'});
        res.status(200).json({message:"Your profile has been updated"});
    }
    catch(err){
        res.status(400).json('unable to update your profile');
    }
}