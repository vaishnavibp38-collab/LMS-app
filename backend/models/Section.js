const db = require('../config/db');

class Section {
  static async getByCourseId(courseId) {
    const result = await db.query('SELECT * FROM sections WHERE course_id = ? ORDER BY order_number', [courseId]);
    return result.rows;
  }
}

module.exports = Section;
