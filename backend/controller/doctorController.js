const Doctor = require('../model/Doctor');
const errorHandler = require('../middleware/error');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      const uploadOptions = {
        folder: 'doctors'
      };

      // Use buffer if available, otherwise use file path
      const result = req.file.buffer 
        ? await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, uploadOptions)
        : await cloudinary.uploader.upload(req.file.path, uploadOptions);
      
      doctorData.imageUrl = result.url;
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
      // Delete previous image from Cloudinary if it exists
      if (doctor.imageUrl) {
        const publicId = doctor.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`doctors/${publicId}`);
      }

      // Upload new image to Cloudinary
      const result = req.file.buffer
        ? await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`, {
            folder: 'doctors'
          })
        : await cloudinary.uploader.upload(req.file.path, {
            folder: 'doctors'
          });
      updateData.imageUrl = result.url;
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

    // Delete associated image from Cloudinary if it exists
    if (doctor.imageUrl) {
      const publicId = doctor.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`doctors/${publicId}`);
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
