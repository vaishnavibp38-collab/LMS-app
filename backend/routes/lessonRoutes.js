const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

router.get('/course/:id', lessonController.getLessonsByCourse);
router.get('/:lesson_id', lessonController.getLessonById);

module.exports = router;
