const Doctor = require('../model/Doctor');
const errorHandler = require('../middleware/error');
const fs = require('fs');

// Get all doctors
const getAllDoctors = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 0; // If no limit provided, return all doctors
    const query = Doctor.find();
    
    if (limit > 0) {
      query.limit(limit);
    }
    
    const doctors = await query;
    if (!doctors) {
      return next(errorHandler(404, 'doctors not found'))
    }
    console.log('Doctor images:', doctors.map(d => ({ id: d._id, imageUrl: d.imageUrl })));
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return next(errorHandler(404, 'doctor not found'))
    }
    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new doctor
const createDoctor = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Request file:", req.file);
    
    const doctorData = { ...req.body };

    // Parse experience if it's a string
    if (typeof doctorData.experience === 'string') {
      try {
        doctorData.experience = JSON.parse(doctorData.experience);
      } catch (e) {
        console.error('Error parsing experience:', e);
      }
    }

    // Parse working hours if it's a string
    if (typeof doctorData.workingHours === 'string') {
      try {
        doctorData.workingHours = JSON.parse(doctorData.workingHours);
      } catch (e) {
        console.error('Error parsing workingHours:', e);
      }
    }

    // Add image URL if an image was uploaded
    if (req.file) {
      console.log('Uploaded file:', req.file);
      doctorData.imageUrl = `/uploads/${req.file.filename}`;  // Use the generated filename instead of original name
    }

    const doctor = new Doctor(doctorData);
    const newDoctor = await doctor.save();
    res.status(201).json(newDoctor);
  } catch (error) {
    console.error('Create doctor error:', error);
    res.status(400).json({ message: error.message });
  }
};

// Update a doctor
const updateDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const updateData = { ...req.body };

    // Parse experience if it's a string
    if (typeof updateData.experience === 'string') {
      try {
        updateData.experience = JSON.parse(updateData.experience);
      } catch (e) {
        console.error('Error parsing experience:', e);
      }
    }

    // Parse working hours if it's a string
    if (typeof updateData.workingHours === 'string') {
      try {
        updateData.workingHours = JSON.parse(updateData.workingHours);
      } catch (e) {
        console.error('Error parsing workingHours:', e);
      }
    }

    // Handle image update if a new image is uploaded
    if (req.file) {
      console.log('Uploaded file:', req.file);
      // Delete old image if it exists
      if (doctor.imageUrl) {
        const oldImagePath = doctor.imageUrl.replace('/uploads/', '');
        const fullPath = `uploads/${oldImagePath}`;
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
      updateData.imageUrl = `/uploads/${req.file.filename}`;
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDoctor);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ message: error.message });
  }
};


// Delete a doctor
const deleteDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Delete associated image if it exists
    if (doctor.imageUrl) {
      const imagePath = doctor.imageUrl.replace('/uploads/', '');
      const fullPath = `uploads/${imagePath}`;
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    await Doctor.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};