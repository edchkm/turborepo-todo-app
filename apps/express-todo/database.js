const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function initializeDatabase() {
  try {
    const db = await open({
      filename: "./database.db",
      driver: sqlite3.Database,
    });

    const createTableSql = `
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await db.exec(createTableSql);
    console.log("Database initialized and 'todos' table is ready.");

    return db;
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

module.exports = { initializeDatabase };
