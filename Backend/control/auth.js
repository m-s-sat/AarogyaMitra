require('dotenv').config();
const bcrypt = require('bcrypt');
const User = require('../model/auth');
const jwt = require('jsonwebtoken');

exports.createUser = async(req,res) => {
    const {username, password, confirmPassword} = req.body;
    if(password!==confirmPassword){
        return res.status(401).json('Password are not matching');
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    const user = new User({username:username, password:hashedPassword, salt});
    await user.save();
    req.login(user,(err) => {
        if(err) return res.status(401).json(err);
        const token = jwt.sign({userId:user.id},process.env.JWT_SECRET, {expiresIn:'1h'});
        res.status(201).cookie('token',token,{httpOnly:true, secure:false, maxAge:3600000}).json({token});
    });
};
exports.loginUser = async (req,res) => {
    const {username, password} = req.body;
    const user = await User.findOne({'username':username});
    if(!user) return res.send(400).json({message:'user not found'});
    const salt = await bcrypt.genSalt(10);
    
}
