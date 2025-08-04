const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        required: true,
        unique: true
    },
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required: true
    },
    phone:{
        type:String,
        required: true
    },
    preferredLanguage:{
        type: String,
        required: true,
    },
    avatar:{
        type: String
    }
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.salt;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
