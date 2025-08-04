const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => {
                return /^[a-zA-Z0-9]+$/.test(v);
            },
            message: 'Username must contain only letters and numbers',
        },
    },
    password: {
        type: Buffer,
        required: true,
    },
    salt: {
        type: Buffer,
        required: true,
    },
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
