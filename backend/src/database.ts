import { Database } from 'bun:sqlite';

export const setupDatabase = async (): Promise<Database> => {
  const db = new Database('./sql/mydb.sqlite');
  db.run("CREATE TABLE IF NOT EXISTS games (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL);");
  db.run("CREATE TABLE IF NOT EXISTS votes (id INTEGER PRIMARY KEY AUTOINCREMENT, game_name TEXT NOT NULL, user_name TEXT NOT NULL);");
  return db;
};

const db = await setupDatabase();

export default db;