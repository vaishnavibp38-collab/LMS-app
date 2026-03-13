const Lesson = require('../models/Lesson');

exports.getLessonsByCourse = async (req, res) => {
  try {
    const lessons = await Lesson.getByCourseId(req.params.id);
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.getById(req.params.lesson_id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
