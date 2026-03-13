const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, enrollmentController.enroll);
router.get('/me', authMiddleware, enrollmentController.getUserEnrollments);

module.exports = router;
