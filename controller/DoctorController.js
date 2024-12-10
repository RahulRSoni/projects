const express = require("express");
const router = express.Router();
const DoctorService = require("../service/DoctorService");

router.post("/create", async (req, res) => {
  const { name, email, specialization, weeklySchedule } = req.body;

  // Basic validation for null or missing fields
  if (!name || !email || !specialization || !weeklySchedule) {
    return res.status(400).json({
      success: false,
      message: "All fields (name, email, specialization, weeklySchedule) are required.",
    });
  }

  try {
    const result = await DoctorService.createDoctor(name, email, specialization, weeklySchedule);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error in createDoctor route:", error);
    const statusCode = error.success === false ? 400 : 500; // Handle structured errors gracefully
    return res.status(statusCode).json({
      success: false,
      message: error.message || "An unexpected server error occurred.",
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const doctors = await DoctorService.getAllDoctors();
    
    if (!doctors || doctors.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found for hospital."
      });
    }

    // Map the doctors to include only required fields
    const doctorInfo = doctors.map((doctor) => ({
      id: doctor.id,
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
    }));

    return res.status(200).json(doctorInfo);
  } catch (error) {
    console.error("Error fetching doctors:", error.message || error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while retrieving doctors.",
    });
  }
});



router.get("/:id", async (req, res) => {
  let result = await DoctorService.getDoctorById();
  res.send(result);
});
router.post("/update/:id", async (req, res) => {
  let result = await DoctorService.updateDoctorDetails();
  res.send(result);
});
router.post("/delete/:id", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return reject({
      success: false,
      message: 'id not found or invalid',
    });
  }

  try {
    let result = await DoctorService.deleteDoctor(id);

    if (!result) {
      return res.status(404).json(result)
    }
    return res.status(200).json({ "success": true })

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
});
router.get("/search", async (req, res) => {
  let result = await DoctorService.searchDoctorsBySpecialization();
  res.send(result);
});
router.post("/:id/leave", async (req, res) => {


  let result = await DoctorService.addDoctorLeave();
  res.send(result);
});
router.post("/:id/deleteLeave", async (req, res) => {
  let result = await DoctorService.deleteDoctorLeave();
  res.send(result);
});
router.get("/:id/availability", async (req, res) => {
  let result = await DoctorService.getDoctorAvailability();
  res.send(result);
});
module.exports = router;
