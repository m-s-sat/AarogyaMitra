const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalRegSchema = new Schema({
    role: {
        type: String,
        required: true,
        default: 'hospital'
    },
    hospital: {
        id: { type: String, required: true },
        name: { type: String, required: true },
        address: { type: String, required: true },
        type: { type: String, required: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        coordinates: {
            lat: { type: Number, required: true },
            long: { type: Number, required: true }
        }
    },
    admin: {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        phone: { type: String, required: true },
        password: { type: String, required: true }
    },
    departments: {
        type: [String],
        required: true
    },
    emergency_contact: {
        type: String
    },
    visiting_hours: {
        start: { type: String },
        end: { type: String }
    },
}, { timestamps: true });

const HospitalReg = mongoose.model('Hospitalreg', hospitalRegSchema);
module.exports = HospitalReg;