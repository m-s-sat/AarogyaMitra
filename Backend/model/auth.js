const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default: '' },
  phone: { type: String, unique: true },
  preferredLanguage: { type: String, required: true },
  avatar: { type: String, default: '' },
  role: { type: String, required: true },
  pincode: { type: Number },
  age: { type: String },
  gender: { type: String },
  emergencyContact: { type: Object },
  medicalHistory: { type: Object },
  bodyMeasurements: { type: Object },
  weeklyLogs: {
    weight: String,
    waistCircumference: String,
    sleepHours: String,
    restingHeartRate: String,
    bloodPressure: {
      systolic: String,
      diastolic: String
    },
    waterIntake: String,
    energyLevel: String,
    appetiteChanges: String,
    symptoms: [String],
    exerciseFrequency: String,
    conditionSpecific: {
      bloodSugar: String,
      painScore: String,
    },
    lastUpdated: { type: Date, default: Date.now() },
    weeklyReminderSent: { type: Boolean, default: false }
  }
}, { timestamps: true });

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.salt;
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
