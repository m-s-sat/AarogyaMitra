const mongoose = require('mongoose');
const { Schema } = mongoose;

const hospitalRegSchema = new Schema({
    admin: {type: Object, required: true},
    departments: {type: Array, required: true},
    emergency_contact: {type: String, required: false},
    hospital:{type: Object, required: true},
    role: {type: String, default: 'hospital'},
    visiting_hours: {
        start: {type: String, required: false},
        end: {type: String, required: false}
    },
}, { timestamps: true });

const HospitalReg = mongoose.model('HospitalReg', hospitalRegSchema);

module.exports = HospitalReg;
