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
        const schemaPath = path.join(process.cwd(), 'backend', 'schema.sql');
        console.log('Looking for schema at:', schemaPath);
        
        if (!fs.existsSync(schemaPath)) {
          console.error('CRITICAL: schema.sql NOT FOUND at', schemaPath);
          return;
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');
        const statements = schema.split(';').filter(s => s.trim() !== '');

        db.serialize(() => {
          for (let statement of statements) {
            const trimmed = statement.trim();
            if (trimmed) {
              db.run(trimmed, (err) => {
                if (err) console.error('Error executing statement:', trimmed.substring(0, 50), '...', err.message);
              });
            }
          }
        });
        console.log('Production: Schema initialization commands sent to database.');
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
