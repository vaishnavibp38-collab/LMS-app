const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const dbPath = isProd ? '/tmp/lms.db' : path.resolve(__dirname, '../lms.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
    db.run('PRAGMA foreign_keys = ON');

    // On Vercel, the /tmp directory is empty on boot. We MUST initialize the tables.
    if (isProd) {
      try {
        console.log('Production: Initializing schema in /tmp/lms.db...');
        const schemaPath = path.resolve(__dirname, '../schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(s => s.trim() !== '');

        db.serialize(() => {
          for (let statement of statements) {
            db.run(statement);
          }
        });
        console.log('Production: Schema initialized successfully.');
      } catch (error) {
        console.error('Failed to initialize schema:', error);
      }
    }
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
