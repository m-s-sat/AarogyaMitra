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
    resetPasswordToken:{
        type: String,
        default:''
    },
    phone:{
        type:String,
        required: true,
        unique: true
    },
    preferredLanguage:{
        type: String,
        required: true,
    },
    avatar:{
        type: String,
        default: ''
    },
    role:{
        type: String,
        default: 'patient'
    },
    appointment:{
        type: [String],
        default: []
    },
    medicines:{
        type: [Object],
        default: []
    }
}, {timestamps: true});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.salt;
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
