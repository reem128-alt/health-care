const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
  day: String,
  startTime: String,
  endTime: String,
  isAvailable: Boolean
});

const experienceSchema = new mongoose.Schema({
  years: Number,
  patientsServed: Number,
  specializations: [String]
});

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  speciality: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: String,
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [
      /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      'Please enter a valid email address'
    ]
  },
  phone: {
    type: String,
    match: [
      /^(\+\d{1,3}[-.]?)?\d{10}$/,
      'Please enter a valid phone number'
    ]
  },
  address: String,
  experience: experienceSchema,
  workingHours: [workingHoursSchema]
}, {
  timestamps: true
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;