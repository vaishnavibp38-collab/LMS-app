const db = require('../config/db');

class Lesson {
  static async getBySectionId(sectionId) {
    const result = await db.query('SELECT * FROM lessons WHERE section_id = ? ORDER BY order_number', [sectionId]);
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM lessons WHERE lesson_id = ?', [id]);
    return result.rows[0];
  }

  static async getByCourseId(courseId) {
    const result = await db.query(`
      SELECT l.* FROM lessons l
      JOIN sections s ON l.section_id = s.section_id
      WHERE s.course_id = ?
      ORDER BY s.order_number, l.order_number
    `, [courseId]);
    return result.rows;
  }
}

module.exports = Lesson;
