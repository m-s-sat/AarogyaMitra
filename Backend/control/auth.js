require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/auth');

exports.createUser = (req, res)=>{
    try{
        const { username, password, confirmPassword } = req.body;
        if(password!==confirmPassword) return res.status(400).json('password did not match');
        bcrypt.hash(password, parseInt(process.env.SALT), async(err,hashedPassword)=>{
            if(err) return res.status(500).json('facing problem in hashing passsword');
            const user = new User({username:username, password:hashedPassword});
            await user.save();
            req.login(user, (err)=>{
                if(err) res.status(401);
                res.redirect('/')
            })
        });
    }
    catch(err){
        res.status(500).json(err);
    }
}
exports.getUser = (req, res)=>{
    if(req.user) return res.status(201).json(req.user);
}