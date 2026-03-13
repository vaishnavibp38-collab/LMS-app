const Enrollment = require('../models/Enrollment');

exports.enroll = async (req, res) => {
  try {
    const { course_id } = req.body;
    const enrollment = await Enrollment.enroll(req.user.id, course_id);
    res.status(201).json(enrollment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.getByUser(req.user.id);
    res.json(enrollments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
