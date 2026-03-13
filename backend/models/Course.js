const db = require('../config/db');

class Course {
  static async getAll() {
    const result = await db.query('SELECT * FROM courses ORDER BY created_at DESC');
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query('SELECT * FROM courses WHERE course_id = ?', [id]);
    return result.rows[0];
  }

  static async create({ title, description, thumbnail, category, price = 0, instructor_id }) {
    const result = await db.query(
      'INSERT INTO courses (title, description, thumbnail, category, price, instructor_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, thumbnail, category, price, instructor_id]
    );
    const insertId = result.rows.insertId;
    return this.getById(insertId);
  }

  static async search(query) {
    const result = await db.query(
      'SELECT * FROM courses WHERE title LIKE ? OR description LIKE ?',
      [`%${query}%`, `%${query}%`]
    );
    return result.rows;
  }
}

module.exports = Course;
