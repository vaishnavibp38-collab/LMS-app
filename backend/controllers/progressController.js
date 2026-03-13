const Progress = require('../models/Progress');

exports.updateProgress = async (req, res) => {
  try {
    const { course_id, lesson_id, status } = req.body;
    const progress = await Progress.update(req.user.id, course_id, lesson_id, status);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProgress = async (req, res) => {
  try {
    const { course_id, user_id } = req.params;
    const progress = await Progress.getProgress(user_id, course_id);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLastWatched = async (req, res) => {
  try {
    const { course_id } = req.params;
    const lastWatched = await Progress.getLastWatched(req.user.id, course_id);
    res.json(lastWatched);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
