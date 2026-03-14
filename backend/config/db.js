const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const dbPath = process.env.NODE_ENV === 'production' 
  ? '/tmp/lms.db' 
  : path.resolve(__dirname, '../lms.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run('PRAGMA foreign_keys = ON');
  }
});

module.exports = {
  query: (text, params = []) => {
    return new Promise((resolve, reject) => {
      const isSelect = text.trim().toLowerCase().startsWith('select');
      if (isSelect) {
        db.all(text, params, (err, rows) => {
          if (err) return reject(err);
          resolve({ rows });
        });
      } else {
        db.run(text, params, function(err) {
          if (err) return reject(err);
          resolve({ rows: { insertId: this.lastID, changes: this.changes } });
        });
      }
    });
  },
};
