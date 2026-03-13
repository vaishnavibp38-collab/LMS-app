const db = require('../config/db');

class Progress {
  static async update(userId, courseId, lessonId, status = 'completed') {
    // SQLite syntax for UPSERT
    const result = await db.query(`
      INSERT INTO progress (user_id, course_id, lesson_id, status, completed_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET 
        status = excluded.status, 
        completed_at = excluded.completed_at
    `, [userId, courseId, lessonId, status, status === 'completed' ? new Date().toISOString() : null]);
    return result.rows;
  }

  static async getProgress(userId, courseId) {
    const totalLessonsResult = await db.query(`
      SELECT COUNT(*) as total FROM lessons l
      JOIN sections s ON l.section_id = s.section_id
      WHERE s.course_id = ?
    `, [courseId]);

    const completedLessonsResult = await db.query(`
      SELECT COUNT(*) as completed FROM progress
      WHERE user_id = ? AND course_id = ? AND status = 'completed'
    `, [userId, courseId]);

    const total = parseInt(totalLessonsResult.rows[0].total);
    const completed = parseInt(completedLessonsResult.rows[0].completed);
    
    return {
      total,
      completed,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }

  static async getLastWatched(userId, courseId) {
    const result = await db.query(`
      SELECT lesson_id FROM progress
      WHERE user_id = ? AND course_id = ?
      ORDER BY completed_at DESC LIMIT 1
    `, [userId, courseId]);
    return result.rows[0];
  }
}

module.exports = Progress;
