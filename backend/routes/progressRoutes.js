const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/update', authMiddleware, progressController.updateProgress);
router.get('/:course_id/:user_id', authMiddleware, progressController.getProgress);
router.get('/last/:course_id', authMiddleware, progressController.getLastWatched);

module.exports = router;
