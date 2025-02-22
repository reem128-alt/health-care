const express = require("express");
const router = express.Router();
const appointmentController = require("../controller/appointmentController");

// Get all appointments
router.get("/", appointmentController.getAllAppointments);

// Get appointment by ID
router.get("/:id", appointmentController.getAppointmentById);
// Get appointment by doctor id
router.get("/doctor/:id", appointmentController.getAppointmentByDoctorId);
// Create new appointment
router.post("/", appointmentController.createAppointment);

// Update appointment
router.put("/:id", appointmentController.updateAppointment);

// Delete appointment
router.delete("/:id", appointmentController.deleteAppointment);

module.exports = router;
