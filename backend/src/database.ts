import { Database } from 'bun:sqlite';

export const db = new Database('./sql/mydb.sqlite');

export const setupDatabase = async (): Promise<void> => {
  try {
    db.run("create table if not exists games (id integer primary key autoincrement, name text not null);")
    db.run("create table if not exists votes (id integer primary key autoincrement, game_id integer not null, user_name text not null);");  
  } catch (error) {
    console.log(error);
  }
};
