const db = require('../config/db');

class Enrollment {
  static async enroll(userId, courseId) {
    const result = await db.query(
      'INSERT OR IGNORE INTO enrollments (user_id, course_id) VALUES (?, ?)',
      [userId, courseId]
    );
    return result.rows;
  }

  static async isEnrolled(userId, courseId) {
    const result = await db.query(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );
    return result.rows.length > 0;
  }

  static async getByUser(userId) {
    const result = await db.query(`
      SELECT c.* FROM courses c
      JOIN enrollments e ON c.course_id = e.course_id
      WHERE e.user_id = ?
    `, [userId]);
    return result.rows;
  }
}

module.exports = Enrollment;
