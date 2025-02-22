const Appointment = require("../model/Appointment");
const errorHandler = require("../middleware/error");

// Get all appointments
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctor", "name speciality imageUrl")

    if (!appointments) {
      return next(errorHandler(404, "No appointments found"));
    }
    res.status(200).json(appointments);
  } catch (error) {
    next(error);
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctor", "name speciality imageUrl")
      

    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
const getAppointmentByDoctorId = async (req, res, next) => {
  try {
    const appointment = await Appointment.find({ doctor: req.params.id });
    if (!appointment) {
      return next(errorHandler(404, "appointment not found"));
    }
    return res.status(200).json(appointment);
  } catch (error) {
    next(error);
  }
};
// Create new appointment
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, patientName, patientEmail, date, time, status } = req.body;

    // Check if there's already an appointment at the same time
    const existingAppointment = await Appointment.findOne({
      doctor: doctorId,
      date,
      time,
      
    });

    if (existingAppointment) {
      return next(errorHandler(400, "This time slot is already booked"));
    }

    const appointment = new Appointment({
      doctor: doctorId,
      patientEmail,
      patientName,
      date,
      time,
      status: status || "pending",
    });

    const savedAppointment = await appointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    next(error);
  }
};

// Update appointment
const updateAppointment = async (req, res, next) => {
  try {
    const { status, date, time } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }

    // If changing date/time, check for conflicts
    if (
      (date && date !== appointment.date) ||
      (time && time !== appointment.time)
    ) {
      const existingAppointment = await Appointment.findOne({
        doctor: appointment.doctor,
        date: date || appointment.date,
        time: time || appointment.time,
        _id: { $ne: req.params.id },
      });

      if (existingAppointment) {
        return next(errorHandler(400, "This time slot is already booked"));
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    )
      .populate("doctor", "name speciality imageUrl")

    res.status(200).json(updatedAppointment);
  } catch (error) {
    next(error);
  }
};

// Delete appointment
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id);
    if (!appointment) {
      return next(errorHandler(404, "Appointment not found"));
    }
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentByDoctorId,
};
