const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
     required:true,
      trim: true,
      
    },
    patientEmail: {
      type: String,
     required: true,
      trim: true,
      lowercase: true,
      
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true, // This will automatically add createdAt and updatedAt fields
  }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
