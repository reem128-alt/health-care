const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const DoctorController = require("../controller/doctorController");

router.get("/", DoctorController.getAllDoctors);
router.get("/:id", DoctorController.getDoctorById);
router.post("/", upload.single("imageUrl"), DoctorController.createDoctor);
router.put("/:id", upload.single("imageUrl"), DoctorController.updateDoctor);
router.delete("/:id", DoctorController.deleteDoctor);

module.exports = router;