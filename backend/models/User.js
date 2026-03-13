const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create({ name, email, password, role = 'student' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    // In SQLite, result.rows is { insertId, changes }
    const insertId = result.rows.insertId;
    return this.findById(insertId);
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    return result.rows[0];
  }

  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE user_id = ?', [id]);
    return result.rows[0];
  }
}

module.exports = User;
