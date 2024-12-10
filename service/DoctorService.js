const pool = require("../db");

exports.createDoctor = (name, email, specialization, weeklySchedule) => {
  return new Promise((resolve, reject) => {

    // Validate essential fields
    if (!name || !email || !specialization || !Array.isArray(weeklySchedule)) {
      return reject({
        success: false,
        message: "All fields (name, email, specialization, weeklySchedule) are required.",
      });
    }

    // Check if the weekly schedule is empty or invalid
    if (weeklySchedule.length === 0) {
      return reject({
        success: false,
        message: "A valid weekly schedule is required and cannot be empty.",
      });
    }

    for (const schedule of weeklySchedule) {
      if (!schedule.dayOfWeek || !schedule.startTime || !schedule.endTime) {
        return reject({
          success: false,
          message: "Each schedule entry must have a dayOfWeek, startTime, and endTime.",
        });
      }
    }

    // Check for duplicate email
    const duplicateCheckQuery = "SELECT * FROM doctors WHERE email = ?";
    pool.query(duplicateCheckQuery, [email], (err, result) => {
      if (err) return reject({ success: false, message: "Database error.", error: err });

      if (result.length > 0) {
        return reject({
          success: false,
          message: `Doctor with email ${email} already exists.`,
        });
      }

      // Insert doctor data into the database
      const insertQuery =
        "INSERT INTO doctors (name, email, specialization, weeklySchedule) VALUES (?, ?, ?, ?)";
      const jsonWeeklySchedule = JSON.stringify(weeklySchedule);

      pool.query(insertQuery, [name, email, specialization, jsonWeeklySchedule], (insertErr, insertResult) => {
        if (insertErr) return reject({ success: false, message: "Database error.", error: insertErr });

        resolve({
          success: true,
          id: insertResult.insertId,
          name,
          email,
          specialization,
          weeklySchedule: weeklySchedule.map(schedule => ({
            dayOfWeek: schedule.dayOfWeek,
            startTime: schedule.startTime + ":00",
            endTime: schedule.endTime + ":00",
          })),
        });
      });
    });
  });
};

exports.getAllDoctors = () => {
  return new Promise((resolve, reject) => {
    const query = "SELECT id, email, name, specialization FROM doctors";

    pool.query(query, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        return reject(err);
      }

      if (!results || results.length === 0) {
        return reject({
          success: false,
          message: "Doctor not found for hospital."
        });
      }

      resolve(results);
    });
  });
};
exports.getDoctorById = () => ({ msg: "test" });
exports.updateDoctorDetails = () => ({ msg: "test" });
exports.deleteDoctor = (id) => {
  return new Promise((resolve, reject) => {

    const getId = `SELECT * FROM doctors WHERE ID = ${id}`

    pool.query(getId, (err, result) => (
      console.log(result)
    ))

    const deleteQuery = `DELETE FROM doctors WHERE id=${id}`

    pool.query(deleteQuery, (err, result) => {
      if (err) {
        return reject(err)
      }
      if (result.length === 0) {
        return reject({
          "success": false,
          "message": "Doctor not found for hospital."
        })
      }
      console.log(result)
      return resolve({ success: true })
    })
  })
}
exports.searchDoctorsBySpecialization = () => ({ msg: "test" });
exports.addDoctorLeave = () => ({ msg: "test" });
exports.deleteDoctorLeave = () => ({ msg: "test" });
exports.getDoctorAvailability = () => ({ msg: "test" });
