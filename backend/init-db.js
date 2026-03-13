const db = require('./config/db');
const fs = require('fs');

async function initDB() {
  console.log('Starting SQLite database initialization...');

  const schema = fs.readFileSync('schema.sql', 'utf8');
  // SQLite supports multiple statements if executed via 'exec'
  // But my wrapper uses 'run'/'all'.
  // However, for initialization, I'll use raw sqlite3 'exec' if possible or split.
  
  // Let's use the wrapper's query method for each statement to be safe.
  const statements = schema.split(';').filter(s => s.trim() !== '');
  
  for (let statement of statements) {
    await db.query(statement);
  }

  console.log('SQLite Schema initialized successfully at lms.db');
}

initDB().catch(err => {
  console.error('Initialization failed:', err.message);
  process.exit(1);
});
