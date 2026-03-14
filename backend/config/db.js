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
  }
});

// Robust initialization promise
const initPromise = new Promise((resolve, reject) => {
  if (!isProd) {
    return resolve();
  }

  try {
    console.log('Production: Initializing schema in /tmp/lms.db...');
    const schemaPath = path.resolve(__dirname, '../schema.sql');
    console.log('Looking for schema at:', schemaPath);
    
    if (!fs.existsSync(schemaPath)) {
      console.error('CRITICAL: schema.sql NOT FOUND at', schemaPath);
      return resolve(); // Resolve anyway to prevent hanging, but log the error
    }

    const schema = fs.readFileSync(schemaPath, 'utf8');
    const statements = schema.split(';').filter(s => s.trim() !== '');

    db.serialize(() => {
      let completed = 0;
      let total = statements.length;

      if (total === 0) return resolve();

      for (let statement of statements) {
        const trimmed = statement.trim();
        if (trimmed) {
          db.run(trimmed, (err) => {
            completed++;
            if (err) {
              console.error('Schema Error:', err.message);
            }
            if (completed === total) {
              console.log('Production: Schema initialization complete.');
              resolve();
            }
          });
        } else {
          completed++;
          if (completed === total) resolve();
        }
      }
    });
  } catch (error) {
    console.error('Initialization Exception:', error);
    resolve();
  }
});

module.exports = {
  query: async (text, params = []) => {
    await initPromise; // Wait for schema to be ready
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
